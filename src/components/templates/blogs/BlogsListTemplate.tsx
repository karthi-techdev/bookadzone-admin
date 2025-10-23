import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import ManagementTable from '../../organisms/ManagementTable';
import BAZLoader from '../../atoms/BAZ-Loader';
import Pagination from '../../atoms/BAZ-Pagination';
// import { useCategoryStore } from '../../stores/categoryStore';
import { useBlogStore } from '../../stores/blogStore';
import { useBlogCategoryStore } from '../../stores/blogCategoryStore';
import type { ColumnConfig, Blog } from '../../types/common';
import { truncate } from '../../utils/helper';
import ImportedURL from '../../common/urls';

const BlogListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    blogs,
    fetchBlogs,
    deleteBlog,
    toggleStatusBlog,
    totalPages,
    loading,
    error,
    // stats, // If you add stats to BlogStore, you can use for statFilters
  } = useBlogStore();

  const { blogCategory: categories, fetchAllActiveBlogCategories } = useBlogCategoryStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // If you add stats, you can use statFilters like FAQ
  // const statFilters: StatFilter[] = [ ... ];

  useEffect(() => {
    fetchBlogs(currentPage, itemsPerPage);
  }, [currentPage]);

  useEffect(() => {
    fetchAllActiveBlogCategories().catch(() => {});
  }, [fetchAllActiveBlogCategories]);

  useEffect(() => {
    if (error) {
      console.log('Error from BlogStore:', error);
      toast.error(error, { position: 'top-right', autoClose: 3000 });
    }
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  // Filter search term locally (after API filter is applied)
  const searchedblogs = blogs.filter((blog) =>
    blog.seoTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.seoDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.blogTitle.toLowerCase().includes(searchTerm.toLowerCase())

  );

  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    (categories || []).forEach((c: any) => {
      if (c && c._id) map[c._id] = c.name;
    });
    return map;
  }, [categories]);

  const columns: ColumnConfig<Blog>[] = [
    {
      key: 'blogImg',
      label: 'Blog Image',
      render: (value) => {
        if (typeof value === 'string' && value.trim() !== '') {
          // Remove leading slash if present to avoid double slash in URL
          const imgPath = value.startsWith('/') ? value.slice(1) : value;
          return (
            <img
              src={`${ImportedURL.FILEURL}${imgPath}`}
              alt="photo"
              style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 30 }}
            />
          );
        }
        return '-';
      },
    },
    { key: 'blogTitle', label: 'Blog Title', render: (value) => truncate(value, 20) },
    { key: 'blogCategory', label: 'Blog Category', render: (value) => truncate((categoryMap as any)[value] || value, 20) },
    { key: 'seoTitle', label: 'Seo Title', render: (value) => truncate(value, 20) },
    { key: 'seoDescription', label: 'Seo Description', render: (value) => truncate(value, 20) },


  ];

  // Delete handler with page adjustment
  const handleDelete = (blog: Blog) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${blog.blogTitle}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteBlog(blog._id!);
        const updatedLength = searchedblogs.length - 1;
        const newTotalItems = blogs.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1);
        } else {
          await fetchBlogs(currentPage, itemsPerPage);
        }
        Swal.fire('Deleted!', 'The blog has been removed.', 'success');
      }
    });
  };

  if (loading) return <BAZLoader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Blogs"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/blog/add"
        // statFilters={statFilters} // Uncomment if you add stats
        // selectedFilterId={selectedFilter} // Uncomment if you add stats
        // onSelectFilter={...} // Uncomment if you add stats
        module="blog"
      />

      <ManagementTable
        data={searchedblogs}
        columns={columns}
        onEdit={(row) => navigate(`/blogs/edit/${row._id}`)}
        onToggleStatus={(row) => toggleStatusBlog(row._id!)}
        onDelete={handleDelete}
        currentPage={currentPage}
        limit={itemsPerPage}
        module="blog"
      />

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default BlogListTemplate;
