import { render, screen, fireEvent } from '@testing-library/react';
import BAZFileInput from '../BAZ-FileInput';

test('renders file input and calls onChange', () => {
  const handleChange = jest.fn();
  render(<BAZFileInput name="file" onChange={handleChange} />);
  const input = screen.getByLabelText(/click to upload/i);
  expect(input).toBeInTheDocument();
  fireEvent.change(input, {
    target: { files: [new File(['foo'], 'foo.png', { type: 'image/png' })] }
  });
  expect(handleChange).toHaveBeenCalled();
});

test('renders with existingFiles (string)', () => {
  render(<BAZFileInput name="file" existingFiles="/test.png" />);
  expect(screen.getByAltText('test.png')).toBeInTheDocument();
});

test('renders with existingFiles (array)', () => {
  render(<BAZFileInput name="file" existingFiles={["/a.png", "/b.png"]} />);
  expect(screen.getByAltText('a.png')).toBeInTheDocument();
  expect(screen.getByAltText('b.png')).toBeInTheDocument();
});


// The component only renders image previews for existingFiles, not value
// So we test image preview only with existingFiles

test('renders empty state', () => {
  render(<BAZFileInput name="file" />);
  expect(screen.queryByAltText(/.*/)).not.toBeInTheDocument();
});

test('renders error message', () => {
  render(<BAZFileInput name="file" error="File error!" />);
  expect(screen.getByText('File error!')).toBeInTheDocument();
});

test('renders disabled input', () => {
  render(<BAZFileInput name="file" disabled />);
  expect(screen.getByLabelText(/click to upload/i)).toBeDisabled();
});

test('renders with accept and multiple', () => {
  render(<BAZFileInput name="file" accept=".png" multiple />);
  const input = screen.getByLabelText(/click to upload/i);
  expect(input).toHaveAttribute('accept', '.png');
  expect(input).toHaveAttribute('multiple');
});

test('renders non-image file as link', () => {
  render(<BAZFileInput name="file" existingFiles="/doc.pdf" />);
  expect(screen.getByText(/view doc.pdf/i)).toBeInTheDocument();
});

test('removes preview on trash button click', () => {
  const handleChange = jest.fn();
  render(<BAZFileInput name="file" existingFiles="/test.png" onChange={handleChange} multiple />);
  const trashBtns = screen.getAllByRole('button');
  fireEvent.click(trashBtns[0]);
  expect(screen.queryByAltText('test.png')).not.toBeInTheDocument();
  expect(handleChange).toHaveBeenCalled();
});

test('handleChange with no files', () => {
  const handleChange = jest.fn();
  render(<BAZFileInput name="file" onChange={handleChange} />);
  const input = screen.getByLabelText(/click to upload/i);
  fireEvent.change(input, { target: { files: [] } });
  expect(handleChange).toHaveBeenCalled();
});

test('cleanup on unmount', () => {
  const { unmount } = render(<BAZFileInput name="file" existingFiles="/test.png" />);
  unmount();
  // No error should occur
});
