import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import TableHeader from '../../molecules/TableHeader';
import ManagementTable from '../../organisms/ManagementTable';
import BAZLoader from '../../atoms/BAZ-Loader';
import Pagination from '../../atoms/BAZ-Pagination';
import { useFooterStore } from '../../stores/FooterInfoStore';
import type { ColumnConfig, FooterInfo } from '../../types/common';
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

const FooterListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { footers, fetchFooters, deleteFooter, loading, error, stats } = useFooterStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<'total' | 'active' | 'inactive'>('total');
  const itemsPerPage = 3;

  // Debug footers state
  useEffect(() => {
    console.log('Footers State:', footers, 'Is Array:', Array.isArray(footers));
  }, [footers]);

  // Fetch data
  useEffect(() => {
    console.log('Fetching footers with params:', { currentPage, itemsPerPage, selectedFilter });
    fetchFooters(currentPage, itemsPerPage, selectedFilter);
  }, [fetchFooters, currentPage, selectedFilter, itemsPerPage]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.log('Error from FooterStore:', error);
      toast.error(error, { position: 'top-right', autoClose: 3000 });
    }
  }, [error]);

  // Handle pagination
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  // Filter search term
  const searchedFooters = useMemo(() => {
    if (!Array.isArray(footers)) {
      console.warn('Footers is not an array:', footers);
      return [];
    }
    const result = footers.filter((footer) =>
      [
        footer.description?.toLowerCase(),
        footer.socialmedia?.toLowerCase(),
        typeof footer.logo === 'string' ? footer.logo.toLowerCase() : '',
      ].some((field) => field?.includes(searchTerm.toLowerCase()))
    );
    console.log('Searched Footers:', result);
    return result;
  }, [footers, searchTerm]);

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
      { id: 'total', title: 'All Footers', value: stats.total || 0, trend: 'up', change: '2%', icon: null },
      { id: 'active', title: 'Active Footers', value: stats.active || 0, trend: 'up', change: '1%', icon: null },
      { id: 'inactive', title: 'Inactive Footers', value: stats.inactive || 0, trend: 'down', change: '1%', icon: null },
    ],
    [stats]
  );

  // Delete handler
  const handleDelete = async (footer: FooterInfo) => {
    await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete footer with description "${truncate(footer.description, 40)}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log(`Deleting footer with ID: ${footer._id}`);
          await deleteFooter(footer._id!);
          const updatedLength = searchedFooters.length - 1;
          const newTotalItems = getTotalItems() - 1;
          const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

          if (updatedLength === 0 && currentPage > newTotalPages) {
            setCurrentPage(newTotalPages || 1);
          } else {
            await fetchFooters(currentPage, itemsPerPage, selectedFilter);
          }

          await Swal.fire({
            title: 'Deleted!',
            text: 'The footer has been removed.',
            icon: 'success',
            confirmButtonColor: 'var(--puprle-color)',
          });
        } catch (err) {
          console.error('Failed to delete footer:', err);
          toast.error('Failed to delete footer', { position: 'top-right', autoClose: 3000 });
        }
      }
    });
  };

  // Table columns
  const columns: ColumnConfig<FooterInfo>[] = useMemo(
    () => [
      { key: 'description', label: 'Description', render: (value) => truncate(value, 40) },
      {
        key: 'logo',
        label: 'Logo',
        render: (value) => {
          if (typeof value === 'string' && value) {
            // Check if logo is a base64 string
            const isBase64 = value.startsWith('data:image/');
            const imageUrl = isBase64 ? value : `${ImportedURL.FILEURL}Uploads/${value}`;
            console.log(`Rendering logo image: ${isBase64 ? 'base64' : 'URL'} - ${imageUrl.substring(0, 50)}...`);
            return (
              <img
                src={imageUrl}
                alt="Footer Logo"
                className="h-12 w-12 object-contain rounded-full border"
                onError={(e) => {
                  console.error(`Failed to load logo image: ${imageUrl}`, e);
                  e.currentTarget.src = '/placeholder-image.png'; // Fallback image
                }}
                onLoad={() => console.log(`Successfully loaded logo image: ${imageUrl}`)}
              />
            );
          }
          console.warn(`No valid logo value for rendering: ${value}`);
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
        managementName="Footer"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/footerinfo/add"
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          console.log(`Filter changed to: ${id}`);
          setSelectedFilter(id as 'total' | 'active' | 'inactive');
          setCurrentPage(1);
        }}
        module="footer"
      />

      {loading ? (
        <BAZLoader />
      ) : searchedFooters.length === 0 ? (
        <p>No footers found for the selected filter.</p>
      ) : (
        <>
          <ManagementTable
            data={searchedFooters}
            columns={columns}
            onEdit={(row) => {
              console.log(`Navigating to edit footer with ID: ${row._id}`);
              navigate(`/footerinfo/edit/${row._id}`);
            }}
            onDelete={handleDelete}
            currentPage={currentPage}
            limit={itemsPerPage}
            module="footer"
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

export default React.memo(FooterListTemplate);