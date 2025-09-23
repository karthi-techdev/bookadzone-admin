import { act } from 'react';
import { useConfigStore } from '../configStore';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useConfigStore', () => {
  beforeEach(() => {
    useConfigStore.setState({
      configs: [],
      stats: { total: 0, active: 0, inactive: 0 },
      loading: false,
      error: null,
      page: 1,
      totalPages: 1,
    });
    jest.clearAllMocks();
  });

  it('fetchConfigs success', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: [{ _id: '1', name: 'Test', slug: 'test-slug', status: true, configFields: [] }],
        meta: { total: 1, active: 1, inactive: 0, totalPages: 1 },
      },
    });
    await act(async () => {
      await useConfigStore.getState().fetchConfigs();
    });
    const state = useConfigStore.getState();
    expect(state.configs.length).toBe(1);
    expect(state.stats.total).toBe(1);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('fetchConfigs error', async () => {
    mockedAxios.get.mockRejectedValueOnce({ message: 'fail' });
    await expect(
      act(async () => {
        await useConfigStore.getState().fetchConfigs();
      })
    ).rejects.toBe('fail');
    expect(useConfigStore.getState().error).toBe('fail');
  });

  it('fetchConfigById success', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { data: { _id: '1', name: 'Test', slug: 'test-slug', status: true, configFields: [] } } });
    let config;
    await act(async () => {
      config = await useConfigStore.getState().fetchConfigById('1');
    });
    expect(config).toBeTruthy();
    expect((config as any)?._id).toBe('1');
  });

  it('addConfig success', async () => {
    const config = { _id: '2', name: 'New', slug: 'new-slug', status: true, configFields: [] };
    mockedAxios.post.mockResolvedValueOnce({ data: { data: config } });
    await act(async () => {
      await useConfigStore.getState().addConfig(config as any);
    });
    expect(useConfigStore.getState().configs.some(c => c._id === '2')).toBe(true);
  });

  it('updateConfig success', async () => {
    useConfigStore.setState({ configs: [{ _id: '3', name: 'Old', slug: 'old-slug', status: false, configFields: [] }] });
    const updated = { _id: '3', name: 'Updated', slug: 'old-slug', status: true, configFields: [] };
    mockedAxios.put.mockResolvedValueOnce({ data: { data: updated } });
    await act(async () => {
      await useConfigStore.getState().updateConfig('3', updated as any);
    });
    expect(useConfigStore.getState().configs[0].name).toBe('Updated');
  });

  it('updateConfig error', async () => {
    mockedAxios.put.mockRejectedValueOnce({ message: 'update fail' });
    await expect(
      act(async () => {
        await useConfigStore.getState().updateConfig('badid', {} as any);
      })
    ).rejects.toBe('update fail');
    expect(useConfigStore.getState().error).toBe('update fail');
  });

  it('deleteConfig success', async () => {
    useConfigStore.setState({ configs: [{ _id: '4', name: 'Del', slug: 'del-slug', status: true, configFields: [] }] });
    mockedAxios.delete.mockResolvedValueOnce({});
    await act(async () => {
      await useConfigStore.getState().deleteConfig('4');
    });
    expect(useConfigStore.getState().configs.length).toBe(0);
  });

  it('deleteConfig error', async () => {
    mockedAxios.delete.mockRejectedValueOnce({ message: 'delete fail' });
    await expect(
      act(async () => {
        await useConfigStore.getState().deleteConfig('badid');
      })
    ).rejects.toBe('delete fail');
    expect(useConfigStore.getState().error).toBe('delete fail');
  });

  it('toggleStatusConfig success', async () => {
    useConfigStore.setState({ configs: [{ _id: '5', name: 'Toggle', slug: 'toggle-slug', status: false, configFields: [] }] });
    mockedAxios.patch.mockResolvedValueOnce({ data: { data: { status: 'active' } } });
    await act(async () => {
      await useConfigStore.getState().toggleStatusConfig('5');
    });
    expect(useConfigStore.getState().configs[0].status).toBe(true);
  });

  it('toggleStatusConfig error', async () => {
    mockedAxios.patch.mockRejectedValueOnce({ message: 'toggle fail' });
    await expect(
      act(async () => {
        await useConfigStore.getState().toggleStatusConfig('badid');
      })
    ).rejects.toBe('toggle fail');
    expect(useConfigStore.getState().error).toBe('toggle fail');
  });

  it('restoreConfig success', async () => {
    useConfigStore.setState({ configs: [{ _id: '6', name: 'Trash', slug: 'trash-slug', status: false, configFields: [] }] });
    mockedAxios.patch.mockResolvedValueOnce({});
    await act(async () => {
      await useConfigStore.getState().restoreConfig('6');
    });
    expect(useConfigStore.getState().configs.length).toBe(0);
  });

  it('restoreConfig error', async () => {
    mockedAxios.patch.mockRejectedValueOnce({ message: 'restore fail' });
    await expect(
      act(async () => {
        await useConfigStore.getState().restoreConfig('badid');
      })
    ).rejects.toBe('restore fail');
    expect(useConfigStore.getState().error).toBe('restore fail');
  });

  it('deleteConfigPermanently success', async () => {
    useConfigStore.setState({ configs: [{ _id: '7', name: 'Perm', slug: 'perm-slug', status: false, configFields: [] }] });
    mockedAxios.delete.mockResolvedValueOnce({});
    await act(async () => {
      await useConfigStore.getState().deleteConfigPermanently('7');
    });
    expect(useConfigStore.getState().configs.length).toBe(0);
  });

  it('deleteConfigPermanently error', async () => {
    mockedAxios.delete.mockRejectedValueOnce({ message: 'perm delete fail' });
    await expect(
      act(async () => {
        await useConfigStore.getState().deleteConfigPermanently('badid');
      })
    ).rejects.toBe('perm delete fail');
    expect(useConfigStore.getState().error).toBe('perm delete fail');
  });

  it('fetchTrashConfigs success', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: [{ _id: '8', name: 'Trash', slug: 'trash-slug', status: false, configFields: [] }],
        meta: { total: 1, active: 0, inactive: 1, totalPages: 1 },
      },
    });
    await act(async () => {
      await useConfigStore.getState().fetchTrashConfigs();
    });
    expect(useConfigStore.getState().configs.length).toBe(1);
    expect(useConfigStore.getState().stats.inactive).toBe(1);
  });

  it('fetchTrashConfigs error', async () => {
    mockedAxios.get.mockRejectedValueOnce({ message: 'trash fail' });
    await expect(
      act(async () => {
        await useConfigStore.getState().fetchTrashConfigs();
      })
    ).rejects.toBe('trash fail');
    expect(useConfigStore.getState().error).toBe('trash fail');
  });
});
