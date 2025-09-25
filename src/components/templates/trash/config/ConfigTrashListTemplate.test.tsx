import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ConfigTrashListTemplate from './ConfigTrashListTemplate';
import { useConfigStore } from '../../../stores/configStore';
import { toast } from 'react-toastify';

jest.mock('../../../stores/configStore');
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }));
jest.mock('sweetalert2', () => ({ fire: jest.fn().mockResolvedValue({ isConfirmed: true }) }));
jest.mock('../../../organisms/ManagementTable', () => (props: any) => (
  <div data-testid="table">
    {props.data.map((row: any) => (
      <div key={row._id} data-testid="row">
        <button onClick={() => props.onRestore(row)}>Restore</button>
        <button onClick={() => props.onPermanentDelete(row)}>Delete</button>
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
  </div>
));
jest.mock('../../../atoms/BAZ-Loader', () => () => <div>Loading...</div>);
jest.mock('../../../atoms/BAZ-Pagination', () => () => <div>Pagination</div>);

describe('ConfigTrashListTemplate', () => {
  const mockFetchTrashConfigs = jest.fn();
  const mockRestoreConfig = jest.fn();
  const mockDeleteConfigPermanently = jest.fn();
  beforeEach(() => {
    (useConfigStore as unknown as jest.Mock).mockReturnValue({
      configs: [
        { _id: '1', name: 'C1', slug: 'c1', status: true, configFields: [{ key: 'k', value: 'v' }] },
        { _id: '2', name: 'C2', slug: 'c2', status: false, configFields: [] },
      ],
      fetchTrashConfigs: mockFetchTrashConfigs,
      restoreConfig: mockRestoreConfig,
      deleteConfigPermanently: mockDeleteConfigPermanently,
      totalPages: 1,
      loading: false,
      error: null,
      stats: { total: 2, active: 1, inactive: 1 },
    });
    jest.clearAllMocks();
  });

  it('renders table and filters', () => {
    render(
      <MemoryRouter>
        <ConfigTrashListTemplate />
      </MemoryRouter>
    );
    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('calls onRestore when restore clicked', async () => {
    render(
      <MemoryRouter>
        <ConfigTrashListTemplate />
      </MemoryRouter>
    );
    fireEvent.click(screen.getAllByText('Restore')[0]);
    await waitFor(() => {
      expect(mockRestoreConfig).toHaveBeenCalledWith('1');
    });
  });

  it('calls onPermanentDelete when delete clicked', async () => {
    render(
      <MemoryRouter>
        <ConfigTrashListTemplate />
      </MemoryRouter>
    );
    fireEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => {
      expect(mockDeleteConfigPermanently).toHaveBeenCalledWith('1');
    });
  });

  it('shows loader when loading', () => {
    (useConfigStore as unknown as jest.Mock).mockReturnValueOnce({
      loading: true,
      configs: [],
      fetchTrashConfigs: jest.fn(),
      restoreConfig: jest.fn(),
      deleteConfigPermanently: jest.fn(),
      totalPages: 1,
      error: null,
      stats: { total: 0, active: 0, inactive: 0 },
    });
    render(
      <MemoryRouter>
        <ConfigTrashListTemplate />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
