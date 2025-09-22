import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConfigFormTemplate from '../ConfigFormTemplate';
import { useConfigStore } from '../../../stores/configStore';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

jest.mock('../../../stores/configStore');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() }, ToastContainer: () => <div>ToastContainer</div> }));
jest.mock('sweetalert2', () => ({ fire: jest.fn().mockResolvedValue({ isConfirmed: true }) }));
jest.mock('../../../organisms/ManagementForm', () => (props: any) => (
  <form data-testid="config-form" onSubmit={e => { e.preventDefault(); props.onSubmit && props.onSubmit(e); }}>
    <input
      data-testid="name"
      value={props.value?.name || ''}
      onChange={e => props.onFieldChange?.name && props.onFieldChange.name(e)}
      name="name"
    />
    <input
      data-testid="slug"
      value={props.value?.slug || ''}
      onChange={e => props.onFieldChange?.slug && props.onFieldChange.slug(e)}
      name="slug"
    />
    <input
      data-testid="status"
      type="checkbox"
      checked={props.value?.status || false}
      onChange={e => props.onFieldChange?.status && props.onFieldChange.status(e)}
      name="status"
    />
    <button type="submit">Submit</button>
  </form>
));
jest.mock('../../../molecules/FormHeader', () => () => <div>FormHeader</div>);

describe('ConfigFormTemplate', () => {
  const mockFetchConfigById = jest.fn();
  const mockAddConfig = jest.fn();
  const mockUpdateConfig = jest.fn();
  const mockNavigate = jest.fn();
  beforeEach(() => {
    (useConfigStore as unknown as jest.Mock).mockReturnValue({
      fetchConfigById: mockFetchConfigById,
      addConfig: mockAddConfig,
      updateConfig: mockUpdateConfig,
    });
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as unknown as jest.Mock).mockReturnValue({});
    jest.clearAllMocks();
  });

  it('renders form and submits new config', async () => {
    mockAddConfig.mockResolvedValueOnce({});
    render(<ConfigFormTemplate />);
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Test Config', name: 'name' } });
    fireEvent.change(screen.getByTestId('slug'), { target: { value: 'test-config', name: 'slug' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(mockAddConfig).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/config');
    });
  });

  it('renders form and updates config if id param exists', async () => {
    (useParams as unknown as jest.Mock).mockReturnValue({ id: '123' });
    mockFetchConfigById.mockResolvedValueOnce({ name: 'C', slug: 'c', status: true, configFields: [{ key: 'k', value: 'v' }] });
    mockUpdateConfig.mockResolvedValueOnce({});
    render(<ConfigFormTemplate />);
    await waitFor(() => expect(mockFetchConfigById).toHaveBeenCalledWith('123'));
    // Wait for form to be rendered after loading
    await waitFor(() => expect(screen.getByTestId('config-form')).toBeInTheDocument());
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Updated C', name: 'name' } });
    fireEvent.change(screen.getByTestId('slug'), { target: { value: 'updated-c', name: 'slug' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(mockUpdateConfig).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/config');
    });
  });

  it('shows toast error if fetch fails', async () => {
    (useParams as unknown as jest.Mock).mockReturnValue({ id: 'bad' });
    mockFetchConfigById.mockRejectedValueOnce(new Error('fail'));
    render(<ConfigFormTemplate />);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load config');
    });
  });
});
