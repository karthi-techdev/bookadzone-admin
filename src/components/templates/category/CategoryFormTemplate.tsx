import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useCategoryStore } from '../../stores/categoryStore';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';
import { CategoryFields } from '../../utils/fields/categoryfield';
import ValidationHelper from '../../utils/validationHelper';
import Swal from 'sweetalert2';

type CategoryFormData = {
	name: string;
	photo: File | string;
	slug: string;
	isFeatured?: boolean;
	description: string;
};

const CategoryFormTemplate: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { fetchCategoryById, addCategory, updateCategory } = useCategoryStore();
	const [isInitialized, setIsInitialized] = useState(false);
	const [existingCategoryData, setExistingCategoryData] = useState<any>(null);

	const methods = useForm<CategoryFormData>({
		defaultValues: {
			name: '',
			slug: '',
			description: '',
			isFeatured: true,
		},
		mode: 'onSubmit',
	});

	const { handleSubmit, reset, setError, clearErrors, setValue, formState: { errors, isSubmitting } } = methods;

	// Fetch category data if editing
	useEffect(() => {
		if (id && !isInitialized) {
			const fetchData = async () => {
				try {
					console.log('Fetching category with ID:', id); // Debug log
					const category = await fetchCategoryById(id);
					console.log('Fetched category data:', category); // Debug log
					
					if (category) {
						setExistingCategoryData(category);
						reset({
							name: category.name || '',
							photo: category.photo || '',
							slug: category.slug || '',
							description: category.description || '',
							isFeatured: category.isFeatured || true,
						});
						setIsInitialized(true);
					} else {
						toast.error('Category not found');
						navigate('/category'); // Redirect back to list
					}
				} catch (error: any) {
					const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load category data';
					toast.error(errorMessage);
					navigate('/category'); // Redirect back to list on error
				}
			};
			fetchData();
		}
	}, [id, fetchCategoryById, reset, isInitialized, navigate]);

  const handleFieldChange = (fieldName: keyof CategoryFormData, minLength?: number) => (e: { target: { name: string; value: any } }) => {
    const rawValue = e.target.value;
    const field = CategoryFields.find(f => f.name === fieldName);

    if (!field) return;

    // Special handling for name field to auto-generate slug
    if (fieldName === 'name' && typeof rawValue === 'string') {
      const slugValue = rawValue.trim().replace(/\s+/g, '-').toLowerCase();
      setValue('slug', slugValue, { shouldValidate: false });
    }

    // Handle file validation separately
    if (field.type === 'file') {
      if (rawValue === '__invalid_file_type__') {
        setError(fieldName, {
          type: 'manual',
          message: `${field.label} must be of type: ${field.accept}`
        });
        setValue(fieldName, rawValue, { shouldValidate: false });
        return;
      }
    }

    const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
    const validations: any[] = [];

    // Required field validation first
    if (field.required) {
      validations.push(ValidationHelper.isRequired(value, fieldName));
    }

    // Only validate non-empty values
    if (value) {
      if (typeof value === 'string') {
        if (minLength) {
          validations.push(ValidationHelper.minLength(value, fieldName, minLength));
        }
        // Add max length validation where needed
        if (fieldName === 'description') {
          validations.push(ValidationHelper.maxLength(value, 'description', 2000));
        }
      }

      if (field.type === 'file' && value instanceof File) {
        validations.push(ValidationHelper.isValidFileType(value, fieldName, field.accept || ''));
      }
    }

    const errorsArr = ValidationHelper.validate(validations);

    if (errorsArr.length > 0) {
      setError(fieldName, {
        type: 'manual',
        message: errorsArr[0].message,
      });
    } else {
      clearErrors(fieldName);
    }
    
    setValue(fieldName, rawValue, { shouldValidate: false });
  };  const onSubmit = async (data: CategoryFormData) => {
    clearErrors();
    
    // Normalize values (trim strings)
    const d = {
      name: data.name?.trim() || '',
      description: data.description?.trim() || '',
      photo: data.photo,
      slug: data.slug?.trim() || '',
      isFeatured: data.isFeatured
    };

    // First validate all form fields with precedence: required > other rules
    const validations: any[] = [];

    // Name validations
    validations.push(ValidationHelper.isRequired(d.name, 'name'));
    if (d.name) validations.push(ValidationHelper.minLength(d.name, 'name', 3));
    
    // Description validations 
    validations.push(ValidationHelper.isRequired(d.description, 'description'));
    if (d.description) {
      validations.push(ValidationHelper.minLength(d.description, 'description', 20));
      validations.push(ValidationHelper.maxLength(d.description, 'description', 2000));
    }

    // Photo validations
    validations.push(ValidationHelper.isRequired(d.photo, 'photo'));
    if (d.photo instanceof File) {
      validations.push(ValidationHelper.isValidFileType(d.photo, 'photo', 'image/*'));
    } else if (id && !d.photo) {
      // Skip photo validation on edit if no new photo uploaded
      validations.pop();
    }

    // Optional fields
    if (d.slug) validations.push(ValidationHelper.minLength(d.slug, 'slug', 3));

    const validationErrors = ValidationHelper.validate(validations);

    if (validationErrors.length > 0) {
      // Only set the first error per field so required errors are not overridden
      const seen = new Set<string>();
      for (const err of validationErrors) {
        const key = String(err.field).toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        const fieldName = key as keyof CategoryFormData;
        setError(fieldName, {
          type: 'manual',
          message: err.message,
        });
      }
      toast.error('Please fix validation errors');
      return;
    }		try {
			const formData = new FormData();
			Object.entries(data).forEach(([key, value]) => {
				if (value instanceof File) {
					formData.append(key, value);
				} else {
					formData.append(key, String(value));
				}
			});

			if (id) {
				await updateCategory(id, formData);
				await Swal.fire({
					title: 'Success!',
					text: 'Category updated successfully',
					icon: 'success',
					confirmButtonColor: 'var(--puprle-color)',
				});
			} else {
				await addCategory(formData);
				await Swal.fire({
					title: 'Success!',
					text: 'Category added successfully',
					icon: 'success',
					confirmButtonColor: 'var(--puprle-color)',
				});
			}
			navigate('/category');
		} catch (error: any) {
			const errorData = error?.response?.data || {};
			if (errorData.errors && Array.isArray(errorData.errors)) {
				errorData.errors.forEach((err: { path: string; message: string }) => {
					toast.error(`${err.path}: ${err.message}`);
				});
			} else {
				toast.error(errorData.message || 'Something went wrong');
			}
		}
	};


	return (
		<div className="p-6">
			<FormHeader
				managementName="Category"
				addButtonLink="/category"
				type={id ? 'Edit' : 'Add'}
			/>
			<ToastContainer position="top-right" autoClose={3000} />
			<FormProvider {...methods}>
				<ManagementForm
					label={id ? 'Update' : 'Save'}
					fields={CategoryFields}
					isSubmitting={isSubmitting}
					onSubmit={handleSubmit(onSubmit)}
					data-testid="category-form"
					existingFiles={{
						photo: existingCategoryData?.photo ?? '',
					}}
					onFieldChange={{
						name: handleFieldChange('name', 3),
						slug: handleFieldChange('slug', 3),
						description: handleFieldChange('description', 5),
						photo: handleFieldChange('photo'),
						isFeatured: handleFieldChange('isFeatured'),
					}}
				/>
			</FormProvider>
		</div>
	);
};

export default CategoryFormTemplate;

