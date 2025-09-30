


import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import TableHeader from '../../molecules/TableHeader';
import ManagementTable from '../../organisms/ManagementTable';
import BAZLoader from '../../atoms/BAZ-Loader';
import Pagination from '../../atoms/BAZ-Pagination';
import { useCategoryStore } from '../../stores/categoryStore';
import type { ColumnConfig, Category } from '../../types/common';
import { truncate } from '../../utils/helper';
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
  const { categorys, fetchCategorys, deleteCategory, toggleStatusCategory, loading, error, stats } = useCategoryStore();
console.log("categorys",categorys);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<'total' | 'active' | 'inactive'>('total');
  const itemsPerPage = 3;

  // Debug footers state
  useEffect(() => {
    console.log('Categorys State:', categorys, 'Is Array:', Array.isArray(categorys));
  }, [categorys]);

  // Fetch data
  useEffect(() => {
    console.log('Fetching categorys with params:', { currentPage, itemsPerPage, selectedFilter });
    fetchCategorys(currentPage, itemsPerPage, selectedFilter);
  }, [fetchCategorys, currentPage, selectedFilter, itemsPerPage]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.log('Error from CategoryStore:', error);
      toast.error(error, { position: 'top-right', autoClose: 3000 });
    }
  }, [error]);

  // Handle pagination
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  // Filter search term
  const searchedCategorys = useMemo(() => {
    if (!Array.isArray(categorys)) {
      console.warn('Categorys is not an array:', categorys);
      return [];
    }
    const result = categorys.filter((category) =>
      [
        category.description?.toLowerCase(),
        category.name?.toLowerCase(),
        typeof category.photo === 'string' ? category.photo.toLowerCase() : '',
      ].some((field) => field?.includes(searchTerm.toLowerCase()))
    );
    console.log('Searched Categorys:', result);
    return result;
  }, [categorys, searchTerm]);

  // Calculate total items for pagination
  const getTotalItems = () => {
    if (selectedFilter === 'active') return stats.active || 0;
    if (selectedFilter === 'inactive') return stats.inactive || 0;
    return stats.total || 0;
  };
  const filteredTotalPages = Math.max(1, Math.ceil(getTotalItems() / itemsPerPage));

  // Stats for filter buttons
  const statFilters: StatFilter[] = useMemo(
    () => [
      { id: 'total', title: 'All Categories', value: stats.total || 0, trend: 'up', change: '2%', icon: null },
      { id: 'active', title: 'Active Categories', value: stats.active || 0, trend: 'up', change: '1%', icon: null },
      { id: 'inactive', title: 'Inactive Categories', value: stats.inactive || 0, trend: 'down', change: '1%', icon: null },
    ],
    [stats]
  );

  // Delete handler
  const handleDelete = async (category: Category) => {
    await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete category with name "${truncate(category.name, 40)}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log(`Deleting category with ID: ${category._id}`);
          await deleteCategory(category._id!);
          const updatedLength = searchedCategorys.length - 1;
          const newTotalItems = getTotalItems() - 1;
          const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

          if (updatedLength === 0 && currentPage > newTotalPages) {
            setCurrentPage(newTotalPages || 1);
          } else {
            await fetchCategorys(currentPage, itemsPerPage, selectedFilter);
          }

          await Swal.fire({
            title: 'Deleted!',
            text: 'The category has been removed.',
            icon: 'success',
            confirmButtonColor: 'var(--puprle-color)',
          });
        } catch (err) {
          console.error('Failed to delete category:', err);
          toast.error('Failed to delete category', { position: 'top-right', autoClose: 3000 });
        }
      }
    });
  };

  // Table columns
  const columns: ColumnConfig<Category>[] = useMemo(
    () => [
      { key: 'name', label: 'Name', render: (value) => truncate(value, 40) },
      { key: 'slug', label: 'Slug', render: (value) => truncate(value, 40) },

      { key: 'description', label: 'Description', render: (value) => truncate(value, 20) },
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
              imageUrl = `${ImportedURL.FILEURL}uploads/category/photo/${value}`; 
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
    ],
    []
  );

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <TableHeader
        managementName="Categories"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/category/add"
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          console.log(`Filter changed to: ${id}`);
          setSelectedFilter(id as 'total' | 'active' | 'inactive');
          setCurrentPage(1);
        }}
        module="category"
      />

      {loading ? (
        <BAZLoader />
      ) : searchedCategorys.length === 0 ? (
        <p>No categorys found for the selected filter.</p>
      ) : (
        <>
          <ManagementTable
            data={searchedCategorys}
            columns={columns}
            onEdit={(row) => {
              console.log(`Navigating to edit category with ID: ${row._id}`);
              navigate(`/categorys/edit/${row._id}`);
            }}
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
        </>
      )}
    </div>
  );
};

export default React.memo(CategoryListTemplate);