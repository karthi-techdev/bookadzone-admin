// Updated ManagementTable.tsx with support for onRestore and onPermanentDelete
import React from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { FiEye, FiEdit, FiTrash2, FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';
import { FaTrash } from "react-icons/fa6";
import BAZButton from '../atoms/BAZ-Button';

import type { ColumnConfig } from '../types/common';

interface ManagementTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  onEdit?: (row: T) => void;
  onToggleStatus?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  onDownload?: (row: T) => void;
  onRestore?: (row: T) => void; 
  onPermanentDelete?: (row: T) => void;
  currentPage?: number;
  limit?: number;
  module: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const ManagementTable = <T extends Record<string, any>>({
  data,
  columns,
  onEdit,
  onToggleStatus,
  onDelete,
  onView,
  onDownload,
  onRestore, 
  onPermanentDelete, 
  currentPage = 1,
  limit = 5, 
}: ManagementTableProps<T>) => {

  const StatusBadge = ({ status }: { status: boolean | string }) => {   
    const isActive = status === true || status === 'active';
    const bgColor = isActive ? 'bg-green-900/30' : 'bg-red-900/30';
    const textColor = isActive ? 'text-green-400' : 'text-red-400';
    const icon = isActive ? <FiCheckCircle className="mr-1" /> : <FiXCircle className="mr-1" />;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {icon} {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  // Handler for status change with swal confirmation
  const handleStatusChange = async (row: T) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to change the status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!'
    });
    if (result.isConfirmed && onToggleStatus) {
      onToggleStatus(row);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-[var(--light-dark-color)] rounded-xl shadow-sm border border-[var(--light-blur-grey-color)] overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-left text-xs font-medium text-[var(--light-grey-color)] uppercase tracking-wider border-b border-[var(--light-blur-grey-color)]">
            <tr>
              <th className="px-4 py-3">S.NO</th>
              {columns.map((col) => (
                <th key={String(col.key)} className="px-4 py-3">
                  {col.label}
                </th>
              ))}
              {onToggleStatus && (
                <th className="px-4 py-3">Status</th>
              )}
              {(onEdit || onDelete || onView || onRestore || onPermanentDelete) && (
                <th className="px-4 py-3 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--light-blur-grey-color)]">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onToggleStatus ? 1 : 0) + ((onEdit || onDelete || onView || onRestore || onPermanentDelete) ? 1 : 0)}
                  className="px-4 py-8 text-center text-sm text-[var(--light-grey-color)]"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <motion.tr
                  key={index}
                  variants={itemVariants}
                  className="hover:bg-[var(--dark-color)]/50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--light-grey-color)]">
                    {(currentPage - 1) * limit + index + 1}
                  </td>
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 whitespace-nowrap text-sm text-white">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {onToggleStatus && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <BAZButton
                        type="button"
                        onClick={() => handleStatusChange(row)}
                        className="text-[var(--light-grey-color)] hover:text-white p-1 rounded-md hover:bg-[var(--dark-color)]"
                      >
                        <StatusBadge status={row.status} />
                      </BAZButton>
                    </td>
                  )}
                  {(onEdit || onDelete || onView || onRestore || onPermanentDelete) && (
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end space-x-2">
                        {onView && (
                          <BAZButton
                            type="button"
                            aria-label="View"
                            onClick={() => onView(row)}
                            className="text-[var(--light-grey-color)] hover:text-white p-1 rounded-md hover:bg-[var(--dark-color)]"
                          >
                            <FiEye className="h-4 w-4" />
                          </BAZButton>
                        )}
                        {onEdit && (
                          <BAZButton
                            type="button"
                            aria-label="Edit"
                            onClick={() => onEdit(row)}
                            className="text-[var(--light-grey-color)] hover:text-blue-400 p-1 rounded-md hover:bg-[var(--dark-color)]"
                          >
                            <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>Edit</span>
                            <FiEdit className="h-4 w-4" />
                          </BAZButton>
                        )}
                        {onDelete && (
                          <BAZButton
                            type="button"
                            aria-label="Delete"
                            onClick={() => onDelete(row)}
                            className="text-[var(--light-grey-color)] hover:text-red-400 p-1 rounded-md hover:bg-[var(--dark-color)]"
                          >
                            <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>Delete</span>
                            <FiTrash2 className="h-4 w-4" />
                          </BAZButton>
                        )}
                        {onDownload && (
                          <BAZButton
                            type="button"
                            aria-label="Download"
                            onClick={() => onDownload(row)}
                            className="text-[var(--light-grey-color)] hover:text-red-400 p-1 rounded-md hover:bg-[var(--dark-color)]"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </BAZButton>
                        )}
                        {onRestore && (
                          <BAZButton
                            type="button"
                            aria-label="Restore"
                            onClick={() => onRestore(row)}
                            className="text-[var(--light-grey-color)] hover:text-green-400 p-1 rounded-md hover:bg-[var(--dark-color)]"
                          >
                            <FiRefreshCw className="h-4 w-4" /> {/* Icon for restore */}
                          </BAZButton>
                        )}
                        {onPermanentDelete && (
                          <BAZButton
                            type="button"
                            aria-label="Permanent Delete"
                            onClick={() => onPermanentDelete(row)}
                            className="text-[var(--light-grey-color)] hover:text-red-400 p-1 rounded-md hover:bg-[var(--dark-color)]"
                          >
                            <FaTrash className="h-4 w-4" /> {/* Different icon for permanent delete */}
                          </BAZButton>
                        )}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ManagementTable;