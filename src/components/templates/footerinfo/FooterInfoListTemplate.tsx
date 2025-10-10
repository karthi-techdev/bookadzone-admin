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

const FooterListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { footers, fetchFooters, deleteFooter, totalPages, loading, error } = useFooterStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data when page changes or after operations
  useEffect(() => {
    const fetchData = async () => {
      await fetchFooters(currentPage, itemsPerPage);
    };
    fetchData();
  }, [currentPage, fetchFooters, itemsPerPage]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  // Search implementation
  const searchedFooters = useMemo(() => footers.filter((footer) =>
    footer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (footer.socialmedia?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ), [footers, searchTerm]);

  // Table columns configuration
  const columns: ColumnConfig<FooterInfo>[] = [
    
    {
      key: 'logo',
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
    { key: 'description', label: 'Description', render: (value: string) => truncate(value, 40) },
  ];

  // Delete handler
  const handleDelete = (footer: FooterInfo) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${truncate(footer.description, 40)}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteFooter(footer._id!);
          const updatedLength = searchedFooters.length - 1;
          const newTotalPages = Math.ceil(updatedLength / itemsPerPage);
          if (updatedLength === 0 && currentPage > newTotalPages) {
            setCurrentPage(newTotalPages || 1);
          } else {
            await fetchFooters(currentPage, itemsPerPage);
          }
          await Swal.fire('Deleted!', 'The footer has been removed.', 'success');
        } catch (error) {
          console.error('Error deleting footer:', error);
          toast.error('Failed to delete footer');
        }
      }
    });
  };

  if (loading) return <BAZLoader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Footer"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/footerinfo/add"
        module="footer"
      />
      <ToastContainer position="top-right" autoClose={3000} />

      <ManagementTable
        data={searchedFooters}
        columns={columns}
        onEdit={(row) => navigate(`/footerinfo/edit/${row._id}`)}
        onDelete={handleDelete}
        currentPage={currentPage}
        limit={itemsPerPage}
        module="footer"
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

export default FooterListTemplate;