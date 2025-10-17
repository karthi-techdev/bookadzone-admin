import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PageFormTemplate from '../PageFormTemplate';
import { usePageStore } from '../../../stores/PageStore';
import { useConfigStore } from '../../../stores/configStore';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

jest.mock('../../../stores/PageStore', () => ({
  usePageStore: jest.fn(),
}));
jest.mock('../../../stores/configStore', () => ({
  useConfigStore: jest.fn(),
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
    const [title, setTitle] = React.useState(props.value?.title || '');
    const [name, setName] = React.useState(props.value?.name || '');
    const [slug, setSlug] = React.useState(props.value?.slug || '');
    const [type, setType] = React.useState(props.value?.type || 'link');
    const [url, setUrl] = React.useState(props.value?.url || '');
    const [template, setTemplate] = React.useState(props.value?.template || '');
    const [status, setStatus] = React.useState(props.value?.status || 'active');

    return (
      <form
        data-testid="Page-form"
        onSubmit={e => {
          e.preventDefault();
          props.onSubmit && props.onSubmit({ title, name, slug, type, url, template, status });
        }}
      >
        <select
          data-testid="title"
          value={title}
          onChange={e => {
            setTitle(e.target.value);
            props.onFieldChange?.title && props.onFieldChange.title(e);
          }}
          name="title"
        >
          <option value="">Select Title</option>
          <option value="config1">Config 1</option>
        </select>
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
        <select
          data-testid="type"
          value={type}
          onChange={e => {
            setType(e.target.value);
            props.onFieldChange?.type && props.onFieldChange.type(e);
          }}
          name="type"
        >
          <option value="link">Link</option>
          <option value="template">Template</option>
        </select>
        {type === 'link' && (
          <input
            data-testid="url"
            value={url}
            onChange={e => {
              setUrl(e.target.value);
              props.onFieldChange?.url && props.onFieldChange.url(e);
            }}
            name="url"
          />
        )}
        {type === 'template' && (
          <textarea
            data-testid="template"
            value={template}
            onChange={e => {
              setTemplate(e.target.value);
              props.onFieldChange?.template && props.onFieldChange.template(e);
            }}
            name="template"
          />
        )}
        <select
          data-testid="status"
          value={status}
          onChange={e => {
            setStatus(e.target.value);
            props.onFieldChange?.status && props.onFieldChange.status(e);
          }}
          name="status"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button type="submit">Save</button>
      </form>
    );
  };
});
jest.mock('../../../molecules/FormHeader', () => () => <div>FormHeader</div>);

