import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import TableHeader from '../../../molecules/TableHeader';
import ManagementTable from '../../../organisms/ManagementTable';
import Loader from '../../../atoms/BAZ-Loader';
import BAZPagination from '../../../atoms/BAZ-Pagination';

import { useConfigStore } from '../../../stores/configStore';
import type { ColumnConfig, Config } from '../../../types/common';
import { truncate } from '../../../utils/helper'

interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}

const ConfigTrashListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    configs,
    fetchTrashConfigs,
    totalPages,
    loading,
    error,
    stats,
    restoreConfig,
    deleteConfigPermanently,
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
    fetchTrashConfigs(currentPage, itemsPerPage, selectedFilter);
  }, [currentPage, selectedFilter, fetchTrashConfigs]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(newPage);
    fetchTrashConfigs(newPage, itemsPerPage, selectedFilter);
  };

  const searchedConfigs = configs.filter((config) =>
    config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statFilters: StatFilter[] = [
    {
      id: 'total',
      title: 'All Trashed Configs',
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

  const handleRestore = async (config: Config) => {
    Swal.fire({
      title: 'Restore config?',
      text: `Restore "${config.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, restore!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await restoreConfig(config._id!);
        await fetchTrashConfigs(currentPage, itemsPerPage, selectedFilter);
        Swal.fire('Restored!', 'The config has been restored.', 'success');
      }
    });
  };

  const handlePermanentDelete = async (config: Config) => {
    Swal.fire({
      title: 'Permanent delete?',
      text: `You are about to permanently delete "${config.name}". This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--puprle-color)',
      cancelButtonColor: 'var(--light-blur-grey-color)',
      confirmButtonText: 'Yes, delete it permanently!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteConfigPermanently(config._id!);

        const updatedLength = searchedConfigs.length - 1;
        const newTotalItems = configs.length - 1;
        const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);

        if (updatedLength === 0 && currentPage > newTotalPages) {
          setCurrentPage(newTotalPages || 1);
        } else {
          await fetchTrashConfigs(currentPage, itemsPerPage, selectedFilter);
        }

        Swal.fire('Deleted!', 'The config has been permanently deleted.', 'success');
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

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Config"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Back to List"
        addButtonLink="/config"
        module="config"
        isTrashView={true}
      />

      <ManagementTable
        data={searchedConfigs}
        columns={columns}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        currentPage={currentPage}
        limit={itemsPerPage}
        module="config"
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

export default ConfigTrashListTemplate;