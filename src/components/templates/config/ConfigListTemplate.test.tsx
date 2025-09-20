import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConfigListTemplate from './ConfigListTemplate';
import { useConfigStore } from '../../stores/configStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

jest.mock('../../stores/configStore');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }));
jest.mock('sweetalert2', () => ({ fire: jest.fn().mockResolvedValue({ isConfirmed: true }) }));
jest.mock('../../organisms/ManagementTable', () => (props: any) => (
  <div data-testid="table">
    {props.data.map((row: any) => (
      <div key={row._id} data-testid="row">
        <button onClick={() => props.onEdit(row)}>Edit</button>
        <button onClick={() => props.onDelete(row)}>Delete</button>
        <button onClick={() => props.onToggleStatus(row)}>Toggle</button>
      </div>
    ))}
  </div>
));
jest.mock('../../molecules/TableHeader', () => (props: any) => (
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
jest.mock('../../atoms/BAZ-Loader', () => () => <div>Loading...</div>);
jest.mock('../../atoms/BAZ-Pagination', () => () => <div>Pagination</div>);

describe('ConfigListTemplate', () => {
  const mockFetchConfigs = jest.fn();
  const mockDeleteConfig = jest.fn();
  const mockToggleStatusConfig = jest.fn();
  const mockNavigate = jest.fn();
  beforeEach(() => {
    (useConfigStore as unknown as jest.Mock).mockReturnValue({
      configs: [
        { _id: '1', name: 'C1', slug: 'c1', status: true, configFields: [{ key: 'k', value: 'v' }] },
        { _id: '2', name: 'C2', slug: 'c2', status: false, configFields: [] },
      ],
      fetchConfigs: mockFetchConfigs,
      deleteConfig: mockDeleteConfig,
      toggleStatusConfig: mockToggleStatusConfig,
      totalPages: 1,
      loading: false,
      error: null,
      stats: { total: 2, active: 1, inactive: 1 },
    });
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  it('renders table and filters', () => {
    render(<ConfigListTemplate />);
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('calls onEdit when edit clicked', () => {
    render(<ConfigListTemplate />);
    fireEvent.click(screen.getAllByText('Edit')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/config/edit/1');
  });

  it('calls onDelete and confirms', async () => {
    render(<ConfigListTemplate />);
    fireEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => {
      expect(mockDeleteConfig).toHaveBeenCalledWith('1');
    });
  });

  it('calls onToggleStatus', () => {
    render(<ConfigListTemplate />);
    fireEvent.click(screen.getAllByText('Toggle')[0]);
    expect(mockToggleStatusConfig).toHaveBeenCalledWith('1');
  });

  it('shows loader when loading', () => {
    (useConfigStore as unknown as jest.Mock).mockReturnValueOnce({
      loading: true,
      configs: [],
      fetchConfigs: jest.fn(),
      deleteConfig: jest.fn(),
      toggleStatusConfig: jest.fn(),
      totalPages: 1,
      error: null,
      stats: { total: 0, active: 0, inactive: 0 },
    });
    render(<ConfigListTemplate />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
