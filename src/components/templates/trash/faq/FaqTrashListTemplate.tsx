// Updated FaqTrashListTemplate.tsx with fixed props, defined handlers, and removed unnecessary actions

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import TableHeader from '../../../molecules/TableHeader';
import { FiRefreshCw } from 'react-icons/fi';
import ManagementTable from '../../../organisms/ManagementTable';
import Loader from '../../../atoms/BAZ-Loader';
import BAZPagination from '../../../atoms/BAZ-Pagination';

import { useFaqStore } from '../../../stores/FaqStore';
import type { ColumnConfig, Faq } from '../../../types/common';
import { truncate } from '../../../utils/helper'

// Remove unused interface

const FaqTrashListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    faqs,
    fetchTrashFaqs,
    totalPages,
    loading,
    error,
    stats,
    restoreFaq,
    deleteFaqPermanently,
  } = useFaqStore();

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
    const loadTrashFaqs = async () => {
      try {
        await fetchTrashFaqs(currentPage, itemsPerPage, selectedFilter);
      } catch (err) {
        console.error('Error fetching trash FAQs:', err);
      }
    };
    loadTrashFaqs();
  }, [currentPage, selectedFilter, itemsPerPage, fetchTrashFaqs]);

  // Show error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Handle pagination
  const handlePageChange = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
    fetchTrashFaqs(newPage, itemsPerPage, selectedFilter); // Fetch FAQs on page change
  };

  // Filter search term locally (after API filter is applied)
  const searchedFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Remove unused statFilters

  // Restore handler
  const handleRestore = (faq: Faq) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to restore "${faq.question}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, restore it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await restoreFaq(faq._id!);

        const updatedLength = searchedFaqs.length - 1;
        const newTotalItems = faqs.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        // Adjust current page if necessary
        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1); // Go to the last page or page 1 if no pages remain
        } else {
          await fetchTrashFaqs(currentPage, itemsPerPage, selectedFilter);
        }

        Swal.fire('Restored!', 'The FAQ has been restored.', 'success');
      }
    });
  };

  // Permanent delete handler
  const handlePermanentDelete = (faq: Faq) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to permanently delete "${faq.question}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, delete it permanently!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteFaqPermanently(faq._id!);

        const updatedLength = searchedFaqs.length - 1;
        const newTotalItems = faqs.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        // Adjust current page if necessary
        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1); // Go to the last page or page 1 if no pages remain
        } else {
          await fetchTrashFaqs(currentPage, itemsPerPage, selectedFilter);
        }

        Swal.fire('Deleted!', 'The FAQ has been permanently deleted.', 'success');
      }
    });
  };

  const columns: ColumnConfig<Faq>[] = [
    {
      key: 'question',
      label: 'Question',
      render: (value) => truncate(value, 40),
    },
    {
      key: 'answer',
      label: 'Answer',
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
        managementName="Faq"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Back to List"
        addButtonLink="/faq"
        module="faq"
        isTrashView={true}
      />

      <ManagementTable
        data={searchedFaqs}
        columns={columns}
        // For trash view: only show restore and permanent delete
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        currentPage={currentPage}
        limit={itemsPerPage}
        module="faq"
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

export default FaqTrashListTemplate;