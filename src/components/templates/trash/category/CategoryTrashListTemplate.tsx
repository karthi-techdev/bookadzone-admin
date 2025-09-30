// Updated FaqTrashListTemplate.tsx with fixed props, defined handlers, and removed unnecessary actions

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import TableHeader from '../../../molecules/TableHeader';
import { FiRefreshCw } from 'react-icons/fi';
import ManagementTable from '../../../organisms/ManagementTable';
import Loader from '../../../atoms/BAZ-Loader';
import BAZPagination from '../../../atoms/BAZ-Pagination';

// import { useFaqStore } from '../../../stores/FaqStore';
import { useCategoryStore } from '../../../stores/categoryStore';
import type { Category, ColumnConfig } from '../../../types/common';
import { truncate } from '../../../utils/helper'
import ImportedURL from '../../../common/urls';

interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}

const CategoryTrashListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    categorys,
    fetchTrashCategorys,
    totalPages,
    loading,
    error,
    stats,
    restoreCategory,
    deleteCategoryPermanently,
  } = useCategoryStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<'total' | 'active' | 'inactive'>('total');
  const itemsPerPage = 3;

  // Calculate total items for pagination based on selected filter
  const getTotalItems = () => {
    if (selectedFilter === 'active') return stats.active;
    if (selectedFilter === 'inactive') return stats.inactive;
    return stats.total;
  };
  const filteredTotalPages = Math.max(1, Math.ceil(getTotalItems() / itemsPerPage));

  // Fetch data on page or filter change
  useEffect(() => {
    fetchTrashCategorys(currentPage, itemsPerPage, selectedFilter);
  }, [currentPage, selectedFilter, itemsPerPage, selectedFilter]);

  // Show error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Handle pagination
  const handlePageChange = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
    fetchTrashCategorys(newPage, itemsPerPage, selectedFilter); // Fetch Categorys on page change
  };

  // Filter search term locally (after API filter is applied)
  const searchedCategorys = categorys.filter((categorys) =>
    categorys.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categorys.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats for filter buttons
  const statFilters: StatFilter[] = [
    {
      id: 'total',
      title: 'All CATEGORYs',
      value: stats.total,
      trend: 'up',
      change: '2%',
      icon: null,
    },
    {
      id: 'active',
      title: 'Active CATEGORYs',
      value: stats.active,
      trend: 'up',
      change: '1%',
      icon: null,
    },
    {
      id: 'inactive',
      title: 'Inactive CATEGORYs',
      value: stats.inactive,
      trend: 'down',
      change: '1%',
      icon: null,
    },
  ];

  // Restore handler
  const handleRestore = (category: Category) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to restore "${category.name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, restore it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await restoreCategory(category._id!);

        const updatedLength = searchedCategorys.length - 1;
        const newTotalItems = category.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        // Adjust current page if necessary
        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1); // Go to the last page or page 1 if no pages remain
        } else {
          await fetchTrashCategorys(currentPage, itemsPerPage, selectedFilter);
        }

        Swal.fire('Restored!', 'The CATEGORY has been restored.', 'success');
      }
    });
  };

  // Permanent delete handler
  const handlePermanentDelete = (category: Category) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to permanently delete "${category.name}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, delete it permanently!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteCategoryPermanently(category._id!);

        const updatedLength = searchedCategorys.length - 1;
        const newTotalItems = category.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        // Adjust current page if necessary
        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1); // Go to the last page or page 1 if no pages remain
        } else {
          await fetchTrashCategorys(currentPage, itemsPerPage, selectedFilter);
        }

        Swal.fire('Deleted!', 'The CATEGORY has been permanently deleted.', 'success');
      }
    });
  };

  const columns: ColumnConfig<Category>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (value) => truncate(value, 40),
    },
    {
      key: 'slug',
      label: 'Slug',
      render: (value) => truncate(value, 40),
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => truncate(value, 40),
    },
    {
      key: 'photo',
      label: 'Photo',
      render: (value) => {
        if (typeof value === 'string' && value) {
          const isBase64 = value.startsWith('data:image/');
          let imageUrl;
          if (isBase64) {
            imageUrl = value;
          } else {
            imageUrl = `${ImportedURL.FILEURL}uploads/category/logo/${value}`;
          }
          console.log(`Rendering photo image: ${isBase64 ? 'base64' : 'URL'} - ${imageUrl.substring(0, 50)}...`);
          return (
            <img
              src={imageUrl}
              alt="Category photo"
              className="h-12 w-12 object-contain rounded-full border"
              onError={(e) => {
                console.error(`Failed to load photo: ${imageUrl}`, e);
                e.currentTarget.src = '/placeholder-image.png';
              }}
              onLoad={() => console.log(`Successfully loaded photo: ${imageUrl}`)}
            />
          );
        }
        console.warn(`No valid photo value for rendering: ${value}`);
        return <span className="text-gray-400 text-xs">No Image</span>;
      },
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Category"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          setSelectedFilter(id as 'total' | 'active' | 'inactive');
          setCurrentPage(1);
        }}
        module="category"
        isTrashView={true}
      />

      <ManagementTable
        data={searchedCategorys}
        columns={columns}
        // For trash view: only show restore and permanent delete
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        currentPage={currentPage}
        limit={itemsPerPage}
        module="category"
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

export default CategoryTrashListTemplate;