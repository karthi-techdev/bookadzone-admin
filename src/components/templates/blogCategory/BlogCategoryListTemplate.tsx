import React,{useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import TableHeader from '../../molecules/TableHeader';
import ManagementTable from '../../organisms/ManagementTable';
import BAZLoader from '../../atoms/BAZ-Loader';
import Pagination from '../../atoms/BAZ-Pagination';

import type { ColumnConfig, BlogCategory } from '../../types/common';
import { truncate } from '../../utils/helper'
import { useBlogCategoryStore } from "../../stores/blogCategoryStore";

interface StatFilter {
  id:string;
  title:string;
  value:number;
  trend:'up'|'down';
  change:string;
  icon:React.ReactNode;
}

const BlogCategoryListTemplate: React.FC =()=>{
  const navigate = useNavigate();
  const {
    blogCategory,
    fetchBlogCategory,
    deleteBlogCategory,
    toggleStatusBlogCategory,
    loading,
    error,
    stats,
  }=useBlogCategoryStore();
  console.log(blogCategory,"=======");
  
  const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFilter, setSelectedFilter] = useState<'total' | 'active' | 'inactive'>('total');
    const itemsPerPage = 4;

    const getTotalItems = () => {
    if (selectedFilter === 'active') return stats.active;
    if (selectedFilter === 'inactive') return stats.inactive;
    return stats.total;
  };

  const filteredTotalPages = Math.max(1,Math.ceil(getTotalItems()/itemsPerPage))

  useEffect(() => {
      fetchBlogCategory(currentPage, itemsPerPage, selectedFilter);
    }, [currentPage, selectedFilter]);

    useEffect(() => {
        if (error) toast.error(error);
      }, [error]);

       const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const searchedBlogCategories = blogCategory.filter((blogCategory) =>
    blogCategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blogCategory.slug.toLowerCase().includes(searchTerm.toLowerCase())

  );

  const statFilters: StatFilter[] = [
    {
      id: 'total',
      title: 'All BlogCategory',
      value: stats.total,
      trend: 'up',
      change: '2%',
      icon: null,
    },
    {
      id: 'active',
      title: 'Active BlogCategory',
      value: stats.active,
      trend: 'up',
      change: '1%',
      icon: null,
    },
    {
      id: 'inactive',
      title: 'Inactive BlogCategory',
      value: stats.inactive,
      trend: 'down',
      change: '1%',
      icon: null,
    },
  ];

  const handleDelete = (BlogCategory: BlogCategory) => {
      Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete "${BlogCategory.name}"`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'var(--puprle-color)',
        cancelButtonColor: 'var(--light-blur-grey-color)',
        confirmButtonText: 'Yes, delete it!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteBlogCategory(BlogCategory._id!);
  
          const updatedLength = searchedBlogCategories.length - 1;
          const newTotalItems = blogCategory.length - 1;
          const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
  
          // Adjust current page if necessary
          if (updatedLength === 0 && currentPage > newTotalPages) {
            setCurrentPage(newTotalPages || 1); // Go to the last page or page 1 if no pages remain
          } else {
            await fetchBlogCategory(currentPage, itemsPerPage, selectedFilter);
          }
  
          Swal.fire('Deleted!', 'The BlogCategory has been removed.', 'success');
        }
      });
    };

    const columns: ColumnConfig<BlogCategory>[] = [
        {
          key: 'name',
          label: 'Name',
          render: (value) => truncate(value, 40),
        },
        {
          key: 'slug',
          label: 'Slug',
          render: (value) => truncate(value, 40),
        }
      ];

 
  if (loading) return <BAZLoader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="BlogCategory"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/blogcategory/add"
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          setSelectedFilter(id as 'total' | 'active' | 'inactive');
          setCurrentPage(1);
        }}
        module="blogCategory"
      />

      <ManagementTable
        data={searchedBlogCategories}
        columns={columns}
        onEdit={(row) => navigate(`/blogcategory/edit/${row._id}`)}
        onToggleStatus={(row) => toggleStatusBlogCategory(row._id!)}
        onDelete={handleDelete}
        currentPage={currentPage}
        limit={itemsPerPage}
        module="blogCategory"

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
 


}

export default BlogCategoryListTemplate