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
