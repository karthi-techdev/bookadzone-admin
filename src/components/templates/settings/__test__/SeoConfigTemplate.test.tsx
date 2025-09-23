import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SeoConfigTemplate from '../SeoConfigTemplate';
import { useSettingsStore } from '../../../stores/settingsStore';


jest.mock('../../../stores/settingsStore', () => {
  let state = {
    settings: { seo: { metaTitle: 'Test Title' } },
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

describe('SeoConfigTemplate', () => {
  beforeEach(() => {
    const mockState = {
      settings: { seo: { metaTitle: 'Test Title' } },
      loading: false,
      fetchSettings: jest.fn().mockImplementation(() => Promise.resolve()),
      updateSettings: jest.fn().mockImplementation(() => Promise.resolve()),
    };
  (require('../../../stores/settingsStore').useSettingsStore as jest.Mock).mockImplementation((selector: any) => typeof selector === 'function' ? selector(mockState) : mockState);
  });

  it('renders SEO Configuration form', async () => {
  render(<MemoryRouter><SeoConfigTemplate /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: /seo configuration/i })).toBeInTheDocument();
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().fetchSettings).toHaveBeenCalled());
    expect(screen.getByTestId('seo-config-form')).toBeInTheDocument();
  });

  it('submits form and shows success toast', async () => {
  render(<MemoryRouter><SeoConfigTemplate /></MemoryRouter>);
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().fetchSettings).toHaveBeenCalled());
  fireEvent.submit(screen.getByTestId('seo-config-form'));
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().updateSettings).toHaveBeenCalled());
    expect(require('react-toastify').toast.success).toHaveBeenCalledWith('SEO configuration updated successfully');
  });

  it('shows error toast on update failure', async () => {
  (require('../../../stores/settingsStore').useSettingsStore().updateSettings as jest.Mock).mockRejectedValue(new Error('Update failed'));
  render(<MemoryRouter><SeoConfigTemplate /></MemoryRouter>);
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().fetchSettings).toHaveBeenCalled());
  fireEvent.submit(screen.getByTestId('seo-config-form'));
  await waitFor(() => expect(require('react-toastify').toast.error).toHaveBeenCalledWith('Update failed'));
  });
});
