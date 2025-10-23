import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../../molecules/TableHeader';
import ManagementTable from '../../../organisms/ManagementTable';
import BAZLoader from '../../../atoms/BAZ-Loader';
import Pagination from '../../../atoms/BAZ-Pagination';
import { useBlogStore } from '../../../stores/blogStore';
import type { ColumnConfig, Blog } from '../../../types/common';
import { truncate } from '../../../utils/helper';
import ImportedURL from '../../../common/urls';

const BlogTrashListTemplate: React.FC = () => {
    const navigate = useNavigate();
    const {
        blogs,
        fetchTrashBlogs,
        restoreBlog,
        deleteBlogPermanently,
        totalPages,
        loading,
        error,
        // stats, // If you add stats to AgencyStore, you can use for statFilters
    } = useBlogStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchTrashBlogs(currentPage, itemsPerPage);
    }, [currentPage]);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected + 1);
        (selectedItem.selected + 1, itemsPerPage);
    };

    // Filter search term locally (after API filter is applied)
    const searchedblogs = blogs.filter((blog) =>
        blog.seoTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.seoDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.blogTitle.toLowerCase().includes(searchTerm.toLowerCase())

    );

    const columns: ColumnConfig<Blog>[] = [
        { key: 'blogTitle', label: 'Blog Title', render: (value) => truncate(value, 20) },
        { key: 'seoTitle', label: 'Seo Title', render: (value) => truncate(value, 20) },
        { key: 'seoDescription', label: 'Seo Description', render: (value) => truncate(value, 20) },
        {
            key: 'status',
            label: 'Status',
            render: (value) => value === 'active' ? 'Active' : 'Inactive',
        },
    ];

    // Restore handler
    const handleRestore = (blog: Blog) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to restore "${blog.blogTitle}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--puprle-color)',
            cancelButtonColor: 'var(--light-blur-grey-color)',
            confirmButtonText: 'Yes, restore it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await restoreBlog(blog._id!);
                await fetchTrashBlogs(currentPage, itemsPerPage);
                Swal.fire('Restored!', 'The blog has been restored.', 'success');
            }
        });
    };

    // Permanent delete handler
    const handlePermanentDelete = (blog: Blog) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to permanently delete "${blog.blogTitle}". This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--puprle-color)',
            cancelButtonColor: 'var(--light-blur-grey-color)',
            confirmButtonText: 'Yes, delete it permanently!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteBlogPermanently(blog._id!);
                await fetchTrashBlogs(currentPage, itemsPerPage);
                Swal.fire('Deleted!', 'The blog has been permanently deleted.', 'success');
            }
        });
    };

    if (loading) return <BAZLoader />;

    // Debug: log the data being passed to the table
    console.log('blogs:', blogs);
    console.log('searchedblogs:', searchedblogs);

    return (
        <div className="p-6">
            <TableHeader
                managementName="Blog Trash"
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                addButtonLabel="Back to List"
                addButtonLink="/blog"
                module="blog"
            />
            <ManagementTable
                data={searchedblogs.length ? searchedblogs : blogs}
                columns={columns}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
                currentPage={currentPage}
                limit={itemsPerPage}
                module="blog"
            />
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination
                        pageCount={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default BlogTrashListTemplate;
