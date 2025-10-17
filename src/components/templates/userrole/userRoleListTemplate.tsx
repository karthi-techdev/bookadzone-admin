import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import TableHeader from '../../molecules/TableHeader';
import ManagementTable from '../../organisms/ManagementTable';
import BAZLoader from '../../atoms/BAZ-Loader';
import Pagination from '../../atoms/BAZ-Pagination';
import { useUserRoleStore } from '../../stores/UserRoleStore';
import type { ColumnConfig, IRole } from '../../types/common';
import { truncate } from '../../utils/helper';

interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}

const UserRoleListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { roles, fetchRoles, deleteRole, toggleStatusRole, loading, error, stats } = useUserRoleStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<'total' | 'Active' | 'Inactive'>('total');
  const itemsPerPage = 5;


  const getTotalItems = () => {
    if (selectedFilter === 'Active') return stats.active;
    if (selectedFilter === 'Inactive') return stats.inactive;
    return stats.total;
  };
  const filteredTotalPages = Math.max(1, Math.ceil(getTotalItems() / itemsPerPage));

 
  useEffect(() => {
    fetchRoles(currentPage, itemsPerPage, selectedFilter);
  }, [currentPage, selectedFilter]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

 
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  
  const searchedRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const statFilters: StatFilter[] = [
    { id: 'total', title: 'All Roles', value: stats.total, trend: 'up', change: '2%', icon: null },
    { id: 'Active', title: 'Active Roles', value: stats.active, trend: 'up', change: '1%', icon: null },
    { id: 'Inactive', title: 'Inactive Roles', value: stats.inactive, trend: 'down', change: '1%', icon: null },
  ];

  
  const handleDelete = (role: IRole) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the role "${role.name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteRole(role._id!);
        const updatedLength = searchedRoles.length - 1;
        const newTotalItems = getTotalItems() - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);  
        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1); 
        } else {
          await fetchRoles(currentPage, itemsPerPage, selectedFilter);
        }
        Swal.fire('Deleted!', 'The role has been removed.', 'success');
      }
    });
  };

 

 const columns: ColumnConfig<IRole>[] = [
  {
    key: 'name',
    label: 'Role Name',
    render: (value) => {
      const formatted =
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      return truncate(formatted, 40);
    },
  },
];


  if (loading) return <BAZLoader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="User Role"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add Role"
        addButtonLink="/userrole/add"
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          setSelectedFilter(id as 'total' | 'Active' | 'Inactive');
          setCurrentPage(1);
        }}
        module="userrole"
      />

      <ManagementTable
        data={searchedRoles}
        columns={columns}
        onEdit={(row) => navigate(`/userrole/edit/${row._id}`)}
        onToggleStatus={(row) => toggleStatusRole(row._id!)}
        onDelete={handleDelete}
        currentPage={currentPage}
        limit={itemsPerPage}
        module="userrole"
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

export default UserRoleListTemplate;