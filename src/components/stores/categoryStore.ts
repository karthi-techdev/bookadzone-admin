// // Ensure Axios Authorization header is set from localStorage token on app initialization
// const token = localStorage.getItem('token');
// if (token) {
//   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// }
// interface CategoryState {
//   category: Category[];
//   stats: CategoryStats;
//   loading: boolean;
//   error: string | null;
//   page: number;
//   totalPages: number;
//   fetchCategorys: (
//     page?: number,
//     limit?: number,
//     filter?: 'total' | 'active' | 'inactive'
//   ) => Promise<void>;
//   fetchCategoryById: (id: string) => Promise<Category | null>;
//   addCategory: (category: Category) => Promise<void>;
//   updateCategory: (id: string, category: Category) => Promise<void>;
//   deleteCategory: (id: string) => Promise<void>;
//   toggleStatusCategory: (id: string) => Promise<void>;
//   restoreCategory: (id: string) => Promise<void>;
//   deleteCategoryPermanently: (id: string) => Promise<void>;
//   fetchTrashCategorys: (page?: number, limit?: number, filter?: 'total' | 'active' | 'inactive') => Promise<void>;
// }
// import { create } from 'zustand';
// import axios from 'axios';
// import type { Category } from '../types/common';
// import ImportedURL from '../common/urls';

// const { API } = ImportedURL;

// interface CategoryStats {
//   total: number;
//   active: number;
//   inactive: number;
// }


// export const useCategoryStore = create<CategoryState>((set) => ({
//   category: [],
//   stats: { total: 0, active: 0, inactive: 0 },
//   loading: false,
//   error: null,
//   page: 1,
//   totalPages: 1,

//   fetchCategorys: async (page = 1, limit = 20, filter = 'total') => {
//     try {
//       set({ loading: true, error: null });
//       const statusParam =
//         filter === 'active' ? 'active' :
//         filter === 'inactive' ? 'inactive' : '';
//       const res = await axios.get(`${API.listcategory}?page=${page}&limit=${limit}${statusParam ? `&status=${statusParam}` : ''}`);
//       console.log("res",res);
      
//       const data = res.data as {
//         data: Category[];
//         meta?: { total?: number; active?: number; inactive?: number; totalPages?: number };
//       };
//       set({
//         category: Array.isArray(data.data) ? data.data : [],
//         stats: {
//           total: data.meta?.total ?? 0,
//           active: data.meta?.active ?? 0,
//           inactive: data.meta?.inactive ?? 0,
//         },
//         page,
//         totalPages: data.meta?.totalPages ?? 1,
//         loading: false,
//         error: null
//       });
//     } catch (error: any) {
//       const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch Categorys';
//       set({ error: errorMessage, loading: false });
//       throw errorMessage;
//     }
//   },



// fetchTrashCategorys: async (page = 1, limit = 20, filter = 'total') => {
//   try {
//     set({ loading: true, error: null });
//     const statusParam =
//       filter === 'active' ? 'active' :
//       filter === 'inactive' ? 'inactive' : '';
//     const res = await axios.patch(`${API.trashcategorylist}?page=${page}&limit=${limit}${statusParam ? `&status=${statusParam}` : ''}`);
//     const data = res.data as {
//       data: Category[];
//       meta?: { total?: number; active?: number; inactive?: number; totalPages?: number };
//     };
//     set({
//       category: Array.isArray(data.data) ? data.data : [],
//       stats: {
//         total: data.meta?.total ?? 0,
//         active: data.meta?.active ?? 0,
//         inactive: data.meta?.inactive ?? 0,
//       },
//       page,
//       totalPages: data.meta?.totalPages ?? 1,
//       loading: false,
//       error: null
//     });
//   } catch (error: any) {
//     const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch trash Categorys';
//     set({ error: errorMessage, loading: false });
//     throw errorMessage;
//   }
// },

// // And ensure restoreCategory and deleteCategoryPermanently are implemented:

// restoreCategory: async (id: string) => {
//   try {
//     set({ loading: true, error: null });
//     await axios.patch(`${API.restorecategory}${id}`);
//     set((state) => ({
//       categorys: state.category.filter(c => c._id !== id),
//       error: null,
//       loading: false
//     }));
//   } catch (error: any) {
//     const errorMessage = error?.response?.data?.message || error?.message || 'Failed to restore Category';
//     set({ error: errorMessage, loading: false });
//     throw errorMessage;
//   }
// },

// deleteCategoryPermanently: async (id: string) => {
//   try {
//     set({ loading: true, error: null });
//     await axios.delete(`${API.permanentDeletecategory}${id}`);
//     set((state) => ({
//       categorys: state.category.filter(c => c._id !== id),
//       error: null,
//       loading: false
//     }));
//   } catch (error: any) {
//     const errorMessage = error?.response?.data?.message || error?.message || 'Failed to permanently delete Category';
//     set({ error: errorMessage, loading: false });
//     throw errorMessage;
//   }
// },

