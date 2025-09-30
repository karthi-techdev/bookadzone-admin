// import { act } from '@testing-library/react';
// import axios from 'axios';
// import { useBlogCategoryStore } from '../blogCategoryCategoryStore';

// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// describe('BlogCategory Store', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//     useBlogCategoryStore.setState({
//       blogCategory: [],
//       stats: { total: 0, active: 0, inactive: 0 },
//       loading: false,
//       error: null,
//       page: 1,
//       totalPages: 1,
//     });
//   });

//   it('fetches blogCategory categories and updates state', async () => {
//     const fakeBlogs = [{ _id: '1', name: 'Cat1', status: true }];
//     const response = {
//       data: {
//         data: fakeBlogs,
//         meta: { total: 1, active: 1, inactive: 0, totalPages: 1 },
//       },
//     };
//     mockedAxios.get.mockResolvedValueOnce(response);

//     await act(async () => {
//       await useBlogCategoryStore.getState().fetchBlog(1, 10, 'total');
//     });

//     expect(useBlogCategoryStore.getState().blogCategory).toEqual(fakeBlogs);
//     expect(useBlogCategoryStore.getState().stats.total).toBe(1);
//     expect(useBlogCategoryStore.getState().loading).toBe(false);
//   });

//   it('handles error in fetchBlog', async () => {
//     mockedAxios.get.mockRejectedValueOnce({ message: 'Network error' });

//     await expect(
//       useBlogCategoryStore.getState().fetchBlog(1, 10, 'total')
//     ).rejects.toMatch('Network error');

//     expect(useBlogCategoryStore.getState().error).toBe('Network error');
//   });

//   it('adds a new blogCategory category', async () => {
//     const newBlog = { name: 'Cat2', status: true };
//     const returnedBlog = { ...newBlog, _id: '2' };
//     mockedAxios.post.mockResolvedValueOnce({ data: { data: returnedBlog } });

//     await act(async () => {
//       await useBlogCategoryStore.getState().addBlogCategory(newBlog as any);
//     });

//     expect(
//       useBlogCategoryStore.getState().blogCategory.find((b) => b._id === '2')
//     ).toEqual(returnedBlog);
//   });

//   it('updates blogCategory category by ID', async () => {
//     const existingBlog = { _id: '1', name: 'Old', label: 'Old', status: true };
//     useBlogCategoryStore.setState({ blogCategory: [existingBlog] });

//     const updatedData = { name: 'Updated', status: false };
//     mockedAxios.put.mockResolvedValueOnce({
//       data: { data: { ...updatedData, _id: '1' } },
//     });

//     await act(async () => {
//       await useBlogCategoryStore
//         .getState()
//         .updateBlogCategory('1', updatedData as any);
//     });

//     const updatedBlog = useBlogCategoryStore
//       .getState()
//       .blogCategory.find((b) => b._id === '1');
//     expect(updatedBlog?.name).toBe('Updated');
//     expect(updatedBlog?.status).toBe(false);
//   });

//   it('deletes blogCategory category by ID', async () => {
//     const existingBlog = { _id: '5', name: 'Delete Me', label: 'Delete Me', status: true };
//     useBlogCategoryStore.setState({ blogCategory: [existingBlog] });

//     mockedAxios.delete.mockResolvedValueOnce({});

//     await act(async () => {
//       await useBlogCategoryStore.getState().deleteBlog('5');
//     });

//     expect(
//       useBlogCategoryStore.getState().blogCategory.find((b) => b._id === '5')
//     ).toBeUndefined();
//   });

//   it('toggles blogCategory status', async () => {
//     const returnedBlog = { _id: '10', name: 'Toggle Me', label: 'Toggle Me', status: false };
//     useBlogCategoryStore.setState({ blogCategory: [returnedBlog] });

//     mockedAxios.patch.mockResolvedValueOnce({
//       data: { data: { status: 'active' } },
//     });

//     await act(async () => {
//       await useBlogCategoryStore.getState().toggleStatusBlog('10');
//     });

//     expect(useBlogCategoryStore.getState().blogCategory[0].status).toBe(true);
//   });

//   it('permanently deletes a blogCategory category', async () => {
//     const blogCategory = { _id: 'p1', name: 'Perm Delete', label: 'Perm Delete', status: true };
//     useBlogCategoryStore.setState({ blogCategory: [blogCategory] });

//     mockedAxios.delete.mockResolvedValueOnce({});

//     await act(async () => {
//       await useBlogCategoryStore.getState().deleteBlogPermanently('p1');
//     });

//     expect(
//       useBlogCategoryStore.getState().blogCategory.find((b) => b._id === 'p1')
//     ).toBeUndefined();
//   });

//   it('fetches trash blogCategorys', async () => {
//     const fakeTrash = [{ _id: 't1', name: 'Trash1', status: false }];
//     const response = {
//       data: {
//         data: fakeTrash,
//         meta: { total: 1, active: 0, inactive: 1, totalPages: 1 },
//       },
//     };
//     mockedAxios.patch.mockResolvedValueOnce(response);

//     await act(async () => {
//       await useBlogCategoryStore.getState().fetchTrashBlog(1, 10, 'inactive');
//     });

//     expect(useBlogCategoryStore.getState().blogCategory).toEqual(fakeTrash);
//     expect(useBlogCategoryStore.getState().stats.inactive).toBe(1);
//   });

//   it('fetches blogCategory category by ID', async () => {
//     const blogCategory = { _id: 'b1', name: 'ById', status: true };
//     mockedAxios.get.mockResolvedValueOnce({ data: { data: blogCategory } });

//     let result: any = null;
//     await act(async () => {
//       result = await useBlogCategoryStore
//         .getState()
//         .fetchBlogCategoryById('b1');
//     });

//     expect(result).toEqual(blogCategory);
//   });

//   it('handles error in fetchBlogCategoryById', async () => {
//     mockedAxios.get.mockRejectedValueOnce({ message: 'ID error' });

//     let result: any = null;
//     await act(async () => {
//       result = await useBlogCategoryStore
//         .getState()
//         .fetchBlogCategoryById('404');
//     });

//     expect(result).toBeNull();
//     expect(useBlogCategoryStore.getState().error).toBe('ID error');
//   });
// });
