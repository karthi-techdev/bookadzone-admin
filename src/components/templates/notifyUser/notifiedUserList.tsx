// components/templates/NotifiedUserListTemplate.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import TableHeader from '../../molecules/TableHeader';
import ManagementTable from '../../organisms/ManagementTable';
import BAZLoader from '../../atoms/BAZ-Loader';
import Pagination from '../../atoms/BAZ-Pagination';
import type { NotifiedUser } from '../../types/common';


import { NotifiedUserStore } from '../../stores/notifyUserStore';
import { truncate } from '../../utils/helper';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../constants/pagination';

/* -------------------------------------------------------------------------- */
/*                     Types that belong only to this page                   */
/* -------------------------------------------------------------------------- */



interface ColumnConfig<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode | null;
}

/* -------------------------------------------------------------------------- */
/*                               Component                                   */
/* -------------------------------------------------------------------------- */

const NotifiedUserListTemplate: React.FC = () => {
  const navigate = useNavigate();

  const {
    users,                // <-- array of NotifiedUser
    fetchUsers,
    deleteUser,
    totalPages,
    loading,
    error,
    stats,
  } = NotifiedUserStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] =
    useState<'total' | 'active' | 'inactive'>('total');

  const itemsPerPage = DEFAULT_ITEMS_PER_PAGE;

  /* ---------- pagination helpers ---------- */
  const getTotalItems = () => {
    if (selectedFilter === 'active') return stats.active;
    if (selectedFilter === 'inactive') return stats.inactive;
    return stats.total;
  };
  const filteredTotalPages = Math.max(1, Math.ceil(getTotalItems() / itemsPerPage));

  /* ---------- fetch on page / filter change ---------- */
  useEffect(() => {
    fetchUsers(currentPage, itemsPerPage, selectedFilter);
  }, [currentPage, selectedFilter, fetchUsers]);

  /* ---------- error toast ---------- */
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  /* ---------- client‑side search (safe) ---------- */
  const searchedUsers = users.filter((u): u is NotifiedUser => {
    const hasName = typeof u.fullName === 'string';
    const hasEmail = typeof u.email === 'string';

    if (!hasName && !hasEmail) return false;

    const term = searchTerm.toLowerCase();
    return (
      (hasName && u.fullName.toLowerCase().includes(term)) ||
      (hasEmail && u.email.toLowerCase().includes(term))
    );
  });

  /* ---------- filter buttons stats ---------- */
  const statFilters: StatFilter[] = [
    {
      id: 'total',
      title: 'All Users',
      value: stats.total,
      trend: 'up',
      change: '2%',
      icon: null,
    },
    {
      id: 'active',
      title: 'Active',
      value: stats.active,
      trend: 'up',
      change: '1%',
      icon: null,
    },
    {
      id: 'inactive',
      title: 'Inactive',
      value: stats.inactive,
      trend: 'down',
      change: '1%',
      icon: null,
    },
  ];

  /* ---------- delete handler ---------- */
  const handleDelete = (user: NotifiedUser) => {
    Swal.fire({
      title: 'Delete User?',
      text: `Remove "${user.fullName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteUser(user._id!);

        // go to previous page if the last row on the current page was removed
        if (searchedUsers.length === 1 && currentPage > 1) {
          setCurrentPage((p) => p - 1);
        } else {
          fetchUsers(currentPage, itemsPerPage, selectedFilter);
        }

        Swal.fire('Deleted!', 'User removed.', 'success');
      }
    });
  };

  /* ---------- table columns ---------- */
  const columns: ColumnConfig<NotifiedUser>[] = [
    {
      key: 'fullName',
      label: 'Name',
      render: (v) => truncate(v, 30),
    },
    {
      key: 'email',
      label: 'Email',
      render: (v) => truncate(v, 35),
    },
    {
      key: 'companyName',
      label: 'Company',
      render: (v) => v || '-',
    },
    { key: 'profileType', label: 'Type' },
  ];

  /* ---------- render ---------- */
  if (loading) return <BAZLoader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Notified User"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}       
       
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          setSelectedFilter(id as any);
          setCurrentPage(1);
        }}
        module="Notified User"
      />

      {/* ---- ManagementTable now uses onView instead of onEdit ---- */}
      <ManagementTable
        data={searchedUsers}
        columns={columns}
        // view instead of edit
        onView={(row) => navigate(`/notifyuser/view/${row._id}`)}
        // onToggleStatus={(row) => toggleStatusUser(row._id!)}   // keep if you need it
        onDelete={handleDelete}
        currentPage={currentPage}
        limit={itemsPerPage}
        module="Notified User"
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

export default NotifiedUserListTemplate;