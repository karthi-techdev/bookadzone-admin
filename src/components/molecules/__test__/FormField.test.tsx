
import '@testing-library/jest-dom';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import FormField from '../FormField';
import { useFormContext } from 'react-hook-form';
import type { FieldConfig, InputType } from '../../types/common';

// Mock react-hook-form's useFormContext
jest.mock('react-hook-form', () => ({
  useFormContext: jest.fn(),
}));

// Mock LabeledInput to simulate calling onChange with custom event shape
jest.mock('../LabeledInput', () => (props: any) => {
  const { label, name, value, onChange } = props;
  return (
    <input
      aria-label={label}
      value={value}
      onChange={(e) => {
        if (onChange) onChange({ target: { name, value: e.target.value } });
      }}
    />
  );
});

// Use consistent field with correct 'name' and proper 'type' cast
const field: FieldConfig = {
  name: 'testField',
  label: 'Test Label',
  type: 'text' as InputType,
  className: '',
};

describe('FormField', () => {
  const clearErrorsMock = jest.fn();
  const onChangeMock = jest.fn();

  beforeEach(() => {
    (useFormContext as jest.Mock).mockReturnValue({
      clearErrors: clearErrorsMock,
    });
    clearErrorsMock.mockClear();
    onChangeMock.mockClear();
  });

  it('renders LabeledInput with correct label and value', () => {
    render(<FormField field={field} value="abc" onChange={onChangeMock} />);
    expect(screen.getByLabelText('Test Label')).toHaveValue('abc');
  });

  it('calls clearErrors and onChange on input change', () => {
    render(<FormField field={field} value="abc" onChange={onChangeMock} />);
    const input = screen.getByLabelText('Test Label');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(clearErrorsMock).toHaveBeenCalledWith('testField');
    expect(onChangeMock).toHaveBeenCalledWith({
      target: { name: 'testField', value: 'new value' },
    });
  });

  it('calls clearErrors even if onChange is not provided', () => {
    render(<FormField field={field} value="abc" />);
    const input = screen.getByLabelText('Test Label');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(clearErrorsMock).toHaveBeenCalledWith('testField');
  });
});
