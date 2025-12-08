import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import TableHeader from "../../../molecules/TableHeader";
import ManagementTable from "../../../organisms/ManagementTable";
import Loader from "../../../atoms/BAZ-Loader";
import BAZPagination from "../../../atoms/BAZ-Pagination";

import { useUserStore } from "../../../stores/userStore";
import type { ColumnConfig, User } from "../../../types/common";
import { truncate } from "../../../utils/helper";

const UserTrashListTemplate: React.FC = () => {
  const navigate = useNavigate();

  const {
    users,
    stats,
    loading,
    error,
    fetchTrashUsers,
    restoreUser,
    deleteUserPermanently,
  } = useUserStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] =
    useState<"total" | "admin" | "editor" | "viewer">("total");

  const itemsPerPage = 10;

  const getTotalItems = () => {
    if (selectedFilter === "admin") return stats.admin;
    if (selectedFilter === "editor") return stats.editor;
    if (selectedFilter === "viewer") return stats.viewer;
    return stats.total;
  };
  const filteredTotalPages = Math.max(
    1,
    Math.ceil(getTotalItems() / itemsPerPage)
  );

  // Fetch trash users
  useEffect(() => {
    fetchTrashUsers(currentPage, itemsPerPage, selectedFilter);
  }, [currentPage, selectedFilter]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const searchedUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Restore User
  const handleRestore = (user: User) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to restore "${user.username}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--puprle-color)",
      cancelButtonColor: "var(--light-blur-grey-color)",
      confirmButtonText: "Yes, restore!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await restoreUser(user._id!);

        const updatedLength = searchedUsers.length - 1;
        const newTotalItems = users.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1);
        } else {
          fetchTrashUsers(currentPage, itemsPerPage, selectedFilter);
        }

        Swal.fire("Restored!", "User restored successfully.", "success");
      }
    });
  };

  // Permanent delete
  const handlePermanentDelete = (user: User) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You will permanently delete "${user.username}". This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--puprle-color)",
      cancelButtonColor: "var(--light-blur-grey-color)",
      confirmButtonText: "Yes, delete permanently",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteUserPermanently(user._id!);

        const updatedLength = searchedUsers.length - 1;
        const newTotalItems = users.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1);
        } else {
          fetchTrashUsers(currentPage, itemsPerPage, selectedFilter);
        }

        Swal.fire("Deleted!", "User permanently deleted.", "success");
      }
    });
  };

  const columns: ColumnConfig<User>[] = [
    {
      key: "username",
      label: "Username",
      render: (v) => truncate(v, 30),
    },
    {
      key: "email",
      label: "Email",
      render: (v) => truncate(v, 30),
    },
    {
      key: "role",
      label: "Role",
    },
   
  ];

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Deleted Users"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Back to Users"
        addButtonLink="/users"
        module="user"
        isTrashView={true}
      />

      <ManagementTable
        data={searchedUsers}
        columns={columns}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        currentPage={currentPage}
        limit={itemsPerPage}
        module="user"
      />

      {filteredTotalPages > 1 && (
        <div className="flex justify-center mt-6">
          <BAZPagination
            pageCount={filteredTotalPages}
            currentPage={currentPage}
            onPageChange={({ selected }) =>
              setCurrentPage(selected + 1)
            }
          />
        </div>
      )}
    </div>
  );
};

export default UserTrashListTemplate;
