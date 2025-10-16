import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CategoryFormTemplate from '../CategoryFormTemplate';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { useCategoryStore } from '../../../stores/categoryStore';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

// Mocks
jest.mock('../../../stores/categoryStore');
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

const mockedUseCategoryStore = useCategoryStore as jest.MockedFunction<typeof useCategoryStore>;

describe('CategoryFormTemplate', () => {
  let mockAddCategory: jest.Mock;
  let mockUpdateCategory: jest.Mock;

  beforeEach(() => {
    mockAddCategory = jest.fn().mockResolvedValue({});
    mockUpdateCategory = jest.fn().mockResolvedValue({});
    mockedUseCategoryStore.mockReturnValue({
      fetchCategoryById: jest.fn().mockResolvedValue({
        name: 'Electronics',
        slug: 'electronics',
        description: 'Devices and gadgets',
        isFeatured: true,
        photo: 'sample.jpg',
      }),
      addCategory: mockAddCategory,
      updateCategory: mockUpdateCategory,
    });
    jest.clearAllMocks();
  });

  it('renders Add mode correctly', () => {
    render(
      <BrowserRouter>
        <CategoryFormTemplate />
      </BrowserRouter>
    );

    expect(screen.getByText('Add Category')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
  });

  it('renders Edit mode and pre-fills data', async () => {
    render(
      <MemoryRouter initialEntries={['/category/edit/123']}>
        <Routes>
          <Route path="/category/edit/:id" element={<CategoryFormTemplate />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Electronics')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Devices and gadgets')).toBeInTheDocument();
    });
  });

  it('shows validation error when required fields are empty', async () => {
    render(
      <BrowserRouter>
        <CategoryFormTemplate />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please fix the errors before proceeding/i)).toBeInTheDocument();
    });
  });

  it('submits form successfully in Add mode', async () => {
    render(
      <BrowserRouter>
        <CategoryFormTemplate />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Category' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'This is a new category' } });
    fireEvent.change(screen.getByLabelText(/Photo/i), {
      target: { files: [new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' })] },
    });

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(mockAddCategory).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Success!', text: 'Category added successfully' })
      );
    });
  });

  it('submits form successfully in Edit mode (update)', async () => {
    render(
      <MemoryRouter initialEntries={['/category/edit/123']}>
        <Routes>
          <Route path="/category/edit/:id" element={<CategoryFormTemplate />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue('Electronics'));

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Updated Category' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(mockUpdateCategory).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Success!', text: 'Category updated successfully' })
      );
    });
  });

  it('handles cancel button click', async () => {
    render(
      <BrowserRouter>
        <CategoryFormTemplate />
      </BrowserRouter>
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    // just ensure navigation works — since we can’t assert history easily, check Swal not called
    expect(Swal.fire).not.toHaveBeenCalled();
  });

  it('shows error toast when addCategory fails', async () => {
    mockAddCategory.mockRejectedValueOnce(new Error('Add failed'));
    render(
      <BrowserRouter>
        <CategoryFormTemplate />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Bad Category' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Broken' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to add category', expect.any(Object));
    });
  });

  it('shows error toast when updateCategory fails', async () => {
    mockUpdateCategory.mockRejectedValueOnce(new Error('Update failed'));
    render(
      <MemoryRouter initialEntries={['/category/edit/123']}>
        <Routes>
          <Route path="/category/edit/:id" element={<CategoryFormTemplate />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByDisplayValue('Electronics'));
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update category', expect.any(Object));
    });
  });

  it('handles photo file input change and preview', async () => {
    render(
      <BrowserRouter>
        <CategoryFormTemplate />
      </BrowserRouter>
    );

    const fileInput = screen.getByLabelText(/Photo/i) as HTMLInputElement;
    const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(fileInput.files?.[0].name).toBe('test.jpg');
  });

  it('auto-generates slug from name input', async () => {
  render(
    <BrowserRouter>
      <CategoryFormTemplate />
    </BrowserRouter>
  );

  const nameInput = screen.getByLabelText(/Name/i);
  const slugInput = screen.getByLabelText(/Slug/i);

  fireEvent.change(nameInput, { target: { value: 'My Cool Category' } });

  await waitFor(() => {
    expect(slugInput).toHaveValue('my-cool-category');
  });
});

it('shows error for name shorter than 5 characters', async () => {
  render(
    <BrowserRouter>
      <CategoryFormTemplate />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'abc' } });
  fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => {
    expect(screen.getByText(/Name must be at least 5 characters/i)).toBeInTheDocument();
  });
});

it('toggles isFeatured checkbox correctly', async () => {
  render(
    <BrowserRouter>
      <CategoryFormTemplate />
    </BrowserRouter>
  );

  const checkbox = screen.getByLabelText(/Featured/i) as HTMLInputElement;
  expect(checkbox.checked).toBe(true); // default

  fireEvent.click(checkbox);
  expect(checkbox.checked).toBe(false);
});

it('shows toast when category already exists (409)', async () => {
  mockAddCategory.mockRejectedValueOnce({
    response: {
      status: 409,
      data: { message: 'Category already exists' },
    },
  });

  render(
    <BrowserRouter>
      <CategoryFormTemplate />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Duplicate' } });
  fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Conflict' } });
  fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith('Category already exists');
  });
});

it('resets form with fetched category data in edit mode', async () => {
  render(
    <MemoryRouter initialEntries={['/category/edit/123']}>
      <Routes>
        <Route path="/category/edit/:id" element={<CategoryFormTemplate />} />
      </Routes>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByLabelText(/Name/i)).toHaveValue('Electronics');
    expect(screen.getByLabelText(/Description/i)).toHaveValue('Devices and gadgets');
  });
});

it('shows error when name exceeds max length', async () => {
  render(
    <BrowserRouter>
      <CategoryFormTemplate />
    </BrowserRouter>
  );

  const longName = 'A'.repeat(501); // exceeds 500 character limit
  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: longName } });
  fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => {
    expect(screen.getByText(/Name must be at most 500 characters/i)).toBeInTheDocument();
  });
});

it('shows error when description exceeds max length', async () => {
  render(
    <BrowserRouter>
      <CategoryFormTemplate />
    </BrowserRouter>
  );

  const longDesc = 'B'.repeat(2001); // exceeds 2000 character limit
  fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: longDesc } });
  fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => {
    expect(screen.getByText(/Description must be at most 2000 characters/i)).toBeInTheDocument();
  });
});

it('shows error when photo is missing', async () => {
  render(
    <BrowserRouter>
      <CategoryFormTemplate />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Valid Name' } });
  fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Valid Description' } });

  fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => {
    expect(screen.getByText(/Photo is required/i)).toBeInTheDocument();
  });
});

it('shows error when isFeatured has invalid value', async () => {
  render(
    <BrowserRouter>
      <CategoryFormTemplate />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Valid Name' } });
  fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Valid Description' } });

  // Simulate invalid value manually
  const checkbox = screen.getByLabelText(/Featured/i) as HTMLInputElement;
  checkbox.checked = false;
  fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => {
    expect(screen.queryByText(/Status must be one of/i)).not.toBeNull();
  });
});

it('shows generic error toast when unknown error occurs', async () => {
  mockAddCategory.mockRejectedValueOnce({ response: { data: {} } });

  render(
    <BrowserRouter>
      <CategoryFormTemplate />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Valid Name' } });
  fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Valid Description' } });
  fireEvent.change(screen.getByLabelText(/Photo/i), {
    target: { files: [new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' })] },
  });

  fireEvent.click(screen.getByRole('button', { name: /Save/i }));

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith('Something went wrong');
  });
});
});
