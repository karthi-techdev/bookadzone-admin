import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewsLetterFormTemplate from '../NewsLetterFormTemplate';
import { useNewsLetterStore } from '../../../stores/NewsLetterStore';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

jest.mock('../../../stores/NewsLetterStore', () => ({
  useNewsLetterStore: jest.fn(),
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
    const [name, setName] = React.useState(props.value?.name || '');
    const [slug, setSlug] = React.useState(props.value?.slug || '');
    const [template, setTemplate] = React.useState(props.value?.template || '');

    return (
      <form
        data-testid="newsLetter-form"
        onSubmit={e => {
          e.preventDefault();
          props.onSubmit && props.onSubmit({ name, slug, template });
        }}
      >
        <input
          data-testid="name"
          value={name}
          onChange={e => {
            setName(e.target.value);
            props.onFieldChange?.name && props.onFieldChange.name(e);
          }}
          name="name"
        />
        <input
          data-testid="slug"
          value={slug}
          onChange={e => {
            setSlug(e.target.value);
            props.onFieldChange?.slug && props.onFieldChange.slug(e);
          }}
          name="slug"
        />
        <input
          data-testid="template"
          value={template}
          onChange={e => {
            setTemplate(e.target.value);
            props.onFieldChange?.template && props.onFieldChange.template(e);
          }}
          name="template"
          type="text"
        />
        <button type="submit">Submit</button>
      </form>
    );
  };
});
jest.mock('../../../molecules/FormHeader', () => () => <div>FormHeader</div>);

describe('NewsLetterFormTemplate', () => {
  const mockFetchNewsLetterById = jest.fn();
  const mockAddNewsLetter = jest.fn();
  const mockUpdateNewsLetter = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNewsLetterStore as unknown as jest.Mock).mockReturnValue({
      fetchNewsLetterById: mockFetchNewsLetterById,
      addNewsLetter: mockAddNewsLetter,
      updateNewsLetter: mockUpdateNewsLetter, // ✅ fixed
    });
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as unknown as jest.Mock).mockReturnValue({});
    jest.clearAllMocks();
  });

  it('renders form and submits new NewsLetter', async () => {
    mockAddNewsLetter.mockResolvedValueOnce({});
    render(<NewsLetterFormTemplate />);
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Test Name', name: 'name' } });
    fireEvent.change(screen.getByTestId('slug'), { target: { value: 'Test Slug', name: 'slug' } });
    fireEvent.change(screen.getByTestId('template'), { target: { value: 'Test Template', name: 'template' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(mockAddNewsLetter).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/newsletter');
    });
  });

  it('renders form and updates NewsLetter if id param exists', async () => {
    (useParams as unknown as jest.Mock).mockReturnValue({ id: '123' });
    mockFetchNewsLetterById.mockResolvedValueOnce({
      name: 'Q',
      slug: 'Q',
      status: true,
      template: 'Testing',
    });
    mockUpdateNewsLetter.mockResolvedValueOnce({});

    render(<NewsLetterFormTemplate />);
    await waitFor(() => expect(mockFetchNewsLetterById).toHaveBeenCalledWith('123'));

    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Updated Q', name: 'name' } });
    fireEvent.change(screen.getByTestId('slug'), { target: { value: 'Updated Q', name: 'slug' } });
    fireEvent.change(screen.getByTestId('template'), { target: { value: 'Updated Q', name: 'template' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockUpdateNewsLetter).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/newsletter');
    });
  });

  it('shows toast error if fetch fails', async () => {
    (useParams as unknown as jest.Mock).mockReturnValue({ id: 'bad' });
    mockFetchNewsLetterById.mockResolvedValueOnce(null);
    render(<NewsLetterFormTemplate />);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load newsletter data');
    });
  });

  it('shows field error for short name (frontend validation)', async () => {
    render(<NewsLetterFormTemplate />);
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'abc', name: 'name' } });
    fireEvent.change(screen.getByTestId('slug'), { target: { value: 'Test Slug', name: 'slug' } });
    fireEvent.change(screen.getByTestId('template'), { target: { value: 'Test Template', name: 'template' } });
    fireEvent.click(screen.getByText('Submit'));
    expect(mockAddNewsLetter).not.toHaveBeenCalled();
    expect(mockUpdateNewsLetter).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText(/Please fix the errors before proceeding/i)).toBeInTheDocument();
    });
  });

  it('shows toast error for backend 409 conflict', async () => {
    mockAddNewsLetter.mockRejectedValueOnce({
      response: { status: 409, data: { message: 'already exists' } },
    });
    render(<NewsLetterFormTemplate />);
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Test Name', name: 'name' } });
    fireEvent.change(screen.getByTestId('slug'), { target: { value: 'Test Name', name: 'slug' } });
    fireEvent.change(screen.getByTestId('template'), { target: { value: 'Test Template', name: 'template' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('already exists');
    });
  });

  it('shows toast error for backend array errors', async () => {
    mockAddNewsLetter.mockRejectedValueOnce({
      response: { data: { errors: [{ path: 'name', message: 'Invalid' }] } },
    });
    render(<NewsLetterFormTemplate />);
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Test Q', name: 'name' } });
    fireEvent.change(screen.getByTestId('slug'), { target: { value: 'test-q', name: 'slug' } });
    fireEvent.change(screen.getByTestId('template'), { target: { value: 'Test Name', name: 'template' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('name: Invalid');
    });
  });

  it('shows toast error for backend string error', async () => {
    mockAddNewsLetter.mockRejectedValueOnce('string error');
    render(<NewsLetterFormTemplate />);
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Test Name', name: 'name' } });
    fireEvent.change(screen.getByTestId('slug'), { target: { value: 'test-name', name: 'slug' } });
    fireEvent.change(screen.getByTestId('template'), { target: { value: 'Test Name', name: 'template' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('string error');
    });
  });

  it('shows toast error for backend generic error', async () => {
    mockAddNewsLetter.mockRejectedValueOnce({ message: 'generic error' });
    render(<NewsLetterFormTemplate />);
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Test Name', name: 'name' } });
    fireEvent.change(screen.getByTestId('slug'), { target: { value: 'test-name', name: 'slug' } });
    fireEvent.change(screen.getByTestId('template'), { target: { value: 'Test Slug', name: 'template' } });
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('generic error');
    });
  });
});
