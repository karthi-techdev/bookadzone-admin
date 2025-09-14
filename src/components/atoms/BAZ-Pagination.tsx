import React from 'react';
import type { FC } from 'react';
// Import react-paginate in a way that works for both ESM and CJS in Jest/TS environments
import ReactPaginateImport from 'react-paginate';
const ReactPaginate: any = (ReactPaginateImport as any)?.default ?? (ReactPaginateImport as any);

type PaginationProps = {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
};

/**
 * Pagination component
 * Wraps react-paginate and normalizes props/styles.
 * currentPage is 1-based externally; react-paginate expects 0-based forcePage.
 */
const BAZPagination: FC<PaginationProps> = ({
  pageCount,
  currentPage,
  onPageChange,
}) => {
  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      onPageChange={onPageChange}
      forcePage={currentPage - 1}
      containerClassName="flex items-center gap-2 text-sm"
      pageClassName="cursor-pointer rounded-md border px-3 py-1 text-white hover:bg-indigo-500 hover:text-white transition"
      activeClassName="!bg-indigo-500 !text-white !border-indigo-500 hover:!bg-blue-700"
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
      previousClassName="cursor-pointer px-2 py-1 text-white rounded hover:bg-indigo-500"
      nextClassName="cursor-pointer px-2 py-1 text-white rounded hover:bg-indigo-500"
      disabledClassName="opacity-50 cursor-not-allowed"
    />
  );
};

export default BAZPagination;