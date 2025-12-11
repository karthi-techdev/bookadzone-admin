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
    const d = normalizeFormValues(data);

    const validations: any[] = [];

    // ✅ Logo required (Add form)
    if (!id && !(d.logo instanceof File)) {
      validations.push({ field: 'logo', message: 'Logo file is required' });
    }

    // ✅ Description validation
    validations.push(ValidationHelper.isRequired(d.description, 'description'));
    validations.push(ValidationHelper.isRequired(d.socialmedia, 'socialmedia'));
    validations.push(ValidationHelper.isRequired(d.socialmedialinks, 'socialmedialinks'));
    validations.push(ValidationHelper.isRequired(d.google, 'google'));
    validations.push(ValidationHelper.isRequired(d.appstore, 'appstore'));




    if (d.description) {
      validations.push(ValidationHelper.minLength(d.description, 'description', 5));
      validations.push(ValidationHelper.maxLength(d.description, 'description', 2000));

    }
    // ✅ Other optional fields
    if (d.socialmedia)
      validations.push(ValidationHelper.maxLength(d.socialmedia, 'socialmedia', 500));
    if (d.socialmedialinks)
      validations.push(ValidationHelper.maxLength(d.socialmedialinks, 'socialmedialinks', 500));
    if (d.google)
      validations.push(ValidationHelper.maxLength(d.google, 'google', 500));
    if (d.appstore)
      validations.push(ValidationHelper.maxLength(d.appstore, 'appstore', 500));

    // ✅ File validation (if present)
    if (d.logo instanceof File) {
      validations.push(
        ValidationHelper.isValidFileType(d.logo, 'logo', 'image/*'),
        d.logo.size <= 1 * 1024 * 1024
          ? null
          : { field: 'logo', message: 'Logo file size must be less than 1MB' }
      );
    }

    // ✅ Collect all validation errors
    const validationErrors = ValidationHelper.validate(validations.filter(Boolean));

    if (validationErrors.length > 0) {
      const seen = new Set<string>();

      validationErrors.forEach((err) => {
        const key = String(err.field).toLowerCase().trim(); // force match form keys
        if (seen.has(key)) return;
        seen.add(key);

        setError(key as keyof FooterFormData, {
          type: 'manual',
          message: err.message,
        });
      });

      return; // stop submission if there are validation errors
    }

    // ✅ Build FormData
    const formData = new FormData();
    if (d.logo instanceof File) formData.append('logo', d.logo);
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
          setError(err.path as keyof FooterFormData, { type: 'server', message: err.message });
        });
        return;
      }
      toast.error(errorData.message || 'Something went wrong');
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