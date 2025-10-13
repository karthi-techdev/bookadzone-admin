import React, { useEffect, useState } from 'react';
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
};

const FooterFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchFooterById, addFooter, updateFooter } = useFooterStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [existingData, setExistingData] = useState<any>(null);

  const methods = useForm<FooterFormData>({
    defaultValues: {
      logo: '',
      description: '',
      socialmedia: '',
      socialmedialinks: '',
      google: '',
      appstore: '',
      status: true,
    },
    mode: 'onSubmit',
  });

  const { handleSubmit, reset, setError, clearErrors, formState: { errors, isSubmitting } } = methods;

  const handleFieldChange = (fieldName: keyof FooterFormData, minLength?: number) => (e: { target: { name: string; value: any; files?: FileList; checked?: boolean } }) => {
    const rawValue = fieldName === 'logo' && e.target.files 
      ? e.target.files[0] 
      : fieldName === 'status' && typeof e.target.checked !== 'undefined'
      ? e.target.checked
      : e.target.value;

    const valueForValidation = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

    const field = footerFields.find(f => f.name === fieldName);
    if (!field) return;

    const validations: any[] = [];
    
    // Required should consider trimmed value to avoid secondary validations first
    if (field.required) {
      const requiredError = ValidationHelper.isRequired(valueForValidation, fieldName);
      if (requiredError) {
        setError(fieldName, {
          type: 'manual',
          message: requiredError.message,
        });
        methods.setValue(fieldName, rawValue, { shouldValidate: false });
        return;
      }
    }

    if (valueForValidation) {
      if (fieldName === 'logo' && rawValue instanceof File) {
        validations.push(
          ValidationHelper.isValidFileType(rawValue, 'Logo', 'image/*'),
          rawValue.size <= 1 * 1024 * 1024
            ? null
            : { field: 'Logo', message: 'Logo file size must be less than 1MB' }
        );
      }
      
      if (minLength && typeof valueForValidation === 'string') {
        validations.push(ValidationHelper.minLength(valueForValidation, fieldName, minLength));
      }
    }

    const errorsArr = ValidationHelper.validate(validations.filter(Boolean));
    
    if (errorsArr.length > 0) {
      setError(fieldName, {
        type: 'manual',
        message: errorsArr[0].message,
      });
    } else {
      clearErrors(fieldName);
    }
    
    methods.setValue(fieldName, rawValue, { shouldValidate: false });
  };


  useEffect(() => {
    if (id && !isInitialized) {
      const fetchData = async () => {
        try {
          const footer = await fetchFooterById(id);
          if (footer) {
            setExistingData(footer);
            reset({
              logo: '',
              description: footer.description || '',
              socialmedia: footer.socialmedia || '',
              socialmedialinks: footer.socialmedialinks || '',
              google: footer.google || '',
              appstore: footer.appstore || '',
              status: typeof footer.status === 'boolean' ? footer.status : footer.status === 'active',
            });
            setIsInitialized(true);
          } else {
            toast.error('Failed to load footer data');
          }
        } catch (error) {
          toast.error('Error fetching footer data');
        }
      };
      fetchData();
    }
  }, [id, fetchFooterById, reset, isInitialized]);

  const onSubmit = async (data: FooterFormData) => {
    clearErrors();

    // Normalize values (trim strings)
    const d = normalizeFormValues(data);

    // Validate logo requirement for new entries
    if (!id && !(d.logo instanceof File)) {
      setError('logo', { type: 'manual', message: 'Logo file is required' });
      toast.error('Please upload a logo file');
      return;
    }

    const formData = new FormData();

    // Handle file fields
    if (d.logo instanceof File) {
      formData.append('logo', d.logo);
    }

    // Handle text fields with validation
    const validations = [
      ValidationHelper.isRequired(d.description, 'Description'),
      d.description ? ValidationHelper.minLength(d.description, 'Description', 5) : null,
      d.description ? ValidationHelper.maxLength(d.description, 'Description', 2000) : null,
      d.socialmedia ? ValidationHelper.maxLength(d.socialmedia, 'Social Media', 500) : null,
      d.socialmedialinks ? ValidationHelper.maxLength(d.socialmedialinks, 'Social Media Links', 500) : null,
      d.google ? ValidationHelper.maxLength(d.google, 'Google', 500) : null,
      d.appstore ? ValidationHelper.maxLength(d.appstore, 'App Store', 500) : null,
    ].filter(Boolean);

    const validationErrors = ValidationHelper.validate(validations);

    if (validationErrors.length > 0) {
      // Only set the first error per field so required errors are not overridden
      const seen = new Set<string>();
      for (const err of validationErrors) {
        const key = String(err.field).toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        const fieldName = key as keyof FooterFormData;
        setError(fieldName, {
          type: 'manual',
          message: err.message,
        });
      }
      toast.error('Please fix all validation errors');
      return;
    }

    // Append form data
    formData.append('description', d.description);
    if (d.socialmedia) formData.append('socialmedia', d.socialmedia);
    if (d.socialmedialinks) formData.append('socialmedialinks', d.socialmedialinks);
    if (d.google) formData.append('google', d.google);
    if (d.appstore) formData.append('appstore', d.appstore);
    formData.append('status', d.status ? 'active' : 'inactive');

    try {
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
      navigate('/footerinfo');
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

  // Normalize values to trim strings
  const normalizeFormValues = (values: FooterFormData): FooterFormData => {
    const normalized: any = {};
    Object.entries(values).forEach(([k, v]) => {
      normalized[k] = typeof v === 'string' ? v.trim() : v;
    });
    return normalized as FooterFormData;
  };

  // Ensure centralized submit validation runs even when form is invalid
  const onInvalid = () => {
    const values = methods.getValues();
    return onSubmit(values);
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="Footer"
        addButtonLink="/footerinfo"
        type={id ? 'Edit' : 'Add'}
      />
      <ToastContainer position="top-right" autoClose={3000} />
      
      <FormProvider {...methods}>
        <ManagementForm
          label={id ? 'Update' : 'Save'}
          fields={footerFields}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          data-testid="footer-form"
          onFieldChange={{
            logo: handleFieldChange('logo'),
            description: handleFieldChange('description', 5),
            socialmedia: handleFieldChange('socialmedia'),
            socialmedialinks: handleFieldChange('socialmedialinks'),
            google: handleFieldChange('google'),
            appstore: handleFieldChange('appstore'),
            status: handleFieldChange('status'),
          }}
          existingFiles={{
            logo: existingData?.logo || '',
          }}
        />
      </FormProvider>
    </div>
  );
};

export default FooterFormTemplate;