describe('PageFormTemplate', () => {
  const mockFetchPageById = jest.fn();
  const mockAddPage = jest.fn();
  const mockUpdatePage = jest.fn();
  const mockFetchPageConfigFields = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (usePageStore as unknown as jest.Mock).mockReturnValue({
      fetchPageById: mockFetchPageById,
      addPage: mockAddPage,
      updatePage: mockUpdatePage,
    });
    (useConfigStore as unknown as jest.Mock).mockReturnValue({
      fetchPageConfigFields: mockFetchPageConfigFields,
      pageConfigFields: [{ key: 'config1', value: 'Config 1' }],
    });
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as unknown as jest.Mock).mockReturnValue({});
    jest.clearAllMocks();
  });

  it('renders form and submits new page', async () => {
    mockAddPage.mockResolvedValueOnce({});
    render(<PageFormTemplate />);
    fireEvent.change(screen.getByTestId('title'), { target: { value: 'config1', name: 'title' } });
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Test Name', name: 'name' } });
    fireEvent.change(screen.getByTestId('slug'), { target: { value: 'test-name', name: 'slug' } });
    fireEvent.change(screen.getByTestId('type'), { target: { value: 'link', name: 'type' } });
    fireEvent.change(screen.getByTestId('url'), { target: { value: 'http://example.com', name: 'url' } });
    fireEvent.change(screen.getByTestId('status'), { target: { value: 'active', name: 'status' } });
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(mockAddPage).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/page');
    });
  });

  it('renders form and updates page if id param exists', async () => {
    (useParams as unknown as jest.Mock).mockReturnValue({ id: '123' });
    mockFetchPageById.mockResolvedValueOnce({
      title: 'config1',
      name: 'Test Page',
      slug: 'test-page',
      type: 'link',
      url: 'http://example.com',
      status: 'active',
    });
    mockUpdatePage.mockResolvedValueOnce({});

    render(<PageFormTemplate />);
    await waitFor(() => expect(mockFetchPageById).toHaveBeenCalledWith('123'));

    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Updated Name', name: 'name' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockUpdatePage).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/page');
    });
  });

  it('shows toast error if fetch fails', async () => {
    (useParams as unknown as jest.Mock).mockReturnValue({ id: 'bad' });
    mockFetchPageById.mockResolvedValueOnce(null);
    render(<PageFormTemplate />);
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load page data');
    });
  });

  it('shows field error for short name (frontend validation)', async () => {
    render(<PageFormTemplate />);
    fireEvent.change(screen.getByTestId('title'), { target: { value: 'config1', name: 'title' } });
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'abc', name: 'name' } });
    fireEvent.change(screen.getByTestId('slug'), { target: { value: 'test-slug', name: 'slug' } });
    fireEvent.change(screen.getByTestId('type'), { target: { value: 'link', name: 'type' } });
    fireEvent.change(screen.getByTestId('url'), { target: { value: 'http://example.com', name: 'url' } });
    fireEvent.change(screen.getByTestId('status'), { target: { value: 'active', name: 'status' } });
    fireEvent.click(screen.getByText('Save'));
    expect(mockAddPage).not.toHaveBeenCalled();
    expect(mockUpdatePage).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText(/Please fix the errors before proceeding/i)).toBeInTheDocument();
    });
  });

  it('shows toast error for backend 409 conflict', async () => {
    mockAddPage.mockRejectedValueOnce({
      response: { status: 409, data: { message: 'already exists' } },
    });
    render(<PageFormTemplate />);
    fireEvent.change(screen.getByTestId('title'), { target: { value: 'config1', name: 'title' } });
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Test Name', name: 'name' } });
    fireEvent.change(screen.getByTestId('slug'), { target: { value: 'test-name', name: 'slug' } });
    fireEvent.change(screen.getByTestId('type'), { target: { value: 'link', name: 'type' } });
    fireEvent.change(screen.getByTestId('url'), { target: { value: 'http://example.com', name: 'url' } });
    fireEvent.change(screen.getByTestId('status'), { target: { value: 'active', name: 'status' } });
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('already exists');
    });
  });

  it('shows toast error for backend array errors', async () => {
    mockAddPage.mockRejectedValueOnce({
      response: { data: { errors: [{ path: 'name', message: 'Invalid' }] } },
    });
    render(<PageFormTemplate />);
    fireEvent.change(screen.getByTestId('title'), { target: { value: 'config1', name: 'title' } });
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Test Name', name: 'name' } });
    fireEvent.change(screen.getByTestId('slug'), { target: { value: 'test-name', name: 'slug' } });
    fireEvent.change(screen.getByTestId('type'), { target: { value: 'link', name: 'type' } });
    fireEvent.change(screen.getByTestId('url'), { target: { value: 'http://example.com', name: 'url' } });
    fireEvent.change(screen.getByTestId('status'), { target: { value: 'active', name: 'status' } });
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('name: Invalid');
    });
  });

  it('shows toast error for backend string error', async () => {
    mockAddPage.mockRejectedValueOnce('string error');
    render(<PageFormTemplate />);
    fireEvent.change(screen.getByTestId('title'), { target: { value: 'config1', name: 'title' } });
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Test Name', name: 'name' } });
    fireEvent.change(screen.getByTestId('slug'), { target: { value: 'test-name', name: 'slug' } });
    fireEvent.change(screen.getByTestId('type'), { target: { value: 'link', name: 'type' } });
    fireEvent.change(screen.getByTestId('url'), { target: { value: 'http://example.com', name: 'url' } });
    fireEvent.change(screen.getByTestId('status'), { target: { value: 'active', name: 'status' } });
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('string error');
    });
  });

  it('shows toast error for backend generic error', async () => {
    mockAddPage.mockRejectedValueOnce({ message: 'generic error' });
    render(<PageFormTemplate />);
    fireEvent.change(screen.getByTestId('title'), { target: { value: 'config1', name: 'title' } });
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'Test Name', name: 'name' } });
    fireEvent.change(screen.getByTestId('slug'), { target: { value: 'test-name', name: 'slug' } });
    fireEvent.change(screen.getByTestId('type'), { target: { value: 'link', name: 'type' } });
    fireEvent.change(screen.getByTestId('url'), { target: { value: 'http://example.com', name: 'url' } });
    fireEvent.change(screen.getByTestId('status'), { target: { value: 'active', name: 'status' } });
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('generic error');
    });
  });

  it('conditionally shows url field when type is link', () => {
    render(<PageFormTemplate />);
    fireEvent.change(screen.getByTestId('type'), { target: { value: 'link', name: 'type' } });
    expect(screen.getByTestId('url')).toBeInTheDocument();
    expect(screen.queryByTestId('template')).not.toBeInTheDocument();
  });

  it('conditionally shows template field when type is template', () => {
    render(<PageFormTemplate />);
    fireEvent.change(screen.getByTestId('type'), { target: { value: 'template', name: 'type' } });
    expect(screen.getByTestId('template')).toBeInTheDocument();
    expect(screen.queryByTestId('url')).not.toBeInTheDocument();
  });
});
