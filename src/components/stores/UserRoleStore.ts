// In UserRoleStore.ts
import { create } from 'zustand';
import axios from 'axios';
import ImportedURL from '../common/urls';

const { API } = ImportedURL;

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} else {
  console.error('UserRoleStore: No token found in localStorage');
}

type PermissionType = {
  slug: string;
  menuGroupId: string;
};

type SubmenuType = {
  id: string;
  name: string;
  slug: string;
  permissions: PermissionType[];
};

type MenuType = {
  name: string;
  permissions: string[];
  submenus: SubmenuType[];
};

type PrivilegeTableType = Record<string, MenuType>;

interface IRole {
  _id: string;
  name: string;
  status: 'active' | 'inactive';
  isDeleted: boolean;
  rolePrivileges?: { menuGroupId: string; status: boolean }[];
}

interface IRoleWithPrivileges {
  name: string;
  rolePrivileges: { menuGroupId: string; status: boolean }[];
}

interface RoleStats {
  total: number;
  active: number;
  inactive: number;
}

interface UserRoleState {
  privilegeTable: PrivilegeTableType;
  roles: IRole[];
  stats: RoleStats;
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  fetchPrivilegeTable: () => Promise<void>;
  fetchRoles: (page?: number, limit?: number, filter?: 'total' | 'Active' | 'Inactive') => Promise<void>;
  fetchRoleById: (id: string) => Promise<IRole | null>;
  createRole: (roleData: IRoleWithPrivileges) => Promise<void>;
  updateRole: (id: string, role: IRole & { rolePrivileges?: { menuGroupId: string; status: boolean }[] }) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
  toggleStatusRole: (id: string) => Promise<void>;
}

export const useUserRoleStore = create<UserRoleState>((set) => ({
  privilegeTable: {},
  roles: [],
  stats: { total: 0, active: 0, inactive: 0 },
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,

  fetchRoles: async (page = 1, limit = 5, filter = 'total') => {
    try {
      set({ loading: true, error: null });
      const statusParam =
        filter === 'Active' ? 'active' :
        filter === 'Inactive' ? 'inactive' : '';
      const response = await axios.get(`${API.listuserrole}?page=${page}&limit=${limit}${statusParam ? `&status=${statusParam}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` },
      });


      const data = response.data as {
        data: IRole[];
        meta?: { total?: number; active?: number; inactive?: number; totalPages?: number };
      };
      set({
        roles: Array.isArray(data.data) ? data.data : [],
        stats: {
          total: data.meta?.total ?? 0,
          active: data.meta?.active ?? 0,
          inactive: data.meta?.inactive ?? 0,
        },
        page,
        totalPages: data.meta?.totalPages ?? 1,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch roles';
      set({ loading: false, error: errorMessage });
      throw errorMessage;
    }
  },

  fetchPrivilegeTable: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(API.createprivilegetable, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      if (!data || !data.data) throw new Error('Invalid response data from server');

      const { menupermissons, menu } = data.data;

      const transformedPrivilegeTable: PrivilegeTableType = {};
      menu.forEach((menuItem: any) => {
        const menuId = menuItem.slug;
        transformedPrivilegeTable[menuId] = {
          name: menuItem.menu,
          permissions: menupermissons.map((perm: any) => perm.name),
          submenus: Array.isArray(menuItem.submenus)
            ? menuItem.submenus.map((submenu: any) => ({
                id: submenu.id,
                name: submenu.submenu,
                slug: submenu.slug,
                permissions: Array.isArray(submenu.permisson)
                  ? submenu.permisson.map((perm: any) => ({
                      slug: perm.menupermissonSlug,
                      menuGroupId: perm.menuGroupId,
                    }))
                  : [],
              }))
            : [],
        };
      });

      set({ privilegeTable: transformedPrivilegeTable, loading: false, error: null });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch privilege table';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  createRole: async (roleData: IRoleWithPrivileges) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post(API.adduserrole, roleData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 201) throw new Error(response.data.message || 'Failed to create role');

     


      await useUserRoleStore.getState().fetchRoles();
      set({ loading: false, error: null });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create role';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  fetchRoleById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API.getuserrole}${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const responseData = res.data as { data: IRole };
     
      set({ loading: false, error: null });
      return responseData.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch role';
      set({ error: errorMessage, loading: false });
      return null;
    }
  },

  updateRole: async (id: string, role: IRole & { rolePrivileges?: { menuGroupId: string; status: boolean }[] }) => {
    try {
      set({ loading: true, error: null });
      let normalizedStatus: 'active' | 'inactive' | string = '';
      if (typeof role.status === 'string') {
        normalizedStatus = role.status === 'active' ? 'active' : 'inactive';
      } else if (typeof role.status === 'boolean') {
        normalizedStatus = role.status ? 'active' : 'inactive';
      }

      const payload = { ...role, status: normalizedStatus };
      const res = await axios.put(`${API.updateuserrole}${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData = res.data as { data: IRole };
      set((state) => ({
        roles: state.roles.map(r => r._id === id ? { ...r, ...responseData.data } : r),
        error: null,
        loading: false,
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update role';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  deleteRole: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API.deleteuserrole}${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        roles: state.roles.filter(r => r._id !== id),
        error: null,
        loading: false,
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete role';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  toggleStatusRole: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.patch(`${API.toggleStatususerrole}${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const responseData = res.data as { data: { status: string } };
      set((state) => ({
        roles: state.roles.map(r => {
          if (r._id === id) {
            return {
              ...r,
              status: responseData.data.status === 'active' ? 'active' : 'inactive',
            };
          }
          return r;
        }),
        error: null,
        loading: false,
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to toggle status';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },
}));