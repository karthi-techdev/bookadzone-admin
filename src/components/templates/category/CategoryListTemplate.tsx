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
import { truncate } from '../../utils/helper';
import ImportedURL from '../../common/urls';

const CategoryListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    categories,
    fetchCategories,
    deleteCategory,
    toggleStatusCategory,
    totalPages,
    loading,
    error,
    // stats, // If you add stats to AgencyStore, you can use for statFilters
  } = useCategoryStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // If you add stats, you can use statFilters like FAQ
  // const statFilters: StatFilter[] = [ ... ];

  useEffect(() => {
    fetchCategories(currentPage, itemsPerPage);
  }, [currentPage]);

  useEffect(() => {
    if (error) {
      console.log('Error from CategoryStore:', error);
      toast.error(error, { position: 'top-right', autoClose: 3000 });
    }
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  // Filter search term locally (after API filter is applied)
  const searchedCategories = categories.filter((category) =>
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnConfig<Category>[] = [
    {
      key: 'photo',
      label: 'Photo',
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
    { key: 'name', label: 'Category Name', render: (value) => truncate(value, 40) },
    { key: 'slug', label: 'Slug', render: (value) => truncate(value, 40) },
    { key: 'description', label: 'Description', render: (value) => truncate(value, 40) },

  ];

  // Delete handler with page adjustment
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
        const updatedLength = searchedCategories.length - 1;
        const newTotalItems = categories.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1);
        } else {
          await fetchCategories(currentPage, itemsPerPage);
        }
        Swal.fire('Deleted!', 'The category has been removed.', 'success');
      }
    });
  };

  if (loading) return <BAZLoader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Category"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/category/add"
        // statFilters={statFilters} // Uncomment if you add stats
        // selectedFilterId={selectedFilter} // Uncomment if you add stats
        // onSelectFilter={...} // Uncomment if you add stats
        module="category"
      />

      <ManagementTable
        data={searchedCategories}
        columns={columns}
        onEdit={(row) => navigate(`/categorys/edit/${row._id}`)}
        onToggleStatus={(row) => toggleStatusCategory(row._id!)}
        onDelete={handleDelete}
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

export default CategoryListTemplate;
