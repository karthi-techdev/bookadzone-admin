import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OgConfigTemplate from '../OgConfigTemplate';
import { useSettingsStore } from '../../../stores/settingsStore';


jest.mock('../../../stores/settingsStore', () => {
  let state = {
    settings: { og: { ogTitle: 'Test OG Title' } },
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

describe('OgConfigTemplate', () => {
  beforeEach(() => {
    const mockState = {
      settings: { og: { ogTitle: 'Test OG Title' } },
      loading: false,
      fetchSettings: jest.fn().mockImplementation(() => Promise.resolve()),
      updateSettings: jest.fn().mockImplementation(() => Promise.resolve()),
    };
  (require('../../../stores/settingsStore').useSettingsStore as jest.Mock).mockImplementation((selector: any) => typeof selector === 'function' ? selector(mockState) : mockState);
  });

  it('renders OG Configuration form', async () => {
  render(<MemoryRouter><OgConfigTemplate /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'OG Configuration' })).toBeInTheDocument();
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().fetchSettings).toHaveBeenCalled());
    expect(screen.getByTestId('og-config-form')).toBeInTheDocument();
  });

  it('submits form and shows success toast', async () => {
  render(<MemoryRouter><OgConfigTemplate /></MemoryRouter>);
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().fetchSettings).toHaveBeenCalled());
  fireEvent.submit(screen.getByTestId('og-config-form'));
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().updateSettings).toHaveBeenCalled());
    expect(require('react-toastify').toast.success).toHaveBeenCalledWith('OG configuration updated successfully');
  });

  it('shows error toast on update failure', async () => {
  (require('../../../stores/settingsStore').useSettingsStore().updateSettings as jest.Mock).mockRejectedValue(new Error('Update failed'));
  render(<MemoryRouter><OgConfigTemplate /></MemoryRouter>);
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().fetchSettings).toHaveBeenCalled());
  fireEvent.submit(screen.getByTestId('og-config-form'));
  await waitFor(() => expect(require('react-toastify').toast.error).toHaveBeenCalledWith('Update failed'));
  });
});
