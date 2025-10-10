import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import TableHeader from '../../molecules/TableHeader';
import ManagementTable from '../../organisms/ManagementTable';
import BAZLoader from '../../atoms/BAZ-Loader';
import Pagination from '../../atoms/BAZ-Pagination';

import { useFaqStore } from '../../stores/FaqStore';
import type { ColumnConfig, Faq } from '../../types/common';
import { truncate } from '../../utils/helper';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../constants/pagination';

interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}

const FaqListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    faqs,
    fetchFaqs,
    deleteFaq,
    toggleStatusFaq,
    loading,
    error,
    stats,
  } = useFaqStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<'total' | 'active' | 'inactive'>('total');

  // Use default items per page from constants
  const itemsPerPage = DEFAULT_ITEMS_PER_PAGE;

  // Calculate total items for pagination based on selected filter
  const getTotalItems = () => {
    if (selectedFilter === 'active') return stats.active;
    if (selectedFilter === 'inactive') return stats.inactive;
    return stats.total;
  };
  const filteredTotalPages = Math.max(1, Math.ceil(getTotalItems() / itemsPerPage));

  // Fetch data on page or filter change
  useEffect(() => {
    const loadFaqs = async () => {
      try {
        await fetchFaqs(currentPage, itemsPerPage, selectedFilter);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
      }
    };
    loadFaqs();
  }, [currentPage, selectedFilter, itemsPerPage, fetchFaqs]);

  // Show error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Handle pagination
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  // Filter search term locally (after API filter is applied)
  const searchedFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats for filter buttons
  const statFilters: StatFilter[] = [
    {
      id: 'total',
      title: 'All FAQs',
      value: stats.total,
      trend: 'up',
      change: '2%',
      icon: null,
    },
    {
      id: 'active',
      title: 'Active FAQs',
      value: stats.active,
      trend: 'up',
      change: '1%',
      icon: null,
    },
    {
      id: 'inactive',
      title: 'Inactive FAQs',
      value: stats.inactive,
      trend: 'down',
      change: '1%',
      icon: null,
    },
  ];

  // Delete handler
  const handleDelete = (faq: Faq) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${faq.question}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteFaq(faq._id!);

        const updatedLength = searchedFaqs.length - 1;
        const newTotalItems = faqs.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        // Adjust current page if necessary
        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1); // Go to the last page or page 1 if no pages remain
        } else {
          await fetchFaqs(currentPage, itemsPerPage, selectedFilter);
        }

        Swal.fire('Deleted!', 'The FAQ has been removed.', 'success');
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
  ];

  if (loading) return <BAZLoader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Faq"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/faq/add"
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          setSelectedFilter(id as 'total' | 'active' | 'inactive');
          setCurrentPage(1);
        }}
        module="faq"
      />

      <ManagementTable
        data={searchedFaqs}
        columns={columns}
        onEdit={(row) => navigate(`/faq/edit/${row._id}`)}
        onToggleStatus={(row) => toggleStatusFaq(row._id!)}
        onDelete={handleDelete}
        currentPage={currentPage}
        limit={itemsPerPage}
        module="faq"

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

export default FaqListTemplate;