

import '@testing-library/jest-dom'; // For extended jest matchers
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';

import ManagementForm from '../ManagementForm';

// Mock toast.error at the top to avoid redefine errors
jest.mock('react-toastify', () => ({ toast: { error: jest.fn() } }));
import type { FieldConfig } from '../../types/common';

// React Hook Form provider wrapper for tests
const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm({
    defaultValues: { name: '', email: '', document: '', dynamic1: '', gender: '' },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('ManagementForm Component', () => {
  const fields: FieldConfig[] = [
    { name: 'name', type: 'text', label: 'Name', required: true },
    { name: 'email', type: 'email', label: 'Email', required: true },
    { name: 'age', type: 'number', label: 'Age', required: false },
    { name: 'dob', type: 'date', label: 'Date of Birth', required: false },
    { name: 'bio', type: 'textarea', label: 'Bio', required: false },
    { name: 'subscribe', type: 'checkbox', label: 'Subscribe', required: false },
    {
      name: 'gender',
      type: 'radio',
      label: 'Gender',
      required: false,
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ],
    },
    {
      name: 'country',
      type: 'select',
      label: 'Country',
      required: false,
      options: [
        { label: 'India', value: 'IN' },
        { label: 'USA', value: 'US' },
      ],
    },
  ];

  it('renders all fields and submit button', () => {
    render(
      <Wrapper>
        <ManagementForm label="Submit" fields={fields} />
      </Wrapper>
    );

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subscribe/i)).toBeInTheDocument();

    // Use getAllByLabelText for radios (multiple elements)
    expect(screen.getAllByLabelText(/Male/i).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/Female/i).length).toBeGreaterThan(0);

    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('calls onSubmit when the form is submitted', () => {
    const mockSubmit = jest.fn((e) => e.preventDefault());

    render(
      <Wrapper>
        <ManagementForm label="Submit" fields={fields} onSubmit={mockSubmit} />
      </Wrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(mockSubmit).toHaveBeenCalled();
  });

  it('displays existing file name when file field and existingFileName prop are provided', () => {
    const fileField: FieldConfig[] = [
      { name: 'document', type: 'file', label: 'Document', required: false },
    ];

    render(
      <Wrapper>
        <ManagementForm
          label="Upload"
          fields={fileField}
          existingFileName="file.pdf"
        />
      </Wrapper>
    );

    expect(screen.getByText(/Previously uploaded:/i)).toBeInTheDocument();
    expect(screen.getByText('file.pdf')).toBeInTheDocument();
  });

  it('renders dynamic fields when isDynamic is true', async () => {
    const dynamicFields: FieldConfig[] = [
      { name: 'dynamic1', type: 'text', label: 'Dynamic 1', required: false },
    ];

    render(
      <Wrapper>
        <ManagementForm
          label="Submit"
          fields={[]}
          isDynamic={true}
          dynamicFieldConfig={dynamicFields}
          dynamicFieldName="dynamicFields"
        />
      </Wrapper>
    );

    // Simulate clicking the "Add Field" button to add a dynamic field
    const addButton = screen.getByRole('button', { name: /add field/i });
    await act(async () => {
      addButton && fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/Dynamic 1/i)).toBeInTheDocument();
    });
  });

  it('disables the submit button when isSubmitting is true', () => {
    render(
      <Wrapper>
        <ManagementForm label="Submit" fields={fields} isSubmitting={true} />
      </Wrapper>
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders auth form when isAuth is true', () => {
    render(
      <Wrapper>
        <ManagementForm label="Login" fields={fields} isAuth={true} />
      </Wrapper>
    );
    // Use getByTestId for more robust query (add data-testid="auth-form" to ManagementForm's form)
    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('calls onButtonClick when provided', () => {
    const onButtonClick = jest.fn();
    render(
      <Wrapper>
        <ManagementForm label="Submit" fields={fields} onButtonClick={onButtonClick} />
      </Wrapper>
    );
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(onButtonClick).toHaveBeenCalled();
  });

  it('removes dynamic field', async () => {
    const dynamicFields: FieldConfig[] = [
      { name: 'dynamic1', type: 'text', label: 'Dynamic 1', required: false },
    ];
    render(
      <Wrapper>
        <ManagementForm
          label="Submit"
          fields={[]}
          isDynamic={true}
          dynamicFieldConfig={dynamicFields}
          dynamicFieldName="dynamicFields"
        />
      </Wrapper>
    );
    const addButton = screen.getByRole('button', { name: /add field/i });
    await act(async () => { fireEvent.click(addButton); });
    await waitFor(() => expect(screen.getByLabelText(/Dynamic 1/i)).toBeInTheDocument());
    const removeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(removeButton);
    // Should still be present (disabled if only one field)
    expect(screen.getByLabelText(/Dynamic 1/i)).toBeInTheDocument();
  });

  it('shows toast error if last dynamic field incomplete', async () => {
    const { toast } = require('react-toastify');
    toast.error.mockClear();
    const dynamicFields: FieldConfig[] = [
      { name: 'key', type: 'text', label: 'Key', required: false },
      { name: 'value', type: 'text', label: 'Value', required: false },
    ];
    render(
      <Wrapper>
        <ManagementForm
          label="Submit"
          fields={[]}
          isDynamic={true}
          dynamicFieldConfig={dynamicFields}
          dynamicFieldName="dynamicFields"
        />
      </Wrapper>
    );
    const addButton = screen.getByRole('button', { name: /add field/i });
    await act(async () => { fireEvent.click(addButton); });
    // Try to add again without filling last field
    await act(async () => { fireEvent.click(addButton); });
  expect(toast.error).toHaveBeenCalled();
  });

  it('renders file field with existingFiles', () => {
    const fileField: FieldConfig[] = [
      { name: 'document', type: 'file', label: 'Document', required: false },
    ];
    render(
      <Wrapper>
        <ManagementForm
          label="Upload"
          fields={fileField}
          existingFiles={{ document: '/test.pdf' }}
        />
      </Wrapper>
    );
    expect(screen.getByLabelText(/Document/i)).toBeInTheDocument();
  });

  it('renders password field with extraProps', () => {
    const passwordField: FieldConfig[] = [
      { name: 'password', type: 'password', label: 'Password', required: true },
    ];
    const togglePassword = jest.fn();
    render(
      <Wrapper>
        <ManagementForm
          label="Login"
          fields={passwordField}
          extraProps={{ togglePassword, showPassword: true }}
        />
      </Wrapper>
    );
    // Use getAllByLabelText to avoid multiple match error
    expect(screen.getAllByLabelText(/Password/i).length).toBeGreaterThan(0);
  });
});
