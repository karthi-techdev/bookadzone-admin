import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import TableHeader from '../../molecules/TableHeader';
import ManagementTable from '../../organisms/ManagementTable';
import BAZLoader from '../../atoms/BAZ-Loader';
import Pagination from '../../atoms/BAZ-Pagination';

import { useNewsLetterStore } from '../../stores/NewsLetterStore';
import type { ColumnConfig, NewsLetter } from '../../types/common';
import { truncate } from '../../utils/helper'

interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}

const NewsLetterListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    newsLetters,
    fetchNewsLetters,
    deleteNewsLetter,
    toggleStatusNewsLetter,
    totalPages,
    loading,
    error,
    stats,
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
    fetchNewsLetters(currentPage, itemsPerPage, selectedFilter);
  }, [currentPage, selectedFilter]);

  // Show error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Handle pagination
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  // Filter search term locally (after API filter is applied)
  const searchedNewsLetters = newsLetters.filter((newsletters) =>
    newsletters.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  // ||
  //   newsletter.slug.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Delete handler
  const handleDelete = (newsLetter: NewsLetter) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${newsLetter.name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteNewsLetter(newsLetter._id!);

        const updatedLength = searchedNewsLetters.length - 1;
        const newTotalItems = newsLetters.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        // Adjust current page if necessary
        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1); // Go to the last page or page 1 if no pages remain
        } else {
          await fetchNewsLetters(currentPage, itemsPerPage, selectedFilter);
        }

        Swal.fire('Deleted!', 'The NewsLetter has been removed.', 'success');
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
  ];

  if (loading) return <BAZLoader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="NewsLetter"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/newsletter/add"
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          setSelectedFilter(id as 'total' | 'active' | 'inactive');
          setCurrentPage(1);
        }}
        module="newsLetter"
      />

      <ManagementTable
        data={searchedNewsLetters}
        columns={columns}
        onEdit={(row) => navigate(`/newsletter/edit/${row._id}`)}
        onToggleStatus={(row) => toggleStatusNewsLetter(row._id!)}
        onDelete={handleDelete}
        currentPage={currentPage}
        limit={itemsPerPage}
        module="newsLetter"

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
    </div>
  );
};

export default NewsLetterListTemplate;