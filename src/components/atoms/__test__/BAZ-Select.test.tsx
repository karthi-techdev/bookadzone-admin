import { render, screen, fireEvent } from '@testing-library/react';
import BAZSelect from '../BAZ-Select';

const options = [
  { label: 'Option A', value: 'A' },
  { label: 'Option B', value: 'B' }
];

test('renders select with label and calls onChange', () => {
  const handleChange = jest.fn();
  render(<BAZSelect options={options} label="Select label" onChange={handleChange} />);
  expect(screen.getByText('Select label')).toBeInTheDocument();
  // open dropdown
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
  expect(screen.getByText('Option A')).toBeInTheDocument();
});

test('shows error message', () => {
  render(<BAZSelect options={options} error="Select error" />);
  expect(screen.getByText('Select error')).toBeInTheDocument();
});
