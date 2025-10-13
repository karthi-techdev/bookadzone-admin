
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import TableHeader from '../../../molecules/TableHeader';
import ManagementTable from '../../../organisms/ManagementTable';
import Loader from '../../../atoms/BAZ-Loader';
import BAZPagination from '../../../atoms/BAZ-Pagination';

import { useBlogCategoryStore } from '../../../stores/blogCategoryStore';
import type { ColumnConfig, BlogCategory } from '../../../types/common';
import { truncate } from '../../../utils/helper'

interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}

const BlogCategoryTrashListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    blogCategory,
    fetchTrashBlogCategory,
    totalPages,
    loading,
    error,
    stats,
    restoreBlogCategory,
    deleteBlogCategoryPermanently,
  } = useBlogCategoryStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<'total' | 'active' | 'inactive'>('total');
  const itemsPerPage = 20;

  // Calculate total items for pagination based on selected filter
  const getTotalItems = () => {
    if (selectedFilter === 'active') return stats.active;
    if (selectedFilter === 'inactive') return stats.inactive;
    return stats.total;
  };
  const filteredTotalPages = Math.max(1, Math.ceil(getTotalItems() / itemsPerPage));

  // Fetch data on page or filter change
  useEffect(() => {
    fetchTrashBlogCategory(currentPage, itemsPerPage, selectedFilter);
  }, [currentPage, selectedFilter, itemsPerPage, selectedFilter]);

  // Show error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Handle pagination
  const handlePageChange = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
    fetchTrashBlogCategory(newPage, itemsPerPage, selectedFilter);
  };

  const searchedBlogCategory = blogCategory.filter((blogCategory) =>
    blogCategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blogCategory.slug.toLowerCase().includes(searchTerm.toLowerCase())

  );

  // Stats for filter buttons
  const statFilters: StatFilter[] = [
    {
      id: 'total',
      title: 'All blogCategoriess',
      value: stats.total,
      trend: 'up',
      change: '2%',
      icon: null,
    },
    {
      id: 'active',
      title: 'Active blogCategoriess',
      value: stats.active,
      trend: 'up',
      change: '1%',
      icon: null,
    },
    {
      id: 'inactive',
      title: 'Inactive blogCategoriess',
      value: stats.inactive,
      trend: 'down',
      change: '1%',
      icon: null,
    },
  ];

  // Restore handler
  const handleRestore = (blogCategorys: BlogCategory) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to restore "${blogCategorys.name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, restore it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await restoreBlogCategory(blogCategorys._id!);

        const updatedLength = searchedBlogCategory.length - 1;
        const newTotalItems = blogCategory.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        // Adjust current page if necessary
        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1); // Go to the last page or page 1 if no pages remain
        } else {
          await fetchTrashBlogCategory(currentPage, itemsPerPage, selectedFilter);
        }

        Swal.fire('Restored!', 'The BlogCategory has been restored.', 'success');
      }
    });
  };

  

  // Permanent delete handler
  const handlePermanentDelete = (blogCategorys: BlogCategory) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to permanently delete "${blogCategorys.name}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, delete it permanently!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteBlogCategoryPermanently(blogCategorys._id!);

        const updatedLength = searchedBlogCategory.length - 1;
        const newTotalItems = blogCategory.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        // Adjust current page if necessary
        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1); // Go to the last page or page 1 if no pages remain
        } else {
          await fetchTrashBlogCategory(currentPage, itemsPerPage, selectedFilter);
        }

        Swal.fire('Deleted!', 'The BlogCategory has been permanently deleted.', 'success');
      }
    });
  };

  const columns: ColumnConfig<BlogCategory>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (value) => truncate(value, 40),
    },
    {
      key: 'slug',
      label: 'Slug',
      render: (value) => truncate(value, 40),
    }
  ];

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      
      <TableHeader
        managementName="Deleted Blog Categories"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Back to List"
        addButtonLink="/blogCategory"
        module="blogCategory"
      />
      <ManagementTable
        data={searchedBlogCategory}
        columns={columns}
        // For trash view: only show restore and permanent delete
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        currentPage={currentPage}
        limit={itemsPerPage}
        module="blogCategory"
      />

      {filteredTotalPages > 1 && (
        <div className="flex justify-center mt-6">
          <BAZPagination
            pageCount={filteredTotalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default BlogCategoryTrashListTemplate;