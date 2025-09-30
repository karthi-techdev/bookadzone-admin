import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useAgencyStore } from '../../stores/AgencyStore';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';
import { agencyFields } from '../../utils/fields/agencyFields';
import ValidationHelper from '../../utils/validationHelper';
import Swal from 'sweetalert2';

type AgencyFormData = {
  agencyName: string;
  name: string;
  position: string;
  yourEmail: string;
  yourPhone: string;
  companyEmail: string;
  companyPhone: string;
  companyRegistrationNumberGST: string;
  website: string;
  agencyAddress: string;
  agencyLocation: string;
  state: string;
  city: string;
  pincode: string;
  password: string;
  agencyLogo: File | string;
  photo: File | string;
  uploadIdProof: File | string;
  uploadBusinessProof: File | string;
};

const AgencyFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchAgencyById, addAgency, updateAgency } = useAgencyStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [existingAgencyData, setExistingAgencyData] = useState<any>(null);

  const methods = useForm<AgencyFormData>({
    defaultValues: {
      agencyName: '',
      name: '',
      position: '',
      yourEmail: '',
      yourPhone: '',
      companyEmail: '',
      companyPhone: '',
      companyRegistrationNumberGST: '',
      website: '',
      agencyAddress: '',
      agencyLocation: '',
      state: '',
      city: '',
      pincode: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const { handleSubmit, reset, setError, clearErrors, setValue, formState: { errors, isSubmitting } } = methods;

  // Fetch agency data if editing
  useEffect(() => {
    if (id && !isInitialized) {
      const fetchData = async () => {
        const agency = await fetchAgencyById(id);
        if (agency) {
          setExistingAgencyData(agency);
          reset({
            agencyName: agency.agencyName || '',
            name: agency.name || '',
            position: agency.position || '',
            yourEmail: agency.yourEmail || '',
            yourPhone: agency.yourPhone || '',
            companyEmail: agency.companyEmail || '',
            companyPhone: agency.companyPhone || '',
            companyRegistrationNumberGST: agency.companyRegistrationNumberGST || '',
            website: agency.website || '',
            agencyAddress: agency.agencyAddress || '',
            agencyLocation: agency.agencyLocation || '',
            state: agency.state || '',
            city: agency.city || '',
            pincode: agency.pincode || '',
            password: agency.password || '',
            agencyLogo: agency.agencyLogo || '',
            photo: agency.photo || '',
            uploadIdProof: agency.uploadIdProof || '',
            uploadBusinessProof: agency.uploadBusinessProof || '',
          });
          setIsInitialized(true);
        } else {
          toast.error('Failed to load agency data');
        }
      };
      fetchData();
    }
  }, [id, fetchAgencyById, reset, isInitialized]);

  const handleFieldChange = (fieldName: keyof AgencyFormData, minLength?: number) => (e: { target: { name: string; value: any } }) => {
    const value = e.target.value;
    const field = agencyFields.find(f => f.name === fieldName);
    
    if (!field) return;

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
      if (field.type === 'email') {
        validations.push(ValidationHelper.isValidEmail(value, fieldName));
      }
      
      if (field.type === 'password') {
        validations.push(ValidationHelper.isValidPassword(value, fieldName));
      }
      
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

  const onSubmit = async (data: AgencyFormData) => {
    clearErrors();

    const validationErrors = ValidationHelper.validate([
      ValidationHelper.isRequired(data.agencyName, 'agencyName'),
      ValidationHelper.minLength(data.agencyName, 'agencyName', 3),
      ValidationHelper.isRequired(data.name, 'name'),
      ValidationHelper.minLength(data.name, 'name', 3),
      ValidationHelper.isRequired(data.position, 'position'),
      ValidationHelper.isRequired(data.yourEmail, 'yourEmail'),
      ValidationHelper.isValidEmail(data.yourEmail, 'yourEmail'),
      ValidationHelper.isRequired(data.yourPhone, 'yourPhone'),
      ValidationHelper.minLength(data.yourPhone, 'yourPhone', 10),
      ValidationHelper.isRequired(data.companyEmail, 'companyEmail'),
      ValidationHelper.isValidEmail(data.companyEmail, 'companyEmail'),
      ValidationHelper.isRequired(data.companyPhone, 'companyPhone'),
      ValidationHelper.minLength(data.companyPhone, 'companyPhone', 10),
      ValidationHelper.isRequired(data.companyRegistrationNumberGST, 'companyRegistrationNumberGST'),
      ValidationHelper.isRequired(data.website, 'website'),
      ValidationHelper.isRequired(data.agencyAddress, 'agencyAddress'),
      ValidationHelper.isRequired(data.agencyLocation, 'agencyLocation'),
      ValidationHelper.isRequired(data.state, 'state'),
      ValidationHelper.isRequired(data.city, 'city'),
      ValidationHelper.isRequired(data.pincode, 'pincode'),
      ValidationHelper.isRequired(data.password, 'password'),
      ValidationHelper.isValidPassword(data.password, 'password'),
      ValidationHelper.isRequired(data.agencyLogo, 'agencyLogo'),
      data.agencyLogo instanceof File ? ValidationHelper.isValidFileType(data.agencyLogo, 'agencyLogo', 'image/*') : null,
      ValidationHelper.isRequired(data.photo, 'photo'),
      data.photo instanceof File ? ValidationHelper.isValidFileType(data.photo, 'photo', 'image/*') : null,
      ValidationHelper.isRequired(data.uploadIdProof, 'uploadIdProof'),
      data.uploadIdProof instanceof File ? ValidationHelper.isValidFileType(data.uploadIdProof, 'uploadIdProof', 'image/*,.pdf,.doc,.docx') : null,
      ValidationHelper.isRequired(data.uploadBusinessProof, 'uploadBusinessProof'),
      data.uploadBusinessProof instanceof File ? ValidationHelper.isValidFileType(data.uploadBusinessProof, 'uploadBusinessProof', 'image/*,.pdf,.doc,.docx') : null,
    ]);

    if (validationErrors.length > 0) {
      validationErrors.forEach((err) => {
        const fieldName = err.field as keyof AgencyFormData;
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
        await updateAgency(id, formData);
        await Swal.fire({
          title: 'Success!',
          text: 'Agency updated successfully',
          icon: 'success',
          confirmButtonColor: 'var(--puprle-color)',
        });
      } else {
        await addAgency(formData);
        await Swal.fire({
          title: 'Success!',
          text: 'Agency added successfully',
          icon: 'success',
          confirmButtonColor: 'var(--puprle-color)',
        });
      }
      navigate('/agency');
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

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="p-6">
      <FormHeader
        managementName="Agency"
        addButtonLink="/agency"
        type={id ? 'Edit' : 'Add'}
      />
      <ToastContainer position="top-right" autoClose={3000} />
      <FormProvider {...methods}>
        <ManagementForm
          label={id ? 'Update' : 'Save'}
          fields={agencyFields}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit(onSubmit)}
          data-testid="agency-form"
          extraProps={{
            togglePassword,
            showPassword,
          }}
          existingFiles={{
            agencyLogo: existingAgencyData?.agencyLogo ?? '',
            photo: existingAgencyData?.photo ?? '',
            uploadIdProof: existingAgencyData?.uploadIdProof ?? '',
            uploadBusinessProof: existingAgencyData?.uploadBusinessProof ?? '',
          }}
          onFieldChange={{
            agencyName: handleFieldChange('agencyName', 3),
            name: handleFieldChange('name', 3),
            position: handleFieldChange('position'),
            yourEmail: handleFieldChange('yourEmail'),
            yourPhone: handleFieldChange('yourPhone', 10),
            companyEmail: handleFieldChange('companyEmail'),
            companyPhone: handleFieldChange('companyPhone', 10),
            companyRegistrationNumberGST: handleFieldChange('companyRegistrationNumberGST'),
            website: handleFieldChange('website'),
            agencyAddress: handleFieldChange('agencyAddress'),
            agencyLocation: handleFieldChange('agencyLocation'),
            state: handleFieldChange('state'),
            city: handleFieldChange('city'),
            pincode: handleFieldChange('pincode'),
            password: handleFieldChange('password'),
            agencyLogo: handleFieldChange('agencyLogo'),
            photo: handleFieldChange('photo'),
            uploadIdProof: handleFieldChange('uploadIdProof'),
            uploadBusinessProof: handleFieldChange('uploadBusinessProof'),
          }}
        />
      </FormProvider>
    </div>
  );
};

export default AgencyFormTemplate;