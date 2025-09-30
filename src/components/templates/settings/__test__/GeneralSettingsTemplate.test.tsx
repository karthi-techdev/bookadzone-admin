import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GeneralSettingsTemplate from '../GeneralSettingsTemplate';
import { useSettingsStore } from '../../../stores/settingsStore';


jest.mock('../../../stores/settingsStore', () => {
  let state = {
    settings: { general: { siteName: 'Test Site' } },
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

describe('GeneralSettingsTemplate', () => {
  beforeEach(() => {
    const mockState = {
      settings: { general: { siteName: 'Test Site' } },
      loading: false,
      fetchSettings: jest.fn().mockImplementation(() => Promise.resolve()),
      updateSettings: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    const store = require('../../../stores/settingsStore').useSettingsStore as jest.Mock;
    store.mockImplementation((selector: any) => typeof selector === 'function' ? selector(mockState) : mockState);
    store().updateSettings.mockClear();
  });

  it('renders General Settings form', async () => {
  render(<MemoryRouter><GeneralSettingsTemplate /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: 'General Settings' })).toBeInTheDocument();
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().fetchSettings).toHaveBeenCalled());
    expect(screen.getByTestId('general-settings-form')).toBeInTheDocument();
  });

  it('submits form and shows success toast', async () => {
  render(<MemoryRouter><GeneralSettingsTemplate /></MemoryRouter>);
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().fetchSettings).toHaveBeenCalled());
  // Fill all required fields
  const inputs = screen.getAllByRole('textbox');
  inputs.forEach(input => {
    fireEvent.change(input, { target: { value: 'Test Value' } });
  });
  // Fill all required file fields
  const fileInputs = screen.getAllByLabelText(/logo|favicon|image|file/i);
  fileInputs.forEach(input => {
    const file = new File(['dummy'], 'file.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });
  });
  fireEvent.submit(screen.getByTestId('general-settings-form'));
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().updateSettings).toHaveBeenCalled());
  expect(require('react-toastify').toast.success).toHaveBeenCalledWith('General settings updated successfully');
  });

  it('shows error toast on update failure', async () => {
  (require('../../../stores/settingsStore').useSettingsStore().updateSettings as jest.Mock).mockRejectedValue(new Error('Update failed'));
  render(<MemoryRouter><GeneralSettingsTemplate /></MemoryRouter>);
  await waitFor(() => expect(require('../../../stores/settingsStore').useSettingsStore().fetchSettings).toHaveBeenCalled());
  // Fill all required fields
  const inputs = screen.getAllByRole('textbox');
  inputs.forEach(input => {
    fireEvent.change(input, { target: { value: 'Test Value' } });
  });
  // Fill all required file fields
  const fileInputs = screen.getAllByLabelText(/logo|favicon|image|file/i);
  fileInputs.forEach(input => {
    const file = new File(['dummy'], 'file.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });
  });
  fireEvent.submit(screen.getByTestId('general-settings-form'));
  await waitFor(() => expect(require('react-toastify').toast.error).toHaveBeenCalledWith('Update failed'));
  });
});