//   fetchCategoryById: async (id: string) => {
//     try {
//       set({ loading: true, error: null });
//       const res = await axios.get(`${API.getcategory}${id}`);
//       const responseData = res.data as { data: Category };
//       set({ loading: false, error: null });
//       return responseData.data;
//     } catch (error: any) {
//       const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch Category';
//       set({ error: errorMessage, loading: false });
//       return null;
//     }
//   },

//   addCategory: async (category: Category) => {
//     try {
//       set({ loading: true, error: null });

//       // If a File is provided for photo, send multipart/form-data. Otherwise send JSON.
//       const isMultipart = (category as any)?.photo instanceof File ||
//         (Array.isArray((category as any)?.photo) && (category as any).photo.some((p: any) => p instanceof File));

//       let dataToSend: any;
//       let axiosConfig: any = undefined;

//       if (isMultipart) {
//         const formData = new FormData();
//         if ((category as any).name != null) formData.append('name', String((category as any).name));
//         if ((category as any).slug != null) formData.append('slug', String((category as any).slug));
//         if ((category as any).description != null) formData.append('description', String((category as any).description));
//         if ((category as any).isFeatured != null) formData.append('isFeatured', (category as any).isFeatured ? 'true' : 'false');

//         const photoVal: any = (category as any).photo;
//         if (Array.isArray(photoVal)) {
//           photoVal.forEach((file: any) => {
//             if (file instanceof File) formData.append('photo', file);
//           });
//         } else if (photoVal instanceof File) {
//           formData.append('photo', photoVal);
//         } else if (typeof photoVal === 'string' && photoVal.trim() !== '') {
//           formData.append('photo', photoVal);
//         }

//         dataToSend = formData;
//         axiosConfig = { headers: { 'Content-Type': 'multipart/form-data' } };
//       } else {
//         dataToSend = { ...category };
//       }

//       const res = await axios.post(API.addcategory, dataToSend, axiosConfig);
//       const responseData = res.data as { data: Category };
//       set((state) => ({
//         categorys: [...state.category, responseData.data],
//         error: null,
//         loading: false
//       }));
//     } catch (error: any) {
//       const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add Category';
//       set({ error: errorMessage, loading: false });
//       throw errorMessage;
//     }
//   },

//   updateCategory: async (id: string, category: Category) => {
//     try {
//       set({ loading: true, error: null });

//       // If a File is provided for photo, send multipart/form-data. Otherwise send JSON.
//       const isMultipart = (category as any)?.photo instanceof File ||
//         (Array.isArray((category as any)?.photo) && (category as any).photo.some((p: any) => p instanceof File));

//       let dataToSend: any;
//       let axiosConfig: any = undefined;

//       if (isMultipart) {
//         const formData = new FormData();
//         if ((category as any).name != null) formData.append('name', String((category as any).name));
//         if ((category as any).slug != null) formData.append('slug', String((category as any).slug));
//         if ((category as any).description != null) formData.append('description', String((category as any).description));
//         if ((category as any).isFeatured != null) formData.append('isFeatured', (category as any).isFeatured ? 'true' : 'false');

//         dataToSend = formData;
//         axiosConfig = { headers: { 'Content-Type': 'multipart/form-data' } };
//       } else {
//         dataToSend = { ...category };
//       }

//       const res = await axios.put(`${API.updatecategory}${id}`, dataToSend, axiosConfig);
//       const responseData = res.data as { data: Category };
//       set((state) => ({
//         categorys: state.category.map(c => c._id === id ? { ...c, ...responseData.data } : c),
//         error: null,
//         loading: false
//       }));
//     } catch (error: any) {
//       const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update Category';
//       set({ error: errorMessage, loading: false });
//       throw errorMessage;
//     }
//   },

//   deleteCategory: async (id: string) => {
//     try {
//       set({ loading: true, error: null });
//       await axios.delete(`${API.deletecategory}${id}`);
//       set((state) => ({
//         categorys: state.category.filter(c => c._id !== id),
//         error: null,
//         loading: false
//       }));
//     } catch (error: any) {
//       const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete Category';
//       set({ error: errorMessage, loading: false });
//       throw errorMessage;
//     }
//   },

//   toggleStatusCategory: async (id: string) => {
  
//     try {
//       set({ loading: true, error: null });
//       const res = await axios.patch(`${API.toggleStatuscategory}${id}`);
//       const responseData = res.data as { data: { status: string } };
//       set((state) => ({
//         category: state.category.map(f => {
//           if (f._id === id) {
//             return {
//               ...f,
//               status: responseData.data.status === 'active'
//             };
//           }
//           return f;
//         }),
//         error: null,
//         loading: false
//       }));
//     } catch (error: any) {
//       const errorMessage =
//         error?.response?.data?.message ||
//         error?.message ||
//         'Failed to toggle status';
//       set({ error: errorMessage, loading: false });
//       throw errorMessage;
//     }
//   },

// }));



import { create } from 'zustand';
import axios from 'axios';
// import type { FooterInfo } from '../types/common';
import type { Category } from '../types/common';
import ImportedURL from '../common/urls';
const { API } = ImportedURL;

