import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../../molecules/TableHeader';
import ManagementTable from '../../../organisms/ManagementTable';
import BAZLoader from '../../../atoms/BAZ-Loader';
import Pagination from '../../../atoms/BAZ-Pagination';
import { useCategoryStore } from '../../../stores/categoryStore';
import type { ColumnConfig, Category } from '../../../types/common';
import { truncate } from '../../../utils/helper';
import ImportedURL from '../../../common/urls';

const CategoryTrashListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    categories,
    fetchTrashCategories,
    restoreCategory,
    deleteCategoryPermanently,
    totalPages,
    loading,
    error,
    // stats, // If you add stats to AgencyStore, you can use for statFilters
  } = useCategoryStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTrashCategories(currentPage, itemsPerPage);
  }, [currentPage]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
    fetchTrashCategories(newPage, itemsPerPage);
  };

  // Filter search term locally (after API filter is applied)
  const searchedCategories = categories.filter((category) =>
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnConfig<Category>[] = [
    { key: 'name', label: 'Name', render: (value) => truncate(value, 40) },
    { key: 'slug', label: 'Slug', render: (value) => truncate(value, 40) },
    { key: 'description', label: 'Description', render: (value) => truncate(value, 40) },
    {
      key: 'status',
      label: 'Status',
      render: (value) => value === 'active' ? 'Active' : 'Inactive',
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
        await fetchTrashCategories(currentPage, itemsPerPage);
        Swal.fire('Restored!', 'The category has been restored.', 'success');
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
        await fetchTrashCategories(currentPage, itemsPerPage);
        Swal.fire('Deleted!', 'The category has been permanently deleted.', 'success');
      }
    });
  };

  if (loading) return <BAZLoader />;

  // Debug: log the data being passed to the table
  console.log('agencies:', categories);
  console.log('searchedAgencies:', searchedCategories);

  return (
    <div className="p-6">
      <TableHeader
        managementName="Deleted Categories"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Back to List"
        addButtonLink="/category"
        module="category"
      />
      <ManagementTable
        data={searchedCategories.length ? searchedCategories : categories}
        columns={columns}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        currentPage={currentPage}
        limit={itemsPerPage}
        module="category"
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

export default CategoryTrashListTemplate;
