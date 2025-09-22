import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import TableHeader from '../../molecules/TableHeader';
import ManagementTable from '../../organisms/ManagementTable';
import BAZLoader from '../../atoms/BAZ-Loader';
import Pagination from '../../atoms/BAZ-Pagination';

import { useConfigStore } from '../../stores/configStore';
import type { ColumnConfig, Config } from '../../types/common';
import { truncate } from '../../utils/helper'

interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}

const ConfigListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    configs,
    fetchConfigs,
    deleteConfig,
    toggleStatusConfig,
    totalPages,
    loading,
    error,
    stats,
  } = useConfigStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<'total' | 'active' | 'inactive'>('total');
  const itemsPerPage = 3;

  const getTotalItems = () => {
    if (selectedFilter === 'active') return stats.active;
    if (selectedFilter === 'inactive') return stats.inactive;
    return stats.total;
  };
  const filteredTotalPages = Math.max(1, Math.ceil(getTotalItems() / itemsPerPage));

  useEffect(() => {
    fetchConfigs(currentPage, itemsPerPage, selectedFilter);
  }, [currentPage, selectedFilter, fetchConfigs]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const searchedConfigs = configs.filter((config) =>
    config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statFilters: StatFilter[] = [
    {
      id: 'total',
      title: 'All Configs',
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
      change: '+12%',
      icon: null,
    },
    {
      id: 'inactive',
      title: 'Inactive',
      value: stats.inactive,
      trend: 'down',
      change: '-2%',
      icon: null,
    },
  ];

  const handleDelete = async (config: Config) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${config.name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteConfig(config._id!);

        const updatedLength = searchedConfigs.length - 1;
        const newTotalItems = configs.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1);
        } else {
          await fetchConfigs(currentPage, itemsPerPage, selectedFilter);
        }

        Swal.fire('Deleted!', 'The config has been removed.', 'success');
      }
    });
  };

  const columns: ColumnConfig<Config>[] = [
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
      key: 'configFields',
      label: 'Fields Count',
      render: (value) => (value ? value.length : 0),
    },
  ];

  if (loading) return <BAZLoader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Config"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/config/add"
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          setSelectedFilter(id as 'total' | 'active' | 'inactive');
          setCurrentPage(1);
        }}
        module="config"
      />

      <ManagementTable
        data={searchedConfigs}
        columns={columns}
        onEdit={(row) => navigate(`/config/edit/${row._id}`)}
        onToggleStatus={(row) => toggleStatusConfig(row._id!)}
        onDelete={handleDelete}
        currentPage={currentPage}
        limit={itemsPerPage}
        module="config"
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

export default ConfigListTemplate;