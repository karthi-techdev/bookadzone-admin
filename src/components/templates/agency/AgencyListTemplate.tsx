import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import ManagementTable from '../../organisms/ManagementTable';
import BAZLoader from '../../atoms/BAZ-Loader';
import Pagination from '../../atoms/BAZ-Pagination';
import { useAgencyStore } from '../../stores/AgencyStore';
import type { ColumnConfig, Agency } from '../../types/common';
import { truncate } from '../../utils/helper';
import ImportedURL from '../../common/urls';

const AgencyListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    agencies,
    fetchAgencies,
    deleteAgency,
    toggleStatusAgency,
    totalPages,
    loading,
    error,
    // stats, // If you add stats to AgencyStore, you can use for statFilters
  } = useAgencyStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // If you add stats, you can use statFilters like FAQ
  // const statFilters: StatFilter[] = [ ... ];

  // Fetch data when page changes or after operations
  useEffect(() => {
    const fetchData = async () => {
      await fetchAgencies(currentPage, itemsPerPage);
    };
    fetchData();
  }, [currentPage, fetchAgencies]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  // Filter search term locally (after API filter is applied)
  const searchedAgencies = agencies.filter((agency) =>
    agency.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnConfig<Agency>[] = [
    {
      key: 'agencyLogo',
      label: 'Logo',
      render: (value) => {
        if (typeof value === 'string' && value.trim() !== '') {
          // Remove leading slash if present to avoid double slash in URL
          const imgPath = value.startsWith('/') ? value.slice(1) : value;
          return (
            <img
              src={`${ImportedURL.FILEURL}${imgPath}`}
              alt="logo"
              style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
            />
          );
        }
        return '-';
      },
    },
    { key: 'agencyName', label: 'Agency Name', render: (value) => truncate(value, 40) },
    { key: 'name', label: 'Contact Name', render: (value) => truncate(value, 40) },
    { key: 'companyPhone', label: 'Company Phone', render: (value) => truncate(value, 40) },
  ];

  // Delete handler with page adjustment
  const handleDelete = (agency: Agency) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${agency.agencyName}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteAgency(agency._id!);
        const updatedLength = searchedAgencies.length - 1;
        const newTotalItems = agencies.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1);
        } else {
          await fetchAgencies(currentPage, itemsPerPage);
        }
        Swal.fire('Deleted!', 'The agency has been removed.', 'success');
      }
    });
  };

  if (loading) return <BAZLoader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Agency"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/agency/add"
        // statFilters={statFilters} // Uncomment if you add stats
        // selectedFilterId={selectedFilter} // Uncomment if you add stats
        // onSelectFilter={...} // Uncomment if you add stats
        module="agency"
      />

      <ManagementTable
        data={searchedAgencies}
        columns={columns}
        onEdit={(row) => navigate(`/agency/edit/${row._id}`)}
        onView={(row) => navigate(`/agency/view/${row._id}`)}
        onToggleStatus={(row) => toggleStatusAgency(row._id!)}
        onDelete={handleDelete}
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

export default AgencyListTemplate;
