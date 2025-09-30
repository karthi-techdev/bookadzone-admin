import React, { useEffect, useState, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useFooterStore } from '../../stores/FooterInfoStore';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';
import { footerFields } from '../../utils/fields/FooterinfoFields';
import ValidationHelper from '../../utils/validationHelper';
import Swal from 'sweetalert2';

type FooterFormData = {
  logo: File | string;
  description: string;
  socialmedia: string;
  socialmedialinks?: string;
  google?: string;
  appstore?: string;
  status?: boolean;
  priority: number;
};

const getNestedError = (errors: any, path: string): any => {
  return path.split('.').reduce((acc: any, part: string) => {
    return acc && part in acc ? acc[part] : undefined;
  }, errors);
};

const FooterFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchFooterById, addFooter, updateFooter } = useMemo(
    () => ({
      fetchFooterById: useFooterStore.getState().fetchFooterById,
      addFooter: useFooterStore.getState().addFooter,
      updateFooter: useFooterStore.getState().updateFooter,
    }),
    []
  );

  const [isInitialized, setIsInitialized] = useState(false);
  const [existingLogoPath, setExistingLogoPath] = useState<string>('');

  const methods = useForm<FooterFormData>({
    defaultValues: {
      logo: '',
      description: '',
      socialmedia: '',
      socialmedialinks: '',
      google: '',
      appstore: '',
      status: true,
      priority: 1,
    },
    mode: 'onSubmit',
  });

  const { handleSubmit, reset, setError, clearErrors, formState: { errors, isSubmitting } } = methods;

  const handleFieldChange = (fieldName: keyof FooterFormData, minLengthValue?: number, maxValue?: number) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    let value: any = fieldName === 'logo' && 'files' in e.target && e.target.files ? e.target.files[0] : e.target.value;
    if (fieldName === 'logo') {
      console.log(`Logo field changed:`, {
        value: value instanceof File ? { name: value.name, size: value.size, type: value.type } : value,
        isFile: value instanceof File,
      });
    }
    if (fieldName === 'status' && 'checked' in e.target) {
      value = e.target.checked;
      console.log(`Status field changed:`, { value });
    } else if (fieldName === 'priority') {
      value = parseInt(e.target.value, 10) || 1;
      console.log(`Priority field changed:`, { value });
    }

    const validations = [];
    
    // Logo validation - only required for new entries (not updates)
    if (fieldName === 'logo') {
      // For new entries, logo file is required
      if (!id && !value) {
        validations.push(ValidationHelper.isRequired(value, 'Logo'));
      }
      // For file uploads, validate file properties
      if (value instanceof File) {
        validations.push(
          value.size <= 1 * 1024 * 1024
            ? null
            : { field: 'Logo', message: 'Logo file size must be less than 1MB' }
        );
        validations.push(
          ['image/jpeg', 'image/png'].includes(value.type)
            ? null
            : { field: 'Logo', message: 'Logo must be a JPEG or PNG file' }
        );
      }
    } else {
      // Other field validations
      validations.push(ValidationHelper.isRequired(value, fieldName.charAt(0).toUpperCase() + fieldName.slice(1)));
    }
    
    if (minLengthValue && typeof value === 'string') {
      validations.push(ValidationHelper.minLength(value, fieldName.charAt(0).toUpperCase() + fieldName.slice(1), minLengthValue));
    }
    if (maxValue && typeof value === 'number') {
      validations.push(ValidationHelper.maxValue(value, fieldName.charAt(0).toUpperCase() + fieldName.slice(1), maxValue));
    }

    const errorsArr = ValidationHelper.validate(validations.filter(Boolean));
    if (errorsArr.length > 0) {
      console.log(`Validation errors for ${fieldName}:`, errorsArr);
      setError(fieldName, {
        type: 'manual',
        message: errorsArr[0].message,
      });
    } else {
      clearErrors(fieldName);
    }
    methods.setValue(fieldName, value, { shouldValidate: false });
  };

  useEffect(() => {
    if (id && !isInitialized) {
      const fetchData = async () => {
        try {
          console.log(`Fetching footer data for ID: ${id}`);
          const footer = await fetchFooterById(id);
          if (footer) {
            console.log(`Footer data fetched:`, footer);
            // Store the existing logo path separately
            setExistingLogoPath(typeof footer.logo === 'string' ? footer.logo : '');
            reset({
              logo: '', // Don't set the existing logo as the form value
              description: footer.description || '',
              socialmedia: footer.socialmedia || '',
              socialmedialinks: footer.socialmedialinks || '',
              google: footer.google || '',
              appstore: footer.appstore || '',
              status: typeof footer.status === 'boolean' ? footer.status : footer.status === 'active',
              priority: footer.priority || 1,
            });
            setIsInitialized(true);
          } else {
            console.log(`No footer data found for ID: ${id}`);
            toast.error('Failed to load footer data');
          }
        } catch (error) {
          console.error(`Error fetching footer data for ID: ${id}`, error);
          toast.error('Error fetching footer data');
        }
      };
      fetchData();
    }
  }, [id, fetchFooterById, reset, isInitialized]);

  const onSubmit = async (data: FooterFormData) => {
    console.log(`Form submitted with data:`, data);
    clearErrors();

    // For new entries, logo file is required
    if (!id && !(data.logo instanceof File)) {
      console.log(`Logo validation failed: No file provided for new entry`);
      setError('logo', { type: 'manual', message: 'Logo file is required' });
      toast.error('Please upload a logo file');
      return;
    }

    const formData = new FormData();
    
    // Handle logo field
    if (data.logo instanceof File) {
      console.log(`Appending logo file to FormData:`, {
        name: data.logo.name,
        size: data.logo.size,
        type: data.logo.type,
      });
      formData.append('logo', data.logo);
    } else if (id && existingLogoPath) {
      console.log(`No new logo file provided for update, keeping existing logo: ${existingLogoPath}`);
    
    }

  
    formData.append('description', data.description.trim());
    if (data.socialmedia) formData.append('socialmedia', data.socialmedia.trim());
    if (data.socialmedialinks) formData.append('socialmedialinks', data.socialmedialinks.trim());
    if (data.google) formData.append('google', data.google.trim());
    if (data.appstore) formData.append('appstore', data.appstore.trim());
    formData.append('status', data.status ? 'active' : 'inactive');
    formData.append('priority', data.priority.toString());

    


    const validationErrors = ValidationHelper.validate([
   
      !id && !(data.logo instanceof File) ? ValidationHelper.isRequired(data.logo, 'Logo') : null,
      ValidationHelper.isRequired(data.description, 'Description'),
      data.description ? ValidationHelper.minLength(data.description, 'Description', 5) : null,
      data.description ? ValidationHelper.maxLength(data.description, 'Description', 2000) : null,
      data.socialmedia ? ValidationHelper.minLength(data.socialmedia, 'Social Media', 1) : null,
      data.socialmedia ? ValidationHelper.maxLength(data.socialmedia, 'Social Media', 500) : null,
      data.socialmedialinks ? ValidationHelper.minLength(data.socialmedialinks, 'Social Media Links', 1) : null,
      data.socialmedialinks ? ValidationHelper.maxLength(data.socialmedialinks, 'Social Media Links', 500) : null,
      data.google ? ValidationHelper.minLength(data.google, 'Google', 1) : null,
      data.google ? ValidationHelper.maxLength(data.google, 'Google', 500) : null,
      data.appstore ? ValidationHelper.minLength(data.appstore, 'App Store', 1) : null,
      data.appstore ? ValidationHelper.maxLength(data.appstore, 'App Store', 500) : null,
      ValidationHelper.isRequired(data.priority, 'Priority'),
      ValidationHelper.maxValue(data.priority, 'Priority', 100),
      ValidationHelper.isValidEnum(
        data.status ? 'active' : 'inactive',
        'Status',
        ['active', 'inactive']
      ),
    ].filter(Boolean));

    if (validationErrors.length > 0) {
      console.log(`Form validation errors:`, validationErrors);
      validationErrors.forEach((err) => {
        const fieldName = err.field.toLowerCase() as keyof FooterFormData;
        setError(fieldName, {
          type: 'manual',
          message: err.message,
        });
      });
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      console.log(`Submitting ${id ? 'update' : 'create'} request for footer`);
      if (id) {
        await updateFooter(id, formData);
        await Swal.fire({
          title: 'Success!',
          text: 'Footer updated successfully',
          icon: 'success',
          confirmButtonColor: 'var(--puprle-color)',
        });
      } else {
        await addFooter(formData);
        await Swal.fire({
          title: 'Success!',
          text: 'Footer added successfully',
          icon: 'success',
          confirmButtonColor: 'var(--puprle-color)',
        });
      }
      console.log(`Footer ${id ? 'updated' : 'created'} successfully, navigating to /footerinfo`);
      navigate('/footerinfo');
    } catch (error: any) {
      console.error(`Error during form submission:`, error);
      const errorData = error?.response?.data || {};
      if (error?.response?.status === 409 && errorData.message?.includes('already exists')) {
        console.log(`Conflict error:`, errorData.message);
        toast.error(errorData.message);
        return;
      }
      if (errorData.errors && Array.isArray(errorData.errors)) {
        console.log(`Validation errors from backend:`, errorData.errors);
        errorData.errors.forEach((err: { path: string; message: string }) => {
          toast.error(`${err.path}: ${err.message}`);
        });
      } else if (typeof error === 'string') {
        console.log(`String error:`, error);
        toast.error(error);
      } else if (error?.message) {
        console.log(`Error message:`, error.message);
        toast.error(error.message);
      } else {
        const message = errorData.message || 'Something went wrong';
        console.log(`Generic error:`, message);
        toast.error(message);
      }
    }
  };

  const hasErrors = () => {
    const hasError = footerFields.some(field => {
      const error = getNestedError(errors, field.name);
      return error?.message !== undefined;
    });
    if (hasError) {
      console.log(`Form has errors:`, errors);
    }
    return hasError;
  };

  return (
    <div className="p-6">
      <FormHeader
         managementName="Footer"
        addButtonLink="/footer"
        type={id ? 'Edit' : 'Add'}
      />
      <ToastContainer position="top-right" autoClose={3000} />
     
      
      <FormProvider {...methods}>
        <ManagementForm
          label={id ? 'Update' : 'Save'}
          fields={footerFields}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit(onSubmit)}
          data-testid="footer-form"
          onFieldChange={{
            logo: handleFieldChange('logo'),
            description: handleFieldChange('description', 5),
            socialmedia: handleFieldChange('socialmedia', 1),
            socialmedialinks: handleFieldChange('socialmedialinks', 1),
            google: handleFieldChange('google', 1),
            appstore: handleFieldChange('appstore', 1),
            status: handleFieldChange('status'),
            priority: handleFieldChange('priority', undefined, 100),
          }}
        />
        {hasErrors() && (
          <div className="text-red-500 text-sm mt-2">
            Please fix the errors before proceeding.
          </div>
        )}
      </FormProvider>
    </div>
  );
};

export default React.memo(FooterFormTemplate)