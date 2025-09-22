import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EmailConfigTemplate from '../EmailConfigTemplate';
import { useSettingsStore } from '../../../stores/settingsStore';


jest.mock('../../../stores/settingsStore', () => {
  let state = {
    settings: { email: { email: 'test@example.com' } },
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

describe('EmailConfigTemplate', () => {
  beforeEach(() => {
    const mockState = {
      settings: { email: { email: 'test@example.com' } },
      loading: false,
      fetchSettings: jest.fn().mockImplementation(() => Promise.resolve()),
      updateSettings: jest.fn().mockImplementation(() => Promise.resolve()),
    };
  (require('../../../stores/settingsStore').useSettingsStore as jest.Mock).mockImplementation((selector: any) => typeof selector === 'function' ? selector(mockState) : mockState);
  });

  it('renders Email Configuration form', async () => {
  render(<MemoryRouter><EmailConfigTemplate /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'Email Configuration' })).toBeInTheDocument();
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().fetchSettings).toHaveBeenCalled());
    expect(screen.getByTestId('email-config-form')).toBeInTheDocument();
  });

  it('submits form and shows success toast', async () => {
  render(<MemoryRouter><EmailConfigTemplate /></MemoryRouter>);
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().fetchSettings).toHaveBeenCalled());
  fireEvent.submit(screen.getByTestId('email-config-form'));
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().updateSettings).toHaveBeenCalled());
    expect(require('react-toastify').toast.success).toHaveBeenCalledWith('Email configuration updated successfully');
  });

  it('shows error toast on update failure', async () => {
  (require('../../../stores/settingsStore').useSettingsStore().updateSettings as jest.Mock).mockRejectedValue(new Error('Update failed'));
  render(<MemoryRouter><EmailConfigTemplate /></MemoryRouter>);
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().fetchSettings).toHaveBeenCalled());
  fireEvent.submit(screen.getByTestId('email-config-form'));
  await waitFor(() => expect(require('react-toastify').toast.error).toHaveBeenCalledWith('Update failed'));
  });
});
