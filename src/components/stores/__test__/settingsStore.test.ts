import { act } from 'react';
import { useSettingsStore } from '../settingsStore';
import axios from 'axios';

jest.mock('axios');

describe('useSettingsStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSettingsStore.setState({
      settings: null,
      loading: false,
      error: null,
    });
  });

  it('fetchSettings sets settings on success', async () => {
    const mockSettings = { general: {}, contact: {}, email: {}, seo: {}, og: {} };
    (axios.get as jest.Mock).mockResolvedValue({ data: { data: mockSettings } });
    await act(async () => {
      await useSettingsStore.getState().fetchSettings();
    });
    expect(useSettingsStore.getState().settings).toEqual(mockSettings);
    expect(useSettingsStore.getState().loading).toBe(false);
    expect(useSettingsStore.getState().error).toBeNull();
  });

  it('fetchSettings sets error on failure', async () => {
    (axios.get as jest.Mock).mockRejectedValue({ response: { data: { message: 'fail' } } });
    await act(async () => {
      await expect(useSettingsStore.getState().fetchSettings()).rejects.toEqual('fail');
    });
    expect(useSettingsStore.getState().settings).toBeNull();
    expect(useSettingsStore.getState().loading).toBe(false);
    expect(useSettingsStore.getState().error).toBe('fail');
  });

  it('updateSettings sets settings on success', async () => {
    const mockSettings = { general: {}, contact: {}, email: {}, seo: {}, og: {} };
    (axios.put as jest.Mock).mockResolvedValue({ data: { data: mockSettings } });
    const fullGeneral = {
      siteName: 'Test',
      siteLogo: '',
      favicon: '',
      defaultCurrency: '',
      currencyIcon: '',
      timezone: ''
    };
    await act(async () => {
      await useSettingsStore.getState().updateSettings({ general: fullGeneral });
    });
    expect(useSettingsStore.getState().settings).toEqual(mockSettings);
    expect(useSettingsStore.getState().loading).toBe(false);
    expect(useSettingsStore.getState().error).toBeNull();
  });

  it('updateSettings sets error on failure', async () => {
    (axios.put as jest.Mock).mockRejectedValue({ response: { data: { message: 'update fail' } } });
    const fullGeneral = {
      siteName: 'Test',
      siteLogo: '',
      favicon: '',
      defaultCurrency: '',
      currencyIcon: '',
      timezone: ''
    };
    await act(async () => {
      await expect(useSettingsStore.getState().updateSettings({ general: fullGeneral })).rejects.toEqual('update fail');
    });
    expect(useSettingsStore.getState().loading).toBe(false);
    expect(useSettingsStore.getState().error).toBe('update fail');
  });

  it('updateSettings handles FormData payload', async () => {
    const mockSettings = { general: {}, contact: {}, email: {}, seo: {}, og: {} };
    (axios.put as jest.Mock).mockResolvedValue({ data: { data: mockSettings } });
    const formData = new FormData();
    formData.append('siteLogo', 'logo.png');
    await act(async () => {
      await useSettingsStore.getState().updateSettings(formData);
    });
    expect(axios.put).toHaveBeenCalledWith(expect.any(String), formData, expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } }));
    expect(useSettingsStore.getState().settings).toEqual(mockSettings);
  });
});
