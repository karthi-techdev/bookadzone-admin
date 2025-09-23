import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FooterListTemplate from '../FooterInfoListTemplate';
import { useFooterStore } from '../../../stores/FooterInfoStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


jest.mock('../../../stores/FooterInfoStore', () => ({
  useFooterStore: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }));
jest.mock('sweetalert2', () => ({ fire: jest.fn().mockResolvedValue({ isConfirmed: true }) }));

jest.mock('../../../organisms/ManagementTable', () => (props: any) => (
  <div data-testid="table">
    {props.data.map((row: any) => (
      <div key={row._id} data-testid="row">
        <button onClick={() => props.onEdit(row)}>Edit</button>
        <button onClick={() => props.onDelete(row)}>Delete</button>
      </div>
    ))}
  </div>
));

jest.mock('../../../molecules/TableHeader', () => (props: any) => (
  <div>
    <button onClick={() => props.onSelectFilter('active')}>Active</button>
    <button onClick={() => props.onSelectFilter('inactive')}>Inactive</button>
    <button onClick={() => props.onSelectFilter('total')}>Total</button>
    <input
      data-testid="search"
      value={props.searchTerm}
      onChange={e => props.onSearchChange(e.target.value)}
    />
    <button onClick={() => props.addButtonLink && props.onSelectFilter('add')}>Add</button>
  </div>
));

jest.mock('../../../atoms/BAZ-Loader', () => () => <div>Loading...</div>);
jest.mock('../../../atoms/BAZ-Pagination', () => () => <div>Pagination</div>);

describe('FooterListTemplate', () => {
  const mockFetchFooters = jest.fn();
  const mockDeleteFooter = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useFooterStore as unknown as jest.Mock).mockReturnValue({
      footers: [
        { _id: '1', description: 'Footer1', socialmedia: 'fb', logo: 'logo1.png' },
        { _id: '2', description: 'Footer2', socialmedia: 'tw', logo: 'logo2.png' },
      ],
      fetchFooters: mockFetchFooters,
      deleteFooter: mockDeleteFooter,
      loading: false,
      error: null,
      stats: { total: 2, active: 1, inactive: 1 },
    });
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  it('renders table and filters', () => {
    render(<FooterListTemplate />);
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('navigates to edit when edit clicked', () => {
    render(<FooterListTemplate />);
    fireEvent.click(screen.getAllByText('Edit')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/footerinfo/edit/1');
  });

  it('calls deleteFooter when delete confirmed', async () => {
    render(<FooterListTemplate />);
    fireEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => {
      expect(mockDeleteFooter).toHaveBeenCalledWith('1');
    });
  });

  it('shows loader when loading', () => {
    (useFooterStore as unknown as jest.Mock).mockReturnValueOnce({
      loading: true,
      footers: [],
      fetchFooters: jest.fn(),
      deleteFooter: jest.fn(),
      stats: { total: 0, active: 0, inactive: 0 },
    });
    render(<FooterListTemplate />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error toast when error exists', async () => {
  
    (useFooterStore as unknown as jest.Mock).mockReturnValueOnce({
      loading: false,
      footers: [],
      fetchFooters: jest.fn(),
      deleteFooter: jest.fn(),
      error: 'generic error',
      stats: { total: 0, active: 0, inactive: 0 },
    });
    render(<FooterListTemplate />);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('generic error', {
        position: 'top-right',
        autoClose: 3000,
      });
    });
  });

  it('shows no footers message when empty', () => {
    (useFooterStore as unknown as jest.Mock).mockReturnValueOnce({
      loading: false,
      footers: [],
      fetchFooters: jest.fn(),
      deleteFooter: jest.fn(),
      error: null,
      stats: { total: 0, active: 0, inactive: 0 },
    });
    render(<FooterListTemplate />);
    expect(screen.getByText('No footers found for the selected filter.')).toBeInTheDocument();
  });
});
