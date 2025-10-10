import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import TableHeader from '../../../molecules/TableHeader';
import ManagementTable from '../../../organisms/ManagementTable';
import BAZLoader from '../../../atoms/BAZ-Loader';
import BAZPagination from '../../../atoms/BAZ-Pagination';
import { useFooterStore } from '../../../stores/FooterInfoStore';
import type { ColumnConfig, FooterInfo } from '../../../types/common';
import { truncate } from '../../../utils/helper';
import ImportedURL from '../../../common/urls';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../../constants/pagination';

interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}

const FooterInfoTrashListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    footers,
    fetchTrashFooters,
    restoreFooterInfo,
    deleteFooterInfoPermanently,
    loading,
    error,
    stats,
  } = useFooterStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<'total' | 'active' | 'inactive'>('total');
  const itemsPerPage = DEFAULT_ITEMS_PER_PAGE;

  // Debug footers state
  useEffect(() => {
    console.log('Trash Footers State:', footers, 'Is Array:', Array.isArray(footers));
  }, [footers]);

  // Fetch data
  useEffect(() => {
    console.log('Fetching trash footers with params:', { currentPage, itemsPerPage, selectedFilter });
    fetchTrashFooters(currentPage, itemsPerPage, selectedFilter);
  }, [fetchTrashFooters, currentPage, selectedFilter, itemsPerPage]);

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
  const searchedFooterInfos = useMemo(() => {
    if (!Array.isArray(footers)) {
      console.warn('Trash Footers is not an array:', footers);
      return [];
    }
    const result = footers.filter((footer) =>
      [
        footer.description?.toLowerCase(),
        footer.socialmedia?.toLowerCase(),
        typeof footer.logo === 'string' ? footer.logo.toLowerCase() : '',
      ].some((field) => field?.includes(searchTerm.toLowerCase()))
    );
    console.log('Searched Trash Footers:', result);
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
      { id: 'total', title: 'All Footer Infos', value: stats.total || 0, trend: 'up', change: '2%', icon: null },
      { id: 'active', title: 'Active Footer Infos', value: stats.active || 0, trend: 'up', change: '1%', icon: null },
      { id: 'inactive', title: 'Inactive Footer Infos', value: stats.inactive || 0, trend: 'down', change: '1%', icon: null },
    ],
    [stats]
  );

  // Restore handler
  const handleRestore = async (footerInfo: FooterInfo) => {
    await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to restore the footer info: "${truncate(footerInfo.description, 40)}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, restore it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log(`Restoring footer with ID: ${footerInfo._id}`);
          await restoreFooterInfo(footerInfo._id!);
          const updatedLength = searchedFooterInfos.length - 1;
          const newTotalItems = getTotalItems() - 1;
          const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

          if (updatedLength === 0 && currentPage > newTotalPages) {
            setCurrentPage(newTotalPages || 1);
          } else {
            await fetchTrashFooters(currentPage, itemsPerPage, selectedFilter);
          }

          await Swal.fire({
            title: 'Restored!',
            text: 'The footer info has been restored.',
            icon: 'success',
            confirmButtonColor: 'var(--puprle-color)',
          });
        } catch (err) {
          console.error('Failed to restore footer:', err);
          toast.error('Failed to restore footer', { position: 'top-right', autoClose: 3000 });
        }
      }
    });
  };

  // Permanent delete handler
  const handlePermanentDelete = async (footerInfo: FooterInfo) => {
    await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to permanently delete the footer info: "${truncate(footerInfo.description, 40)}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, delete it permanently!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log(`Permanently deleting footer with ID: ${footerInfo._id}`);
          await deleteFooterInfoPermanently(footerInfo._id!);
          const updatedLength = searchedFooterInfos.length - 1;
          const newTotalItems = getTotalItems() - 1;
          const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

          if (updatedLength === 0 && currentPage > newTotalPages) {
            setCurrentPage(newTotalPages || 1);
          } else {
            await fetchTrashFooters(currentPage, itemsPerPage, selectedFilter);
          }

          await Swal.fire({
            title: 'Deleted!',
            text: 'The footer info has been permanently deleted.',
            icon: 'success',
            confirmButtonColor: 'var(--puprle-color)',
          });
        } catch (err) {
          console.error('Failed to permanently delete footer:', err);
          toast.error('Failed to permanently delete footer', { position: 'top-right', autoClose: 3000 });
        }
      }
    });
  };

  // Table columns
  const columns: ColumnConfig<FooterInfo>[] = useMemo(
    () => [
      {
        key: 'description',
        label: 'Description',
        render: (value) => truncate(value, 40),
      },
      {
        key: 'socialmedia',
        label: 'Social Media',
        render: (value) => truncate(value, 40),
      },
      {
        key: 'logo',
        label: 'Logo',
        render: (value) => {
          if (typeof value === 'string' && value) {
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
                  e.currentTarget.src = '/placeholder-image.png';
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
        managementName="Footer Info"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Back to List"
        addButtonLink="/footerinfo"
        module="footerinfo"
        isTrashView={true}
      />

      {loading ? (
        <BAZLoader />
      ) : (
        <>
          <ManagementTable
            data={searchedFooterInfos}
            columns={columns}
            onRestore={handleRestore}
            onPermanentDelete={handlePermanentDelete}
            currentPage={currentPage}
            limit={itemsPerPage}
            module="footerinfo"
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
        </>
      )}
    </div>
  );
};

export default React.memo(FooterInfoTrashListTemplate);