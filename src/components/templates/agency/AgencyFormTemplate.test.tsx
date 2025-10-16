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
jest.mock('../../utils/helper', () => ({
  getAllCountries: () => [{ value: 'IN', label: 'India' }],
  getStatesOfCountry: () => [{ value: 'KA', label: 'Karnataka' }],
  getCitiesOfState: () => [{ value: 'Bangalore', label: 'Bangalore' }],
}));

describe('AgencyFormTemplate', () => {
  jest.setTimeout(15000);
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
    jest.setTimeout(15000);
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
    // Fill all required text fields using ids instead of placeholders
    fireEvent.change(screen.getByTestId('agencyName-input'), { target: { value: 'Test Agency' } });
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('position-input'), { target: { value: 'Manager' } });
    fireEvent.change(screen.getByTestId('yourEmail-input'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('yourPhone-input'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByTestId('companyEmail-input'), { target: { value: 'company@example.com' } });
    fireEvent.change(screen.getByTestId('companyPhone-input'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByTestId('companyRegistrationNumberGST-input'), { target: { value: 'GST123' } });
    fireEvent.change(screen.getByTestId('website-input'), { target: { value: 'https://example.com' } });
    fireEvent.change(screen.getByTestId('agencyAddress-input'), { target: { value: '123 Street' } });
    fireEvent.change(screen.getByTestId('agencyLocation-input'), { target: { value: 'City' } });
    
    // Handle react-select fields using their wrappers
    const countrySelect = screen.getByRole('combobox', { name: /country/i });
    fireEvent.change(countrySelect, { target: { value: 'IN' } });
    fireEvent.keyDown(countrySelect, { key: 'Enter', code: 'Enter' });

    const stateSelect = screen.getByRole('combobox', { name: /state/i });
    fireEvent.change(stateSelect, { target: { value: 'KA' } });
    fireEvent.keyDown(stateSelect, { key: 'Enter', code: 'Enter' });

    const citySelect = screen.getByRole('combobox', { name: /city/i });
    fireEvent.change(citySelect, { target: { value: 'Bangalore' } });
    fireEvent.keyDown(citySelect, { key: 'Enter', code: 'Enter' });
    
    // Continue with other fields
    fireEvent.change(screen.getByTestId('pincode-input'), { target: { value: '123456' } });
    fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Password@123' } });
    // Mock file inputs for required file fields
    const file = new File(['dummy'], 'dummy.png', { type: 'image/png' });
    
    // Handle all file inputs
    const fileInputs = [
      'agencyLogo-input',
      'photo-input',
      'uploadIdProof-input',
      'uploadBusinessProof-input'
    ];

    fileInputs.forEach((testId) => {
      const input = screen.getByTestId(testId) as HTMLInputElement;
      Object.defineProperty(input, 'files', {
        value: [file],
        configurable: true
      });
      fireEvent.change(input);
    });
  fireEvent.submit(screen.getByTestId('agency-form'));
    await waitFor(() => {
      expect(addAgency).toHaveBeenCalled();
    });
  });
});
