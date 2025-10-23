import React, { useEffect, useMemo, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';

import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';
import ValidationHelper from '../../utils/validationHelper';
import type { FieldConfig } from '../../types/common';
import { useBlogStore } from '../../stores/blogStore';
import { useBlogCategoryStore } from '../../stores/blogCategoryStore';
import { BlogFields } from '../../utils/fields/blogFields';

// Form data type for react-hook-form
type BlogFormData = {
    seoTitle: string;
    seoDescription: string;
    blogTitle: string;
    blogCategory: string; // will hold category _id
    template: string; // will be mapped to blogDescription on submit
    blogImg: File | string;
};


// ...



const BlogsFormTemplate: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchBlogById, addBlog, updateBlog } = useBlogStore();
    const { blogCategory, fetchAllActiveBlogCategories } = useBlogCategoryStore();

    const [isInitialized, setIsInitialized] = useState(false);
    const [existingBlogData, setExistingBlogData] = useState<any>(null);

    const methods = useForm<BlogFormData>({
        defaultValues: {
            seoTitle: '',
            seoDescription: '',
            blogTitle: '',
            blogCategory: '',
            template: '',
            blogImg: '' as any,
        },
        mode: 'onSubmit',
    });

    const { handleSubmit, reset, setError, clearErrors, setValue, formState: { isSubmitting } } = methods;

    //   Build fields from shared BlogFields and inject dynamic options for blogCategory
    
    const fields: FieldConfig[] = useMemo(() => {
        return BlogFields.map((f) =>
            f.name === 'blogCategory'
                ? { ...f, options: (blogCategory || []).map((c: any) => ({ label: c.name, value: c._id })) }
                : f
        );
    }, [blogCategory]);

    // Fetch categories for the select
    useEffect(() => {
        fetchAllActiveBlogCategories().catch(() => {
            // Ignore; handled by store error if any
        });
    }, [fetchAllActiveBlogCategories]);

    // Fetch existing blog if editing
    useEffect(() => {
        if (id && !isInitialized) {
            const fetchData = async () => {
                const blog = await fetchBlogById(id);
                if (blog) {
                    setExistingBlogData(blog);
                    reset({
                        seoTitle: blog.seoTitle || '',
                        seoDescription: blog.seoDescription || '',
                        blogTitle: blog.blogTitle || '',
                        blogCategory: (blog.blogCategory as any) || '',
                        template: blog.blogDescription || '',
                        blogImg: blog.blogImg || ''
                    });
                    setIsInitialized(true);
                } else {
                    toast.error('Failed to load blog data');
                }
            };
            fetchData();
        }
    }, [id, fetchBlogById, reset, isInitialized]);

    

    // Generic field change handler similar to Category/NewsLetter
    const handleFieldChange = (fieldName: keyof BlogFormData, minLength?: number) => (e: { target: { name: string; value: any; removedFiles?: string[] } }) => {
        const value = e.target.value;

        const validations: (ReturnType<typeof ValidationHelper.isRequired> | ReturnType<typeof ValidationHelper.minLength> | ReturnType<typeof ValidationHelper.isValidFileType> | null)[] = [];

        // Required checks based on field metadata
        const meta = fields.find(f => f.name === fieldName);
        if (meta?.required) {
            validations.push(ValidationHelper.isRequired(value, fieldName));
        }

        if (minLength && typeof value === 'string') {
            validations.push(ValidationHelper.minLength(value, fieldName, minLength));
        }

        if (fieldName === 'blogImg' && value instanceof File) {
            validations.push(ValidationHelper.isValidFileType(value, fieldName, 'image/*'));
        }

        const errorsArr = ValidationHelper.validate(validations as any);
        if (errorsArr.length > 0) {
            setError(fieldName, { type: 'manual', message: errorsArr[0].message });
        } else {
            clearErrors(fieldName);
        }

        setValue(fieldName, value, { shouldValidate: true });
    };

    const onSubmit = async (data: BlogFormData) => {
        clearErrors();

        const validationErrors = ValidationHelper.validate([
            ValidationHelper.isRequired(data.seoTitle, 'seoTitle'),
            ValidationHelper.minLength(data.seoTitle, 'seoTitle', 3),

            ValidationHelper.isRequired(data.seoDescription, 'seoDescription'),
            ValidationHelper.minLength(data.seoDescription, 'seoDescription', 3),

            ValidationHelper.isRequired(data.template, 'template'),
            //   ValidationHelper.minLength(data.seoDescription, 'seoDescription',3),

            ValidationHelper.isRequired(data.blogTitle, 'blogTitle'),
            ValidationHelper.minLength(data.blogTitle, 'blogTitle', 3),

            ValidationHelper.isRequired(data.blogCategory, 'blogCategory'),
            // For images, only validate file type if it's a new file

            data.blogImg instanceof File ? ValidationHelper.isValidFileType(data.blogImg, 'blogImg', 'image/*') : null,
            // ValidationHelper.isRequired(data.blogImg, 'blogImg'),

        ]);

        if (validationErrors.length > 0) {
            validationErrors.forEach((err) => {
                const fieldName = err.field as keyof BlogFormData;
                setError(fieldName, { type: 'manual', message: err.message });
            });
            toast.error('Please fix all validation errors');
            return;
        }

        try {
            const formData = new FormData();
            // Map template -> blogDescription
            formData.append('blogDescription', data.template || '');
            formData.append('blogTitle', data.blogTitle || '');
            formData.append('blogCategory', data.blogCategory || '');
            formData.append('seoTitle', data.seoTitle || '');
            formData.append('seoDescription', data.seoDescription || '');

            if (data.blogImg instanceof File) {
                formData.append('blogImg', data.blogImg);
            } else if (typeof data.blogImg === 'string') {
                // Keep compatibility if backend accepts string path for existing image
                formData.append('blogImg', data.blogImg);
            }

            if (id) {
                await updateBlog(id, formData);
                await Swal.fire({
                    title: 'Success!',
                    text: 'Blog updated successfully',
                    icon: 'success',
                    confirmButtonColor: 'var(--puprle-color)',
                });
            } else {
                await addBlog(formData);
                await Swal.fire({
                    title: 'Success!',
                    text: 'Blog added successfully',
                    icon: 'success',
                    confirmButtonColor: 'var(--puprle-color)',
                });
            }
            navigate('/blog');
        } catch (error: any) {
            const errorData = error?.response?.data || {};
            if (errorData.errors && Array.isArray(errorData.errors)) {
                errorData.errors.forEach((err: { path: string; message: string }) => {
                    toast.error(`${err.path}: ${err.message}`);
                });
            } else {
                toast.error(errorData.message || error?.message || 'Something went wrong');
            }
        }
    };

    return (
        <div className="p-6">
            <FormHeader
                managementName="Blog"
                addButtonLink="/blog"
                type={id ? 'Edit' : 'Add'}
            />
            <ToastContainer position="top-right" autoClose={3000} />
            <FormProvider {...methods}>
                <ManagementForm
                    label={id ? 'Update' : 'Save'}
                    fields={fields}
                    isSubmitting={isSubmitting}
                    isJodit={true}
                    managementName="Blog"
                    onSubmit={handleSubmit(onSubmit)}
                    data-testid="blogs-form"
                    existingFiles={{
                        blogImg: existingBlogData?.blogImg ?? '',
                    }}
                    onFieldChange={{
                        seoTitle: handleFieldChange('seoTitle', 3),
                        seoDescription: handleFieldChange('seoDescription'),
                        blogTitle: handleFieldChange('blogTitle', 3),
                        blogCategory: handleFieldChange('blogCategory'),
                        template: handleFieldChange('template', 5),
                        blogImg: handleFieldChange('blogImg'),
                    }}
                />
            </FormProvider>
        </div>
    );
};

export default BlogsFormTemplate;
