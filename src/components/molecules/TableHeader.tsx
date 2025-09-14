import React from 'react';
import { FiSearch, FiPlus, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';

interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}

interface TableHeaderProps {
  searchTerm?: string;
  onSearchChange: (term: string) => void;
  addButtonLabel?: string;
  addButtonLink?: string;
  managementName: string;
  statFilters?: StatFilter[];
  selectedFilterId?: string;
  onSelectFilter?: (id: string) => void;
  module?: string;
  isTrashView?: boolean;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  searchTerm,
  onSearchChange,
  addButtonLabel,
  addButtonLink,
  managementName,
  statFilters = [],
  selectedFilterId,
  onSelectFilter,
  module,
  isTrashView = false,
}) => {
  const { user } = useAuthStore();

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{managementName}</h1>
          {/* Dynamic Breadcrumbs */}
          <nav className="text-xs" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-1">
              <li className="flex items-center">
                <Link to="/" className="text-[var(--light-grey-color)] hover:text-white font-medium">Home</Link>
              </li>
              <li className="flex items-center">
                <FiChevronRight className="mx-1 text-[var(--light-grey-color)] text-sm" />
              </li>
              {isTrashView ? (
                <>
                  <li className="flex items-center">
                    <Link to={`/${module || 'faq'}`} className="text-[var(--light-grey-color)] hover:text-white font-medium">
                      {module ? module.charAt(0).toUpperCase() + module.slice(1) : 'FAQ'}
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <FiChevronRight className="mx-1 text-[var(--light-grey-color)] text-sm" />
                  </li>
                  <li className="flex items-center text-white font-semibold cursor-default pointer-events-none">Trash</li>
                </>
              ) : (
                <li className="flex items-center">
                  <Link to={`/${managementName.toLowerCase()}`} className="text-white font-semibold cursor-default pointer-events-none">
                    {managementName}
                  </Link>
                </li>
              )}
            </ol>
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-4 w-4 text-[var(--light-grey-color)]" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          {statFilters.length > 0 && (
            <div className="relative">
              <select
                className="appearance-none bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded-lg pl-3 pr-10 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent"
                value={selectedFilterId}
                onChange={(e) => onSelectFilter?.(e.target.value)}
              >
                {statFilters.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.title}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--light-grey-color)]">
                <FiChevronDown className="h-4 w-4" />
              </div>
            </div>
          )}
          {addButtonLink && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to={addButtonLink}
                className="flex items-center px-4 py-2 bg-[var(--puprle-color)] hover:bg-[var(--puprle-color)]/90 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <FiPlus className="mr-2" /> {addButtonLabel}
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableHeader;