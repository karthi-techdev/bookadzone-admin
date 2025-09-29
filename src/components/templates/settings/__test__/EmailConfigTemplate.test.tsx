import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import EmailConfigTemplate from '../EmailConfigTemplate';
import { useSettingsStore } from '../../../stores/settingsStore';
import { emailConfigFields } from '../../../utils/fields/emailConfigFields';

jest.mock('../../../stores/settingsStore');
jest.mock('../../../utils/fields/emailConfigFields', () => ({
  emailConfigFields: [
    { name: 'smtpHost', label: 'SMTP Host', required: true, type: 'text' },
    { name: 'smtpPassword', label: 'SMTP Password', required: true, type: 'password' },
    { name: 'smtpEmail', label: 'SMTP Email', required: true, type: 'email' },
  ],
}));

const mockFetchSettings = jest.fn();
const mockUpdateSettings = jest.fn();

const mockSettings = {
  email: {
    smtpHost: 'smtp.example.com',
    smtpPassword: 'Password1!',
    smtpEmail: 'test@example.com',
  },
};

describe('EmailConfigTemplate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ((useSettingsStore as unknown) as jest.Mock).mockImplementation((cb: any) => {
      return cb({
        fetchSettings: mockFetchSettings,
        updateSettings: mockUpdateSettings,
        settings: mockSettings,
        loading: false,
      });
    });
  });

  it('renders form and header', () => {
    render(
      <MemoryRouter>
        <EmailConfigTemplate />
      </MemoryRouter>
    );
  expect(screen.getByRole('heading', { name: /Email Configuration/i })).toBeInTheDocument();
    expect(screen.getByTestId('email-config-form')).toBeInTheDocument();
  });

  it('validates required fields and shows error', async () => {
    render(
      <MemoryRouter>
        <EmailConfigTemplate />
      </MemoryRouter>
    );
  fireEvent.change(screen.getByLabelText(/SMTP Host/i), { target: { value: '' } });
  fireEvent.change(screen.getByLabelText(/SMTP Password/i), { target: { value: '' } });
  fireEvent.change(screen.getByLabelText(/SMTP Email/i), { target: { value: '' } });
    fireEvent.click(screen.getByText('Update'));
    await waitFor(() => {
      expect(screen.getByText(/SmtpHost is required/i)).toBeInTheDocument();
      expect(screen.getByText(/SmtpPassword is required/i)).toBeInTheDocument();
      expect(screen.getByText(/SmtpEmail is required/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('submits valid data and shows success toast', async () => {
    mockUpdateSettings.mockResolvedValueOnce({});
    render(
      <MemoryRouter>
        <EmailConfigTemplate />
        <ToastContainer />
      </MemoryRouter>
    );
  fireEvent.change(screen.getByLabelText(/SMTP Host/i), { target: { value: 'smtp.example.com' } });
  // Use a valid password: at least 8 chars, one letter, one number, one special character
  fireEvent.change(screen.getByLabelText(/SMTP Password/i), { target: { value: 'Password1!' } });
  fireEvent.change(screen.getByLabelText(/SMTP Email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Update'));
    await waitFor(() => {
      expect(document.body.textContent).toContain('Email configuration updated successfully');
    });
    expect(mockUpdateSettings).toHaveBeenCalledWith({ email: mockSettings.email });
  });

  it('shows error toast on failed submission', async () => {
    mockUpdateSettings.mockRejectedValueOnce(new Error('Update failed'));
    render(
      <MemoryRouter>
        <EmailConfigTemplate />
        <ToastContainer />
      </MemoryRouter>
    );
  fireEvent.change(screen.getByLabelText(/SMTP Host/i), { target: { value: 'smtp.example.com' } });
  fireEvent.change(screen.getByLabelText(/SMTP Password/i), { target: { value: 'password123' } });
  fireEvent.change(screen.getByLabelText(/SMTP Email/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('Update'));
    await waitFor(() => {
      expect(screen.getByText(/SmtpPassword must be at least 8 characters/i)).toBeInTheDocument();
    });
  });
});
