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
	slug: string;
	isFeatured?: boolean;
	description: string;
	photo: File | string;
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
			isFeatured: true,
			description: '',
			photo: '',
		},
		mode: 'onSubmit',
	});

	const { handleSubmit, reset, setError, clearErrors, setValue, formState: { errors, isSubmitting } } = methods;

	useEffect(() => {
		if (id && !isInitialized) {
			const fetchData = async () => {
				const category = await fetchCategoryById(id);
				if (category) {
					setExistingCategoryData(category);
					reset({
						name: category.name || '',
						slug: category.slug || '',
						description: category.description || '',
						isFeatured: typeof category.isFeatured === 'boolean' ? category.isFeatured : category.isFeatured === 'active',
						photo: category.photo || '',
					});
					setIsInitialized(true);
				} else {
					toast.error('Failed to load category data');
				}
			};
			fetchData();
		}
	}, [id, fetchCategoryById, reset, isInitialized]);

	const handleFieldChange = (fieldName: keyof CategoryFormData, minLength?: number) => (e: { target: { name: string; value: any } }) => {
			let value = e.target.value;
			const field = CategoryFields.find(f => f.name === fieldName);
			if (!field) return;

			// Auto-generate slug from name
			if (fieldName === 'name' && typeof value === 'string') {
				const slugValue = value.replace(/\s+/g, '-').toLowerCase();
				setValue('slug', slugValue, { shouldValidate: false });
			}

			const validations = [];
			if (field.required) {
				const requiredError = ValidationHelper.isRequired(value, fieldName);
				if (requiredError) {
					setError(fieldName, {
						type: 'manual',
						message: requiredError.message,
					});
					setValue(fieldName, value, { shouldValidate: false });
					return;
				}
			}
			if (value) {
				if (minLength && typeof value === 'string') {
					validations.push(ValidationHelper.minLength(value, fieldName, minLength));
				}
			}
			if (field.type === 'file' && value instanceof File) {
				validations.push(ValidationHelper.isValidFileType(value, fieldName, field.accept || ''));
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
			setValue(fieldName, value, { shouldValidate: false });
	};

	const onSubmit = async (data: CategoryFormData) => {
		clearErrors();
		const validationErrors = ValidationHelper.validate([
			ValidationHelper.isRequired(data.name, 'name'),
			ValidationHelper.minLength(data.name, 'name', 3),
			ValidationHelper.isRequired(data.slug, 'slug'),
			ValidationHelper.isRequired(data.description, 'description'),
			ValidationHelper.minLength(data.description, 'description', 5),
			ValidationHelper.isRequired(data.photo, 'photo'),
			data.photo instanceof File ? ValidationHelper.isValidFileType(data.photo, 'photo', 'image/*') : null,
		]);
		if (validationErrors.length > 0) {
			validationErrors.forEach((err) => {
				const fieldName = err.field as keyof CategoryFormData;
				setError(fieldName, {
					type: 'manual',
					message: err.message,
				});
			});
			toast.error('Please fix all validation errors');
			return;
		}
		try {
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
