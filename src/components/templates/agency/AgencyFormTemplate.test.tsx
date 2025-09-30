import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AgencyFormTemplate from './AgencyFormTemplate';
import { useAgencyStore } from '../../stores/AgencyStore';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
jest.mock('../../stores/AgencyStore');
jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
  ToastContainer: () => <div data-testid="toast-container" />,
}));
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));

describe('AgencyFormTemplate', () => {
  beforeEach(() => {
    (useAgencyStore as unknown as jest.Mock).mockReturnValue({
      fetchAgencyById: jest.fn().mockResolvedValue(null),
      addAgency: jest.fn().mockResolvedValue(undefined),
      updateAgency: jest.fn().mockResolvedValue(undefined),
    });
  });

  it('renders the form', () => {
    render(
      <BrowserRouter>
        <AgencyFormTemplate />
      </BrowserRouter>
    );
    expect(screen.getByTestId('agency-form')).toBeInTheDocument();
    // There should be at least one element with 'Agency' in the text
    expect(screen.getAllByText(/Agency/i).length).toBeGreaterThan(0);
  });

  it('shows validation errors on submit', async () => {
    const { toast } = require('react-toastify');
    render(
      <BrowserRouter>
        <AgencyFormTemplate />
      </BrowserRouter>
    );
    fireEvent.submit(screen.getByTestId('agency-form'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please fix all validation errors');
    });
  });

  it('calls addAgency on valid submit', async () => {
    const addAgency = jest.fn().mockResolvedValue(undefined);
    (useAgencyStore as unknown as jest.Mock).mockReturnValue({
      fetchAgencyById: jest.fn().mockResolvedValue(null),
      addAgency,
      updateAgency: jest.fn(),
    });

    render(
      <BrowserRouter>
        <AgencyFormTemplate />
      </BrowserRouter>
    );

    // Fill required fields (simulate minimal valid input)
    fireEvent.change(screen.getByLabelText(/Agency Name/i), { target: { value: 'Test Agency' } });
  fireEvent.change(screen.getByLabelText(/Contact Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Position/i), { target: { value: 'Manager' } });
    // Try to match label with or without asterisk and whitespace
  fireEvent.change(screen.getByPlaceholderText('Enter email...'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('Enter phone number...'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Company Email/i), { target: { value: 'company@example.com' } });
    fireEvent.change(screen.getByLabelText(/Company Phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/GST/i), { target: { value: 'GST123' } });
    fireEvent.change(screen.getByLabelText(/Website/i), { target: { value: 'https://example.com' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Street' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: 'City' } });
  fireEvent.change(screen.getByPlaceholderText('Enter state...'), { target: { value: 'State' } });
  fireEvent.change(screen.getByPlaceholderText('Enter city...'), { target: { value: 'City' } });
    fireEvent.change(screen.getByLabelText(/Pincode/i), { target: { value: '123456' } });
  fireEvent.change(screen.getByPlaceholderText('Enter password...'), { target: { value: 'Password@123' } });
  // Mock file inputs for required file fields
  const file = new File(['dummy'], 'dummy.png', { type: 'image/png' });
  // Agency Logo
  const agencyLogoInput = screen.getByLabelText(/Agency Logo/i);
  fireEvent.change(agencyLogoInput, { target: { files: [file] } });
  // Contact Photo
  const contactPhotoInput = screen.getByLabelText(/Contact Photo/i);
  fireEvent.change(contactPhotoInput, { target: { files: [file] } });
  // ID Proof
  const idProofInput = screen.getByLabelText(/ID Proof/i);
  fireEvent.change(idProofInput, { target: { files: [file] } });
  // Business Proof
  const businessProofInput = screen.getByLabelText(/Business Proof/i);
  fireEvent.change(businessProofInput, { target: { files: [file] } });
  fireEvent.submit(screen.getByTestId('agency-form'));
    await waitFor(() => {
      expect(addAgency).toHaveBeenCalled();
    });
  });
});
