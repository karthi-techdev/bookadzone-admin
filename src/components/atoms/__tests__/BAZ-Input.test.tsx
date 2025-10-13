import { render, screen, fireEvent } from '@testing-library/react';
import BAZInput from '../BAZ-Input';

test('renders input and handles change', () => {
  const handleChange = jest.fn();
  render(<BAZInput onChange={handleChange} />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'Hi' } });
  expect(handleChange).toHaveBeenCalled();
});

test('shows error', () => {
  render(<BAZInput error="Error here" />);
  expect(screen.getByText('Error here')).toBeInTheDocument();
});
