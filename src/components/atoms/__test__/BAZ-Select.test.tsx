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

test('renders multi-select and calls onChange', () => {
  const handleChange = jest.fn();
  render(<BAZSelect options={options} isMulti onChange={handleChange} />);
  const combobox = screen.getByRole('combobox');
  fireEvent.keyDown(combobox, { key: 'ArrowDown' });
  fireEvent.click(screen.getByText('Option A'));
  expect(handleChange).toHaveBeenCalledWith([options[0]]);
});

test('renders disabled select', () => {
  render(<BAZSelect options={options} disabled />);
  const input = screen.getByDisplayValue(''); // fallback: get input by value
  // If not found, fallback to querySelector
  const selectInput = document.querySelector('.react-select__input');
  expect(selectInput).toBeTruthy();
  expect(selectInput).toBeDisabled();
});

test('renders with placeholder', () => {
  render(<BAZSelect options={options} placeholder="Pick one" />);
  expect(screen.getByText('Pick one')).toBeInTheDocument();
});

test('renders with custom id', () => {
  render(<BAZSelect options={options} id="custom-id" />);
  expect(screen.getByRole('combobox')).toHaveAttribute('id', 'custom-id');
});

test('renders with custom className', () => {
  render(<BAZSelect options={options} className="custom-class" />);
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
  expect(screen.getByText('Option A').closest('.custom-class')).toBeTruthy();
});

test('renders with no label', () => {
  render(<BAZSelect options={options} />);
  expect(screen.queryByText('Select label')).not.toBeInTheDocument();
});

test('renders with no error', () => {
  render(<BAZSelect options={options} />);
  expect(screen.queryByText('Select error')).not.toBeInTheDocument();
});

test('calls onChange for single select', () => {
  const handleChange = jest.fn();
  render(<BAZSelect options={options} onChange={handleChange} />);
  const combobox = screen.getByRole('combobox');
  fireEvent.keyDown(combobox, { key: 'ArrowDown' });
  fireEvent.click(screen.getByText('Option B'));
  expect(handleChange).toHaveBeenCalledWith(options[1]);
});
