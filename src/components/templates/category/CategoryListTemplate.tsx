import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import TableHeader from '../../molecules/TableHeader';
import ManagementTable from '../../organisms/ManagementTable';
import BAZLoader from '../../atoms/BAZ-Loader';
import Pagination from '../../atoms/BAZ-Pagination';

import { useCategoryStore } from '../../stores/categoryStore';
import type { ColumnConfig, Category } from '../../types/common';
import { truncate } from '../../utils/helper'
import ImportedURL from '../../common/urls';


interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}



const CategoryListTemplate: React.FC = () => {
  const navigate = useNavigate();

  const {
    category,
    fetchCategorys,
    deleteCategory,
    toggleStatusCategory,
    totalPages,
    loading,
    error,
    stats,
  } = useCategoryStore();

  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<'total' | 'active' | 'inactive'>('total');
  const itemsPerPage = 10;

  // Calculate total items for pagination based on selected filter
  const getTotalItems = () => {
    if (selectedFilter === 'active') return stats.active;
    if (selectedFilter === 'inactive') return stats.inactive;
    return stats.total;
  };
  const filteredTotalPages = Math.max(1, Math.ceil(getTotalItems() / itemsPerPage));

  // Fetch data on page or filter change
  useEffect(() => {
    fetchCategorys(currentPage, itemsPerPage, selectedFilter);
  }, [currentPage, selectedFilter]);

  // Show error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Handle pagination
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  // Filter search term locally (after API filter is applied)
  const searchedCategorys = category.filter((category) =>
    category.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    category.slug?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  // Stats for filter buttons
  const statFilters: StatFilter[] = [
    {
      id: 'total',
      title: 'All Categorys',
      value: stats.total,
      trend: 'up',
      change: '2%',
      icon: null,
    },
    {
      id: 'active',
      title: 'Active Categorys',
      value: stats.active,
      trend: 'up',
      change: '1%',
      icon: null,
    },
    {
      id: 'inactive',
      title: 'Inactive Categorys',
      value: stats.inactive,
      trend: 'down',
      change: '1%',
      icon: null,
    },
  ];

  // Delete handler
  const handleDelete = (category: Category) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${category.name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteCategory(category._id!);

        const updatedLength = searchedCategorys.length - 1;
        const newTotalItems = category.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        // Adjust current page if necessary
        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1); // Go to the last page or page 1 if no pages remain
        } else {
          await fetchCategorys(currentPage, itemsPerPage, selectedFilter);
        }

        Swal.fire('Deleted!', 'The Category has been removed.', 'success');
      }
    });
  };

  const columns: ColumnConfig<Category>[] = [
    {
      key: 'name',
      label: ' Name',
      render: (value) => truncate(value, 40),
    },
    {
      key: 'slug',
      label: 'Slug',
      render: (value) => truncate(value, 40),
    },
    {
      key: 'photo',
      label: 'Image',
      render: (value) =>
        value ? (
          <img
            src={`${ImportedURL.FILEURL}${value}`}
            alt="Category"
            className="w-10 h-10 object-cover rounded-full border"
          />
        ) : (
          <span className="text-gray-400 text-xs">No image</span>
        ),
    },
  ];

  if (loading) return <BAZLoader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Category"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/category/add"
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          setSelectedFilter(id as 'total' | 'active' | 'inactive');
          setCurrentPage(1);
        }}
        module="category"
      />

      <ManagementTable

      
        data={searchedCategorys}
        columns={columns}
        onEdit={(row) => navigate(`/categorys/edit/${row._id}`)}
        onToggleStatus={(row) => toggleStatusCategory(row._id!)}
        onDelete={handleDelete}
        currentPage={currentPage}
        limit={itemsPerPage}
        module="category"

      />

      {filteredTotalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            pageCount={filteredTotalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryListTemplate;