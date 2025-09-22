import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContactInfoTemplate from '../ContactInfoTemplate';
import { useSettingsStore } from '../../../stores/settingsStore';


jest.mock('../../../stores/settingsStore', () => {
  let state = {
    settings: { contact: { companyName: 'Test Company' } },
    loading: false,
    fetchSettings: jest.fn().mockImplementation(() => Promise.resolve()),
    updateSettings: jest.fn().mockImplementation(() => Promise.resolve()),
  };
  return {
    useSettingsStore: jest.fn((selector) => selector(state)),
  };
});

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

describe('ContactInfoTemplate', () => {
  beforeEach(() => {
    const mockState = {
      settings: { contact: { companyName: 'Test Company' } },
      loading: false,
      fetchSettings: jest.fn().mockImplementation(() => Promise.resolve()),
      updateSettings: jest.fn().mockImplementation(() => Promise.resolve()),
    };
  (require('../../../stores/settingsStore').useSettingsStore as jest.Mock).mockImplementation((selector: any) => typeof selector === 'function' ? selector(mockState) : mockState);
  });

  it('renders Contact Info form', async () => {
  render(<MemoryRouter><ContactInfoTemplate /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Contact Info' })).toBeInTheDocument();
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().fetchSettings).toHaveBeenCalled());
    expect(screen.getByTestId('contact-info-form')).toBeInTheDocument();
  });

  it('submits form and shows success toast', async () => {
  render(<MemoryRouter><ContactInfoTemplate /></MemoryRouter>);
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().fetchSettings).toHaveBeenCalled());
  fireEvent.submit(screen.getByTestId('contact-info-form'));
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().updateSettings).toHaveBeenCalled());
    expect(require('react-toastify').toast.success).toHaveBeenCalledWith('Contact info updated successfully');
  });

  it('shows error toast on update failure', async () => {
  (require('../../../stores/settingsStore').useSettingsStore().updateSettings as jest.Mock).mockRejectedValue(new Error('Update failed'));
  render(<MemoryRouter><ContactInfoTemplate /></MemoryRouter>);
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().fetchSettings).toHaveBeenCalled());
  fireEvent.submit(screen.getByTestId('contact-info-form'));
  await waitFor(() => expect(require('react-toastify').toast.error).toHaveBeenCalledWith('Update failed'));
  });
});
