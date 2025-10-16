import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../../molecules/TableHeader';
import ManagementTable from '../../../organisms/ManagementTable';
import BAZLoader from '../../../atoms/BAZ-Loader';
import Pagination from '../../../atoms/BAZ-Pagination';
import { useAgencyStore } from '../../../stores/AgencyStore';
import type { ColumnConfig, Agency } from '../../../types/common';
import { truncate } from '../../../utils/helper';
import ImportedURL from '../../../common/urls';

const AgencyTrashListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    agencies,
    fetchTrashAgencies,
    restoreAgency,
    deleteAgencyPermanently,
    totalPages,
    loading,
    error,
    // stats, // If you add stats to AgencyStore, you can use for statFilters
  } = useAgencyStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data when page changes or after operations
  useEffect(() => {
    const fetchData = async () => {
      await fetchTrashAgencies(currentPage, itemsPerPage);
    };
    fetchData();
  }, [currentPage, fetchTrashAgencies]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = async (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
    // Ensure fresh data on page change
    await fetchTrashAgencies(newPage, itemsPerPage);
  };

  // Filter search term locally (after API filter is applied)
  const searchedAgencies = agencies.filter((agency) =>
    agency.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnConfig<Agency>[] = [
    { key: 'agencyName', label: 'Agency Name', render: (value) => truncate(value, 40) },
    { key: 'name', label: 'Contact Name', render: (value) => truncate(value, 40) },
    { key: 'yourPhone', label: 'Phone', render: (value) => truncate(value, 40) },
    {
      key: 'status',
      label: 'Status',
      render: (value) => value === 'active' ? 'Active' : 'Inactive',
    },
  ];

  // Restore handler with immediate refresh
  const handleRestore = (agency: Agency) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to restore "${agency.agencyName}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, restore it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await restoreAgency(agency._id!);
          // Recalculate current page based on remaining items
          const remainingItems = searchedAgencies.length - 1;
          const newPage = Math.max(1, remainingItems === 0 ? currentPage - 1 : currentPage);
          setCurrentPage(newPage);
          // Force an immediate refresh of the data with the new page
          await fetchTrashAgencies(newPage, itemsPerPage);
          Swal.fire('Restored!', 'The agency has been restored.', 'success');
        } catch (error) {
          toast.error('Failed to restore agency');
        }
      }
    });
  };

  // Permanent delete handler with immediate refresh
  const handlePermanentDelete = (agency: Agency) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to permanently delete "${agency.agencyName}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, delete it permanently!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAgencyPermanently(agency._id!);
          // Recalculate current page based on remaining items
          const remainingItems = searchedAgencies.length - 1;
          const newPage = Math.max(1, remainingItems === 0 ? currentPage - 1 : currentPage);
          setCurrentPage(newPage);
          // Force an immediate refresh of the data with the new page
          await fetchTrashAgencies(newPage, itemsPerPage);
          Swal.fire('Deleted!', 'The agency has been permanently deleted.', 'success');
        } catch (error) {
          toast.error('Failed to permanently delete agency');
        }
      }
    });
  };

  if (loading) return <BAZLoader />;

  // Debug: log the data being passed to the table
  console.log('agencies:', agencies);
  console.log('searchedAgencies:', searchedAgencies);

  return (
    <div className="p-6">
      <TableHeader
        managementName="Deleted Agencies"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Back to List"
        addButtonLink="/agency"
        module="agency"
      />
      <ManagementTable
        data={searchedAgencies.length ? searchedAgencies : agencies}
        columns={columns}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        currentPage={currentPage}
        limit={itemsPerPage}
        module="agency"
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

export default AgencyTrashListTemplate;
