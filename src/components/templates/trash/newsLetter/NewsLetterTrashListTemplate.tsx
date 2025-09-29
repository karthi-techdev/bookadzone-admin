import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../../molecules/TableHeader';
import { FiRefreshCw } from 'react-icons/fi';
import ManagementTable from '../../../organisms/ManagementTable';
import Loader from '../../../atoms/BAZ-Loader';
import BAZPagination from '../../../atoms/BAZ-Pagination';
import { useNewsLetterStore } from '../../../stores/NewsLetterStore';
import type { ColumnConfig, NewsLetter } from '../../../types/common';
import { truncate } from '../../../utils/helper'
interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}

const NewsLetterTrashListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    newsLetters,
    fetchTrashNewsLetters,
    totalPages,
    loading,
    error,
    stats,
    restoreNewsLetter,
    deleteNewsLetterPermanently,
  } = useNewsLetterStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<'total' | 'active' | 'inactive'>('total');
  const itemsPerPage = 3;

  // Calculate total items for pagination based on selected filter
  const getTotalItems = () => {
    if (selectedFilter === 'active') return stats.active;
    if (selectedFilter === 'inactive') return stats.inactive;
    return stats.total;
  };
  const filteredTotalPages = Math.max(1, Math.ceil(getTotalItems() / itemsPerPage));

  // Fetch data on page or filter change
  useEffect(() => {
    fetchTrashNewsLetters(currentPage, itemsPerPage, selectedFilter);
  }, [currentPage, selectedFilter, itemsPerPage, selectedFilter]);

  // Show error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Handle pagination
  const handlePageChange = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
    fetchTrashNewsLetters(newPage, itemsPerPage, selectedFilter); // Fetch NEWSLETTERs on page change
  };

  // Filter search term locally (after API filter is applied)
  const searchedNewsLetters = newsLetters.filter((newsletter) =>
    newsletter.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  // ||
  //   newsletter.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats for filter buttons
  const statFilters: StatFilter[] = [
    {
      id: 'total',
      title: 'All NewsLetters',
      value: stats.total,
      trend: 'up',
      change: '2%',
      icon: null,
    },
    {
      id: 'active',
      title: 'Active NewsLetters',
      value: stats.active,
      trend: 'up',
      change: '1%',
      icon: null,
    },
    {
      id: 'inactive',
      title: 'Inactive NewsLetters',
      value: stats.inactive,
      trend: 'down',
      change: '1%',
      icon: null,
    },
  ];

  // Restore handler
  const handleRestore = (newsletter: NewsLetter) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to restore "${newsletter.name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, restore it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await restoreNewsLetter(newsletter._id!);

        const updatedLength = searchedNewsLetters.length - 1;
        const newTotalItems = newsLetters.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        // Adjust current page if necessary
        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1); // Go to the last page or page 1 if no pages remain
        } else {
          await fetchTrashNewsLetters(currentPage, itemsPerPage, selectedFilter);
        }

        Swal.fire('Restored!', 'The NewsLetter has been restored.', 'success');
      }
    });
  };

  // Permanent delete handler
  const handlePermanentDelete = (newsletter: NewsLetter) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to permanently delete "${newsletter.name}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, delete it permanently!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteNewsLetterPermanently(newsletter._id!);

        const updatedLength = searchedNewsLetters.length - 1;
        const newTotalItems = newsLetters.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        // Adjust current page if necessary
        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1); // Go to the last page or page 1 if no pages remain
        } else {
          await fetchTrashNewsLetters(currentPage, itemsPerPage, selectedFilter);
        }

        Swal.fire('Deleted!', 'The NewsLetter has been permanently deleted.', 'success');
      }
    });
  };

  const columns: ColumnConfig<NewsLetter>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (value) => truncate(value, 40),
    },
    {
      key: 'slug',
      label: 'Slug',
      render: (value) => truncate(value, 40),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => truncate(value, 40),
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="NewsLetter"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          setSelectedFilter(id as 'total' | 'active' | 'inactive');
          setCurrentPage(1);
        }}
        module="newsletter"
        isTrashView={true}
      />

      <ManagementTable
        data={searchedNewsLetters}
        columns={columns}
        // For trash view: only show restore and permanent delete
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        currentPage={currentPage}
        limit={itemsPerPage}
        module="newsletter"
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
    </div>
  );
};

export default NewsLetterTrashListTemplate;