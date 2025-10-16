import { render, screen, fireEvent } from '@testing-library/react';
import BAZRadio from '../BAZ-Radio';

const options = [
  { label: 'One', value: '1' },
  { label: 'Two', value: '2' }
];

test('renders radio options and handles change', () => {
  const onChange = jest.fn();
  render(
    <BAZRadio
      name="test"
      selectedValue="1"
      options={options}
      onChange={onChange}
      label="Choose"
    />
  );
  expect(screen.getByLabelText('One')).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText('Two'));
  expect(onChange).toHaveBeenCalled();
});

test('shows error', () => {
  render(
    <BAZRadio
      name="test"
      selectedValue="1"
      options={options}
      onChange={() => {}}
      error="Radio error"
    />
  );
  expect(screen.getByText('Radio error')).toBeInTheDocument();
});
