import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BAZFileInput from '../BAZ-FileInput';
import urls from '../../common/urls';

describe('BAZFileInput', () => {
  const mockImageFile = new File(['image'], 'image.png', { type: 'image/png' });
  const mockPdfFile = new File(['pdf'], 'doc.pdf', { type: 'application/pdf' });

  beforeEach(() => {
    // Mock URL methods
    global.URL.createObjectURL = jest.fn((file: File) => `blob:${file.name}`);
    global.URL.revokeObjectURL = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders file input and calls onChange with valid file', () => {
    const handleChange = jest.fn();
    render(<BAZFileInput name="file" onChange={handleChange} accept="image/*" />);
    const input = screen.getByLabelText(/click to upload/i);
    expect(input).toBeInTheDocument();
    
    fireEvent.change(input, {
      target: { files: [mockImageFile] }
    });
    
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: mockImageFile,
          removedFiles: []
        })
      })
    );
  });

  test('handles invalid file type', () => {
    const handleChange = jest.fn();
    render(<BAZFileInput name="file" onChange={handleChange} accept="image/*" />);
    const input = screen.getByLabelText(/click to upload/i);
    
    fireEvent.change(input, {
      target: { files: [mockPdfFile] }
    });
    
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: '__invalid_file_type__',
          removedFiles: []
        })
      })
    );
  });

  test('renders with existingFiles (string)', () => {
    render(<BAZFileInput name="file" existingFiles="/test.png" />);
    const img = screen.getByAltText('test.png');
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe(`${urls.FILEURL}test.png`);
  });

  test('renders with existingFiles as array', () => {
    const files = ['/test1.png', '/test2.png'];
    render(<BAZFileInput name="file" existingFiles={files} />);
    expect(screen.getByAltText('test1.png')).toBeInTheDocument();
    expect(screen.getByAltText('test2.png')).toBeInTheDocument();
  });

  test('handles empty existing files', () => {
    render(<BAZFileInput name="file" existingFiles={['', ' ']} />);
    expect(screen.queryByAltText(/.*/)).not.toBeInTheDocument();
  });

  test('renders with external URLs in existingFiles', () => {
    render(<BAZFileInput name="file" existingFiles="https://example.com/image.png" />);
    const img = screen.getByAltText('image.png');
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe('https://example.com/image.png');
  });

  test('handles removing an existing file', async () => {
    const handleChange = jest.fn();
    render(
      <BAZFileInput 
        name="file" 
        existingFiles="/test.png" 
        onChange={handleChange} 
        multiple 
      />
    );
    
    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            removedFiles: ['/test.png']
          })
        })
      );
    });
  });

  test('handles multiple file selection', () => {
    const handleChange = jest.fn();
    const mockFile1 = new File(['image1'], 'image1.png', { type: 'image/png' });
    const mockFile2 = new File(['image2'], 'image2.png', { type: 'image/png' });
    
    render(<BAZFileInput name="file" onChange={handleChange} accept="image/*" multiple />);
    const input = screen.getByLabelText(/click to upload/i);
    
    fireEvent.change(input, {
      target: { files: [mockFile1, mockFile2] }
    });
    
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          files: [mockFile1, mockFile2],
          value: [mockFile1, mockFile2],
          removedFiles: []
        })
      })
    );
  });

  test('handles file extension validation', () => {
    const handleChange = jest.fn();
    render(<BAZFileInput name="file" onChange={handleChange} accept=".png,.jpg" />);
    const input = screen.getByLabelText(/click to upload/i);
    
    fireEvent.change(input, {
      target: { files: [mockImageFile] }
    });
    
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: mockImageFile
        })
      })
    );
  });

  test('handles onChange being undefined', () => {
    render(<BAZFileInput name="file" />);
    const input = screen.getByLabelText(/click to upload/i);
    
    // This should not throw an error
    fireEvent.change(input, {
      target: { files: [mockImageFile] }
    });
  });

  test('handles removing a new file preview', async () => {
    const handleChange = jest.fn();
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const objectUrl = `blob:${mockFile.name}`;

    render(
      <BAZFileInput 
        name="file" 
        onChange={handleChange}
        multiple
        value={[mockFile]} 
      />
    );
    
    // Wait for preview to be rendered
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
    
    // Click remove button
    fireEvent.click(screen.getByRole('button'));
    
    // Check if URL.revokeObjectURL was called with the correct URL
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(objectUrl);
    
    // Check if onChange was called with empty value
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: []
        })
      })
    );
  });

  test('revokes object URLs on unmount', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    
    // Setup spy after the global mock
    const revokeUrlSpy = jest.spyOn(URL, 'revokeObjectURL');

    const { unmount } = render(
      <BAZFileInput 
        name="file"
        value={[mockFile]}
      />
    );

    // Wait for the file preview to be rendered
    await waitFor(() => {
      expect(URL.createObjectURL).toHaveBeenCalledWith(mockFile);
    });
    
    unmount();
    
    // Check if revokeObjectURL was called
    expect(revokeUrlSpy).toHaveBeenCalledTimes(1);
    expect(revokeUrlSpy.mock.calls[0][0]).toBe(`blob:${mockFile.name}`);

    revokeUrlSpy.mockRestore();
  });

  test('handles invalid files', () => {
    const mockInvalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const handleChange = jest.fn();
    render(
      <BAZFileInput 
        name="file" 
        onChange={handleChange}
        accept="image/*"
      />
    );

    // Simulate file selection
    fireEvent.change(screen.getByLabelText(/click to upload/i), {
      target: { files: [mockInvalidFile] }
    });

    // Should call onChange with invalid file type marker
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: '__invalid_file_type__',
          files: [mockInvalidFile],
          removedFiles: []
        })
      })
    );
  });

  test('handles empty file selection', () => {
    const handleChange = jest.fn();
    render(<BAZFileInput name="file" onChange={handleChange} />);
    
    fireEvent.change(screen.getByLabelText(/click to upload/i), {
      target: { files: [] }
    });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: null,
          removedFiles: []
        })
      })
    );
  });

  test('handles existing files with id and url', () => {
    const files = [
      { id: 1, url: 'test1.png' },
      { id: 2, url: 'test2.png' }
    ];
    render(<BAZFileInput name="file" existingFiles={files as any} />);
    
    expect(screen.getByAltText('test1.png')).toBeInTheDocument();
    expect(screen.getByAltText('test2.png')).toBeInTheDocument();
  });

  test('handles removing file with removePreview', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const handleChange = jest.fn();
    
    render(
      <BAZFileInput 
        name="file" 
        value={[mockFile]} 
        onChange={handleChange}
        multiple
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button'));

    expect(URL.revokeObjectURL).toHaveBeenCalled();
    expect(handleChange).toHaveBeenCalled();
  });

  test('handles disabled state', () => {
    render(<BAZFileInput name="file" disabled />);
    const input = screen.getByLabelText(/click to upload/i);
    expect(input).toBeDisabled();
  });

  test('handles error state', () => {
    render(<BAZFileInput name="file" error="Test error message" />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('text-red-400');
  });

  test('handles className prop', () => {
    render(<BAZFileInput name="file" className="custom-class" />);
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
    expect(screen.getByTestId('file-input').parentElement?.parentElement).toHaveClass('custom-class');
  });

  test('handles non-image files in previews', () => {
    render(<BAZFileInput name="file" existingFiles="/document.pdf" />);
    const link = screen.getByText('document.pdf');
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', `${urls.FILEURL}document.pdf`);
  });

  test('initializes with null objectUrlsRef', () => {
    const { rerender } = render(<BAZFileInput name="file" />);
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    
    // Mock URL.createObjectURL to return valid URL
    jest.spyOn(URL, 'createObjectURL').mockImplementation((file) => `blob:${(file as File).name}`);
    
    // Verify component handles initialization correctly
    rerender(<BAZFileInput name="file" value={[mockFile]} />);
    
    // Clean up the mock
    jest.restoreAllMocks();
  });

  test('handles removing the last file', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const handleChange = jest.fn();
    
    render(
      <BAZFileInput 
        name="file" 
        value={[mockFile]} 
        onChange={handleChange}
        multiple
      />
    );

    // Wait for the image to load and button to be visible
    const button = await screen.findByLabelText('Remove file');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: [],
          removedFiles: []
        })
      })
    );
  });

  test('handles preview cleanup on unmount', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const mockFile2 = new File(['test2'], 'test2.png', { type: 'image/png' });
    const handleChange = jest.fn();
    
    const { unmount, rerender } = render(
      <BAZFileInput 
        name="file" 
        value={[mockFile]} 
        onChange={handleChange}
      />
    );

    // Wait for first image
    await screen.findByAltText('test.png');

    // Clear previous calls
    jest.clearAllMocks();

    // Add second image
    rerender(
      <BAZFileInput 
        name="file" 
        value={[mockFile, mockFile2]} 
        onChange={handleChange}
      />
    );

    // Wait for second image
    await screen.findByAltText('test2.png');

    // Clear previous calls again
    jest.clearAllMocks();

    // Unmount to trigger cleanup
    unmount();

    // Both URLs should be revoked
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2);
  });

  test('handles file preview removal for non-array value', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const handleChange = jest.fn();
    
    render(
      <BAZFileInput 
        name="file" 
        value={mockFile} 
        onChange={handleChange}
        multiple // Add multiple to show remove button
      />
    );

    // Wait for the image to load
    const image = await screen.findByAltText('test.png');
    expect(image).toBeInTheDocument();

    // Click the remove button
    const button = screen.getByRole('button', { name: /remove file/i });
    fireEvent.click(button);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: null,
          removedFiles: []
        })
      })
    );
  });

  test('handles existing file removal with custom object structure', async () => {
    const mockFile = { id: 1, url: '/test.png' };
    const handleChange = jest.fn();
    
    render(
      <BAZFileInput 
        name="file" 
        existingFiles={[mockFile] as any} 
        onChange={handleChange}
        multiple // Add multiple to show remove button
      />
    );

    // Wait for the image to load
    const image = await screen.findByAltText('test.png');
    expect(image).toBeInTheDocument();

    // Click the remove button
    const button = screen.getByRole('button', { name: /remove file/i });
    fireEvent.click(button);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          removedFiles: ['/test.png']
        })
      })
    );
  });

  test('handles preview removal with blob URL', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    const handleChange = jest.fn();
    
    render(
      <BAZFileInput 
        name="file" 
        value={mockFile}
        onChange={handleChange}
        multiple
      />
    );

    // Wait for image to load
    const image = await screen.findByAltText('test.png');
    expect(image).toBeInTheDocument();

    // Get preview URL
    const url = image.getAttribute('src');
    expect(url).toContain('blob:');

    // Call removePreview directly since the button might not be visible
    const instance = screen.getByTestId('file-input').closest('div');
    expect(instance).toBeInTheDocument();

    // Find and click the remove button (should be visible on hover)
    const button = screen.getByRole('button', { name: /remove file/i });
    fireEvent.mouseEnter(instance!);
    fireEvent.click(button);

    // URL should be revoked
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(url);
    
    // handleChange should be called with event
    expect(handleChange).toHaveBeenCalled();
    const changeEvent = handleChange.mock.calls[0][0];
    expect(changeEvent.target.files).toBeUndefined();
  });
});
