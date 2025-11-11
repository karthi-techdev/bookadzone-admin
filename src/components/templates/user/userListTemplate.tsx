import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import TableHeader from '../../molecules/TableHeader';
import ManagementTable from '../../organisms/ManagementTable';
import BAZLoader from '../../atoms/BAZ-Loader';
import Pagination from '../../atoms/BAZ-Pagination';

import { useUserStore } from '../../stores/userStore';
import type { ColumnConfig, User } from '../../types/common';
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

const UserListTemplate: React.FC = () => {
    const navigate = useNavigate();
    const {
        users,
        fetchUsers,
        deleteUser,
        toggleStatusUser,
        loading,
        error,
        stats,
    } = useUserStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFilter, setSelectedFilter] = useState<'total' | 'admin' | 'editor' | 'viewer'>('total');

    // Use default items per page from constants
    const itemsPerPage = DEFAULT_ITEMS_PER_PAGE;

    // Calculate total items for pagination based on selected filter
    const getTotalItems = () => {
        if (selectedFilter === 'admin') return stats.admin;
        if (selectedFilter === 'editor') return stats.editor;
        if (selectedFilter === 'viewer') return stats.viewer;
        return stats.total;
    };
    const filteredTotalPages = Math.max(1, Math.ceil(getTotalItems() / itemsPerPage));

    // Fetch data on page or filter change
    useEffect(() => {
        const loadUsers = async () => {
            try {
                await fetchUsers(currentPage, itemsPerPage, selectedFilter);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };
        loadUsers();
    }, [currentPage, selectedFilter, itemsPerPage, fetchUsers]);

    // Show error toast
    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    // Handle pagination
    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    // Filter search term locally (after API filter is applied)
    const searchedUsers = users.filter((user) =>
        (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (user.role?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (user.userType?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (user.phone?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    );

    // Stats for filter buttons
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
            id: 'admin',
            title: 'Admin Users',
            value: stats.admin,
            trend: 'up',
            change: '1%',
            icon: null,
        },
        {
            id: 'editor',
            title: 'Editor Users',
            value: stats.editor,
            trend: 'down',
            change: '1%',
            icon: null,
        },
        {
            id: 'viewer',
            title: 'Viewer Users',
            value: stats.viewer,
            trend: 'down',
            change: '1%',
            icon: null,
        },
    ];

    // Delete handler
    const handleDelete = (user: User) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete "${user.username}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--purple-color)',
            cancelButtonColor: 'var(--light-blur-grey-color)',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteUser(user._id!);

                const updatedLength = searchedUsers.length - 1;
                const newTotalItems = users.length - 1;
                const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

                // Adjust current page if necessary
                if (updatedLength === 0 && currentPage > newTotalPages) {
                    setCurrentPage(newTotalPages || 1); // Go to the last page or page 1 if no pages remain
                } else {
                    await fetchUsers(currentPage, itemsPerPage, selectedFilter);
                }

                Swal.fire('Deleted!', 'The user has been removed.', 'success');
            }
        });
    };

    const columns: ColumnConfig<User>[] = [
        {
            key: 'username',
            label: 'Username',
            render: (value) => truncate(value || '', 40),
        },
        {
            key: 'email',
            label: 'Email',
            render: (value) => truncate(value || '', 40),
        },
        {
            key: 'role',
            label: 'Role',
            render: (value) => truncate(value || '', 40),
        },
        {
            key: 'userType',
            label: 'User Type',
            render: (value) => truncate(value || '', 40),
        },
        {
            key: 'phone',
            label: 'Phone',
            render: (value) => truncate(value || '', 40),
        },
    ];

    if (loading) return <BAZLoader />;

    return (
        <div className="p-6">
            <TableHeader
                managementName="User"
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                addButtonLabel="Add"
                addButtonLink="/add-user"
                statFilters={statFilters}
                selectedFilterId={selectedFilter}
                onSelectFilter={(id) => {
                    setSelectedFilter(id as 'total' | 'admin' | 'editor' | 'viewer');
                    setCurrentPage(1);
                }}
                module="user"
            />

            <ManagementTable
                data={searchedUsers}
                columns={columns}
                onEdit={(row) => navigate(`/edit-user/${row._id}`)}
                onToggleStatus={(row) => toggleStatusUser(row._id!)}
                onDelete={handleDelete}
                currentPage={currentPage}
                limit={itemsPerPage}
                module="user"
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

export default UserListTemplate;