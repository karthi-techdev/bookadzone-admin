import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import ManagementTable from '../../organisms/ManagementTable';
import BAZLoader from '../../atoms/BAZ-Loader';
import Pagination from '../../atoms/BAZ-Pagination';
import { usePropertyStore } from '../../stores/PropertyStore';
import type { ColumnConfig, Property } from '../../types/common';
import { truncate } from '../../utils/helper';
import ImportedURL from '../../common/urls';

const PropertyListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    properties,
    fetchProperties,
    deleteProperty,
    toggleStatusProperty,
    totalPages,
    loading,
    error,
  } = usePropertyStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data when page changes or after operations
  useEffect(() => {
    const fetchData = async () => {
      await fetchProperties(currentPage, itemsPerPage);
    };
    fetchData();
  }, [currentPage, fetchProperties]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  // Filter search term locally (after API filter is applied)
  const searchedProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.bannerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.locationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnConfig<Property>[] = [
    {
  key: 'previewImage',
  label: 'Image',
  render: (_, row) => {
    // Use previewImage if it exists, else fallback to first image in the array
    const imageCandidate = row.previewImage || (row.images && row.images.length > 0 ? row.images[0] : '');
    
    // Ensure we only use strings for URLs
    const imageUrl = typeof imageCandidate === 'string' ? imageCandidate : '';

    if (imageUrl.trim() !== '') {
      const clean = imageUrl.replace(/^\//, '');
      return (
        <img
          src={`${ImportedURL.FILEURL.replace(/\/$/, '')}/${clean}`}
          alt="preview"
          style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
        />
      );
    }

    return '-';
  },
},
    { key: 'title', label: 'Title', render: (value) => truncate(value, 40) },
    { key: 'bannerCode', label: 'Banner Code', render: (value) => truncate(value, 20) },
    { key: 'locationName', label: 'Location', render: (value) => truncate(value, 40) },
    { key: 'city', label: 'City', render: (value) => truncate(value, 20) },
    // { key: 'propertyStatus', label: 'Property Status', render: (value) => value || 'pending' },
    { 
      key: 'pricingType', 
      label: 'Pricing Type', 
      render: (value, row) => {
        const min = row?.priceRange?.min;
        const max = row?.priceRange?.max;
        const range = (min !== undefined && max !== undefined && (min !== 0 || max !== 0))
          ? `${truncate(String(min), 10)} - ${truncate(String(max), 10)}`
          : '—';
        return `${value || '—'} (${range})`;
      }
    },
  ];

  // Delete handler with page adjustment
  const handleDelete = (property: Property) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${property.title}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteProperty(property._id!);
        const updatedLength = searchedProperties.length - 1;
        const newTotalItems = properties.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1);
        } else {
          await fetchProperties(currentPage, itemsPerPage);
        }
        Swal.fire('Deleted!', 'The property has been removed.', 'success');
      }
    });
  };

  if (loading) return <BAZLoader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="properties"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/properties/add"
        module="properties"
      />

      <ManagementTable
        data={searchedProperties}
        columns={columns}
        onEdit={(row) => navigate(`/properties/edit/${row._id}`)}
        onToggleStatus={(row) => toggleStatusProperty(row._id!)}
        onDelete={handleDelete}
        currentPage={currentPage}
        limit={itemsPerPage}
        module="properties"
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

export default PropertyListTemplate;