interface CategoryState {
  categorys: Category[];
  loading: boolean;
  page: number;
  totalPages: number;
  error: string | null;
  stats: { total: number; active: number; inactive: number };
  fetchCategorys: (page: number, limit: number, status?: 'total' | 'active' | 'inactive') => Promise<void>;
  fetchCategoryById: (id: string) => Promise<Category>;
  addCategory: (category: FormData) => Promise<void>;
  updateCategory: (id: string, category: FormData) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  toggleStatusCategory: (id: string) => Promise<void>;
  restoreCategory: (id: string) => Promise<void>;
  deleteCategoryPermanently: (id: string) => Promise<void>;
  fetchTrashCategorys: (page?: number, limit?: number, filter?: 'total' | 'active' | 'inactive') => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categorys: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 1,
  stats: { total: 0, active: 0, inactive: 0 },

  fetchCategorys: async (page: number, limit: number, status?: 'total' | 'active' | 'inactive') => {
    try {
      set({ loading: true, error: null });
      const params = { page, limit, status: status !== 'total' ? status : undefined };
      const res = await axios.get(API.listcategory, { params });
      const categoryData = Array.isArray(res.data?.data?.data) ? res.data.data.data : [];
      console.log("====1",categoryData);
      
      set({
        categorys: categoryData,
        stats: res.data?.data?.meta || { total: categoryData.length, active: 0, inactive: 0 },
        error: null,
        loading: false,
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch categorys';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  fetchCategoryById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API.getcategorybyId}${id}`);
      const category = res.data.data as Category;
      set({ error: null, loading: false });
      return category;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch category';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  addCategory: async (category: FormData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(API.addcategory, category, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const responseData = res.data.data as Category;
      set((state) => ({
        categorys: [...state.categorys, responseData],
        stats: {
          ...state.stats,
          total: state.stats.total + 1,
          active: responseData.status ? state.stats.active + 1 : state.stats.active,
          inactive: !responseData.status ? state.stats.inactive + 1 : state.stats.inactive,
        },
        error: null,
        loading: false,
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add category';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  updateCategory: async (id: string, category: FormData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(`${API.updatecategory}${id}`, category, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const responseData = res.data.data as Category;
      set((state) => ({
        categorys: state.categorys.map((c) => (c._id === id ? { ...c, ...responseData } : c)),
        stats: {
          ...state.stats,
          active: responseData.status
            ? state.stats.active + (state.categorys.find((c) => c._id === id)?.status ? 0 : 1)
            : state.stats.active - (state.categorys.find((c) => c._id === id)?.status ? 1 : 0),
          inactive: !responseData.status
            ? state.stats.inactive + (state.categorys.find((c) => c._id === id)?.status ? 1 : 0)
            : state.stats.inactive - (state.categorys.find((c) => c._id === id)?.status ? 0 : 1),
        },
        error: null,
        loading: false,
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update category';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  deleteCategory: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API.deletecategory}${id}`);
      set((state) => ({
        categorys: state.categorys.filter((c) => c._id !== id),
        stats: {
          ...state.stats,
          total: state.stats.total - 1,
          active: state.categorys.find((c) => c._id === id)?.status
            ? state.stats.active - 1
            : state.stats.active,
          inactive: !state.categorys.find((c) => c._id === id)?.status
            ? state.stats.inactive - 1
            : state.stats.inactive,
        },
        error: null,
        loading: false,
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete category';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  restoreCategory: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.patch(`${API.restorecategory}${id}`);
      set((state) => ({
        categorys: state.categorys.filter(c => c._id !== id),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to restore category';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  deleteCategoryPermanently: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API.permanentDeletecategory}${id}`);
      set((state) => ({
        categorys: state.categorys.filter(c => c._id !== id),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to permanently delete Category';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

  fetchTrashCategorys: async (page = 1, limit = 20, filter = 'total') => {
    try {
      set({ loading: true, error: null });
      const statusParam = filter === 'total' ? '' : `&status=${filter}`;
      const res = await axios.get(`${API.trashcategorylist}?page=${page}&limit=${limit}${statusParam}`); // Changed to GET
      const data = res.data as {
        data: Category[];
        meta?: { total?: number; active?: number; inactive?: number; totalPages?: number };
      };
      set({
        categorys: Array.isArray(data.data) ? data.data : [],
        stats: {
          total: data.meta?.total ?? 0,
          active: data.meta?.active ?? 0,
          inactive: data.meta?.inactive ?? 0,
        },
        page,
        totalPages: data.meta?.totalPages ?? 1,
        loading: false,
        error: null
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch trash Category';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

   toggleStatusCategory: async (id: string) => {
  
    try {
      set({ loading: true, error: null });
      const res = await axios.patch(`${API.toggleStatuscategory}${id}`);
      const responseData = res.data as { data: { status: string } };
      set((state) => ({
        categorys: state.categorys.map(f => {
          if (f._id === id) {
            return {
              ...f,
              status: responseData.data.status === 'active'
            };
          }
          return f;
        }),
        error: null,
        loading: false
      }));
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to toggle status';
      set({ error: errorMessage, loading: false });
      throw errorMessage;
    }
  },

}));