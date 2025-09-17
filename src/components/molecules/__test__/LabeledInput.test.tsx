import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LabeledInput from '../LabeledInput';

describe('LabeledInput', () => {
  const baseProps = {
    name: 'testField',
    label: 'Test Label',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    baseProps.onChange.mockClear();
  });

  it('renders label and text input', () => {
    render(<LabeledInput {...baseProps} type="text" value="" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('calls onChange for text input', () => {
    render(<LabeledInput {...baseProps} type="text" value="" />);
    fireEvent.change(screen.getByLabelText('Test Label'), { target: { value: 'abc' } });
    expect(baseProps.onChange).toHaveBeenCalledWith({
      target: { name: 'testField', value: 'abc' },
    });
  });

  it('renders textarea input', () => {
    render(<LabeledInput {...baseProps} type="textarea" label="Description" />);
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('renders select input', () => {
    const options = [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }];
    render(
      <LabeledInput {...baseProps} type="select" options={options} value="a" placeholder="Select" />
    );
    // react-select renders the selected value, not the placeholder, when value is set
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<LabeledInput {...baseProps} type="text" error="Error!" />);
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });
});
