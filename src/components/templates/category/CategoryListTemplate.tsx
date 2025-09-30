// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import { toast } from 'react-toastify';

// import TableHeader from '../../molecules/TableHeader';
// import ManagementTable from '../../organisms/ManagementTable';
// import BAZLoader from '../../atoms/BAZ-Loader';
// import Pagination from '../../atoms/BAZ-Pagination';

// import { useCategoryStore } from '../../stores/categoryStore';
// import type { ColumnConfig, Category } from '../../types/common';
// import { truncate } from '../../utils/helper'
// import ImportedURL from '../../common/urls';


// interface StatFilter {
//   id: string;
//   title: string;
//   value: number;
//   trend: 'up' | 'down';
//   change: string;
//   icon: React.ReactNode;
// }



// const CategoryListTemplate: React.FC = () => {
//   const navigate = useNavigate();
//   const {
//     category,
//     fetchCategorys,
//     deleteCategory,
//     toggleStatusCategory,
//     totalPages,
//     loading,
//     error,
//     stats,
//   } = useCategoryStore();

// console.log(category,"category");

//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedFilter, setSelectedFilter] = useState<'total' | 'active' | 'inactive'>('total');
//   const itemsPerPage = 3;

//   // Calculate total items for pagination based on selected filter
//   const getTotalItems = () => {
//     if (selectedFilter === 'active') return stats.active;
//     if (selectedFilter === 'inactive') return stats.inactive;
//     return stats.total;
//   };
//   const filteredTotalPages = Math.max(1, Math.ceil(getTotalItems() / itemsPerPage));

//   // Fetch data on page or filter change
//   useEffect(() => {
//     fetchCategorys(currentPage, itemsPerPage, selectedFilter);
//   }, [currentPage, selectedFilter]);

//   // Show error toast
//   useEffect(() => {
//     if (error) toast.error(error);
//   }, [error]);

//   // Handle pagination
//   const handlePageChange = (selectedItem: { selected: number }) => {
//     setCurrentPage(selectedItem.selected + 1);
//   };

//   // Filter search term locally (after API filter is applied)
//   const searchedCategorys = category.filter((category) =>
//     category.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
//     category.slug?.toLowerCase().includes(searchTerm?.toLowerCase())
//   );

//   // Stats for filter buttons
//   const statFilters: StatFilter[] = [
//     {
//       id: 'total',
//       title: 'All Categorys',
//       value: stats.total,
//       trend: 'up',
//       change: '2%',
//       icon: null,
//     },
//     {
//       id: 'active',
//       title: 'Active Categorys',
//       value: stats.active,
//       trend: 'up',
//       change: '1%',
//       icon: null,
//     },
//     {
//       id: 'inactive',
//       title: 'Inactive Categorys',
//       value: stats.inactive,
//       trend: 'down',
//       change: '1%',
//       icon: null,
//     },
//   ];

//   // Delete handler
//   const handleDelete = (category: Category) => {
//     Swal.fire({
//       title: 'Are you sure?',
//       text: `You are about to delete "${category.name}"`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: 'var(--puprle-color)',
//       cancelButtonColor: 'var(--light-blur-grey-color)',
//       confirmButtonText: 'Yes, delete it!',
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         await deleteCategory(category._id!);

//         const updatedLength = searchedCategorys.length - 1;
//         const newTotalItems = category.length - 1;
//         const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

//         // Adjust current page if necessary
//         if (updatedLength === 0 && currentPage > newTotalPages) {
//           setCurrentPage(newTotalPages || 1); // Go to the last page or page 1 if no pages remain
//         } else {
//           await fetchCategorys(currentPage, itemsPerPage, selectedFilter);
//         }

//         Swal.fire('Deleted!', 'The Category has been removed.', 'success');
//       }
//     });
//   };

//   const columns: ColumnConfig<Category>[] = [
//     {
//       key: 'name',
//       label: ' Name',
//       render: (value) => truncate(value, 40),
//     },
//     {
//       key: 'slug',
//       label: 'Slug',
//       render: (value) => truncate(value, 40),
//     },
//     {
//       key: 'photo',
//       label: 'Image',
//       render: (value) =>
//         value ? (
//           <img
//             src={`${ImportedURL.FILEURL}${value}`}
//             alt="Category"
//             className="w-10 h-10 object-cover rounded-full border"
//           />
//         ) : (
//           <span className="text-gray-400 text-xs">No image</span>
//         ),
//     },
//     {
//       key: 'description',
//       label: 'Description',
//       render: (value) => truncate(value, 40),
//     },
//   ];

//   if (loading) return <BAZLoader />;

//   return (
//     <div className="p-6">
//       <TableHeader
//         managementName="Category"
//         searchTerm={searchTerm}
//         onSearchChange={setSearchTerm}
//         addButtonLabel="Add"
//         addButtonLink="/category/add"
//         statFilters={statFilters}
//         selectedFilterId={selectedFilter}
//         onSelectFilter={(id) => {
//           setSelectedFilter(id as 'total' | 'active' | 'inactive');
//           setCurrentPage(1);
//         }}
//         module="category"
//       />

//       <ManagementTable
//         data={searchedCategorys}
//         columns={columns}
//         onEdit={(row) => navigate(`/categorys/edit/${row._id}`)}
//         onToggleStatus={(row) => toggleStatusCategory(row._id!)}
//         onDelete={handleDelete}
//         currentPage={currentPage}
//         limit={itemsPerPage}
//         module="category"

//       />

//       {filteredTotalPages > 1 && (
//         <div className="flex justify-center mt-6">
//           <Pagination
//             pageCount={filteredTotalPages}
//             currentPage={currentPage}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategoryListTemplate;


import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import TableHeader from '../../molecules/TableHeader';
import ManagementTable from '../../organisms/ManagementTable';
import BAZLoader from '../../atoms/BAZ-Loader';
import Pagination from '../../atoms/BAZ-Pagination';
// import { useFooterStore } from '../../stores/FooterInfoStore';
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
    ],
    []
  );

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <TableHeader
        managementName="Category"
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