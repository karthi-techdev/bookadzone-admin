import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FooterFormTemplate from '../FooterInfoFormTemplate';
import { useFooterStore } from '../../../stores/FooterInfoStore';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

jest.mock('../../../stores/FooterInfoStore', () => ({
  useFooterStore: {
    getState: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
  ToastContainer: () => <div>ToastContainer</div>,
}));

jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
}));

jest.mock('../../../organisms/ManagementForm', () => {
  return function MockManagementForm(props: any) {
    return (
      <form
        data-testid="footer-form"
        onSubmit={e => {
          e.preventDefault();
          props.onSubmit && props.onSubmit(e);
        }}
      >
        <input
          data-testid="description"
          type="text"
          onChange={props.onFieldChange?.description}
          name="description"
        />
        <input
          data-testid="priority"
          type="number"
          onChange={props.onFieldChange?.priority}
          name="priority"
        />
        <input
          data-testid="logo"
          type="file"
          onChange={props.onFieldChange?.logo}
          name="logo"
        />
        <button type="submit">Submit</button>
      </form>
    );
  };
});

jest.mock('../../../molecules/FormHeader', () => () => <div>FormHeader</div>);

describe('FooterFormTemplate', () => {
  const mockFetchFooterById = jest.fn();
  const mockAddFooter = jest.fn();
  const mockUpdateFooter = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useFooterStore.getState as jest.Mock).mockReturnValue({
      fetchFooterById: mockFetchFooterById,
      addFooter: mockAddFooter,
      updateFooter: mockUpdateFooter,
    });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as jest.Mock).mockReturnValue({});
    jest.clearAllMocks();
  });

  const fillForm = () => {
    fireEvent.change(screen.getByTestId('description'), {
      target: { value: 'Test Desc', name: 'description' },
    });
    fireEvent.change(screen.getByTestId('priority'), {
      target: { value: 1, name: 'priority' },
    });
    const file = new File(['dummy content'], 'dummy.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('logo'), {
      target: { files: [file] },
    });
  };

  it('renders form and submits new Footer', async () => {
    mockAddFooter.mockResolvedValueOnce({});
    render(<FooterFormTemplate />);
    fillForm();
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockAddFooter).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/footerinfo');
    });
  });

  it('renders form and updates Footer if id param exists', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '123' });
    mockFetchFooterById.mockResolvedValueOnce({ description: 'Old Desc', priority: 1, status: true });
    mockUpdateFooter.mockResolvedValueOnce({});

    render(<FooterFormTemplate />);
    await waitFor(() => expect(mockFetchFooterById).toHaveBeenCalledWith('123'));

    fireEvent.change(screen.getByTestId('description'), { target: { value: 'Updated Desc', name: 'description' } });
    fireEvent.change(screen.getByTestId('priority'), { target: { value: 5, name: 'priority' } });
    const file = new File(['dummy content'], 'dummy.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('logo'), { target: { files: [file] } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockUpdateFooter).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/footerinfo');
    });
  });

  it('shows toast error if fetch fails', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: 'bad' });
    mockFetchFooterById.mockResolvedValueOnce(null);

    render(<FooterFormTemplate />);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load footer data');
    });
  });

it('shows frontend validation error', async () => {
  render(<FooterFormTemplate />);

  // Set empty description to trigger frontend validation
  fireEvent.change(screen.getByTestId('description'), { target: { value: '', name: 'description' } });

  // Add a dummy logo so logo validation passes
  const file = new File(['dummy content'], 'dummy.png', { type: 'image/png' });
  fireEvent.change(screen.getByTestId('logo'), { target: { files: [file] } });

  fireEvent.click(screen.getByText('Submit'));

  // Wait for toast error to be called
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith('Please fix the errors before submitting');
  });

  // Ensure addFooter is not called
  expect(mockAddFooter).not.toHaveBeenCalled();
});



  it('shows toast error for backend 409 conflict', async () => {
    mockAddFooter.mockRejectedValueOnce({ response: { status: 409, data: { message: 'already exists' } } });
    render(<FooterFormTemplate />);
    fillForm();
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('already exists');
    });
  });

  it('shows toast error for backend array errors', async () => {
    mockAddFooter.mockRejectedValueOnce({
      response: { data: { errors: [{ path: 'description', message: 'Invalid' }] } },
    });
    render(<FooterFormTemplate />);
    fillForm();
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('description: Invalid');
    });
  });

  it('shows toast error for backend string error', async () => {
    mockAddFooter.mockRejectedValueOnce('string error');
    render(<FooterFormTemplate />);
    fillForm();
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('string error');
    });
  });

  it('shows toast error for backend generic error', async () => {
    mockAddFooter.mockRejectedValueOnce(new Error('generic error'));
    render(<FooterFormTemplate />);
    fillForm();
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('generic error');
    });
  });
});
