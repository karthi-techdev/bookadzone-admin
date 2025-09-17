import { render, screen, fireEvent } from '@testing-library/react';
import BAZCheckbox from '../BAZ-Checkbox';

test('renders checkbox and handles change', () => {
  const handleChange = jest.fn();
  render(
    <BAZCheckbox id="chk" name="chk" checked={false} onChange={handleChange} label="Agree" />
  );
  const checkbox = screen.getByLabelText('Agree');
  fireEvent.click(checkbox);
  expect(handleChange).toHaveBeenCalled();
});

test('shows error', () => {
  render(
    <BAZCheckbox id="chk" name="chk" checked={false} onChange={() => {}} error="Error!" />
  );
  expect(screen.getByText('Error!')).toBeInTheDocument();
});
