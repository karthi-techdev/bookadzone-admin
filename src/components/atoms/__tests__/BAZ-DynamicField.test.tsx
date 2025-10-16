import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import DynamicField from '../BAZ-DynamicField';
import type { FieldConfig } from '../../types/common';

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('DynamicField', () => {
  const mockFields: FieldConfig[] = [
    {
      name: 'testField1',
      label: 'Test Field 1',
      type: 'text',
    },
    {
      name: 'testField2',
      label: 'Test Field 2',
      type: 'text',
    },
  ];

  const defaultProps = {
    index: 0,
    fields: mockFields,
    values: {
      'items.0.testField1': 'value1',
      'items.0.testField2': 'value2',
    },
    errors: {},
    onFieldChange: jest.fn().mockReturnValue(jest.fn()),
    onRemove: jest.fn(),
    fieldNamePrefix: 'items',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all fields with correct values', () => {
    render(
      <FormWrapper>
        <DynamicField {...defaultProps} />
      </FormWrapper>
    );
    expect(screen.getByLabelText('Test Field 1')).toHaveValue('value1');
    expect(screen.getByLabelText('Test Field 2')).toHaveValue('value2');
  });

  it('displays error messages when provided', () => {
    const propsWithErrors = {
      ...defaultProps,
      errors: {
        'items.0.testField1': { message: 'Field 1 error' },
        'items.0.testField2': { message: 'Field 2 error' },
      },
    };
    render(
      <FormWrapper>
        <DynamicField {...propsWithErrors} />
      </FormWrapper>
    );
    expect(screen.getByText('Field 1 error')).toBeInTheDocument();
    expect(screen.getByText('Field 2 error')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    render(
      <FormWrapper>
        <DynamicField {...defaultProps} />
      </FormWrapper>
    );
    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);
    expect(defaultProps.onRemove).toHaveBeenCalledTimes(1);
  });

  it('calls onFieldChange with correct parameters when field value changes', () => {
    render(
      <FormWrapper>
        <DynamicField {...defaultProps} />
      </FormWrapper>
    );
    const input = screen.getByLabelText('Test Field 1');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(defaultProps.onFieldChange).toHaveBeenCalledWith('items.0.testField1');
  });

  it('renders with correct layout classes', () => {
    const { container } = render(
      <FormWrapper>
        <DynamicField {...defaultProps} />
      </FormWrapper>
    );
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass(
      'bg-[var(--dark-color)]',
      'border',
      'border-[var(--light-blur-grey-color)]',
      'rounded-lg',
      'p-4',
      'flex',
      'flex-col',
      'md:flex-row',
      'gap-4',
      'items-center'
    );
  });

  it('renders fields in a grid layout', () => {
    const { container } = render(
      <FormWrapper>
        <DynamicField {...defaultProps} />
      </FormWrapper>
    );
    const gridDiv = container.querySelector('.grid');
    expect(gridDiv).toHaveClass(
      'grid-cols-1',
      'md:grid-cols-2',
      'gap-4',
      'w-full'
    );
  });

  it('renders remove button with correct styling', () => {
    render(
      <FormWrapper>
        <DynamicField {...defaultProps} />
      </FormWrapper>
    );
    const removeButton = screen.getByRole('button');
    expect(removeButton).toHaveClass(
      'text-red-400',
      'hover:text-red-300',
      'p-2'
    );
  });

  it('renders with different field name prefix', () => {
    const propsWithDifferentPrefix = {
      ...defaultProps,
      fieldNamePrefix: 'test',
      values: {
        'test.0.testField1': 'value1',
        'test.0.testField2': 'value2',
      },
    };
    render(
      <FormWrapper>
        <DynamicField {...propsWithDifferentPrefix} />
      </FormWrapper>
    );
    expect(screen.getByLabelText('Test Field 1')).toHaveValue('value1');
    expect(screen.getByLabelText('Test Field 2')).toHaveValue('value2');
  });

  it('handles empty values gracefully', () => {
    const propsWithEmptyValues = {
      ...defaultProps,
      values: {},
    };
    render(
      <FormWrapper>
        <DynamicField {...propsWithEmptyValues} />
      </FormWrapper>
    );
    expect(screen.getByLabelText('Test Field 1')).toHaveValue('');
    expect(screen.getByLabelText('Test Field 2')).toHaveValue('');
  });
});