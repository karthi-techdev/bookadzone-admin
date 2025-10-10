import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useAgencyStore } from '../../stores/AgencyStore';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';
import { agencyFields } from '../../utils/fields/agencyFields';
import { getStatesOfCountry, getCitiesOfState, getAllCountries } from '../../utils/helper';
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
  country: string;
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
  const [isCheckingEmails, setIsCheckingEmails] = useState(false);
  const countryOptions = useMemo(() => getAllCountries(), []);
  const [stateOptions, setStateOptions] = useState<{ label: string; value: string }[]>([]);
  const [cityOptions, setCityOptions] = useState<{ label: string; value: string }[]>([]);
  const cityCache = useRef<{ [key: string]: { label: string; value: string }[] }>({});

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
      country: countryOptions.find(c => c.value === 'IN')?.value || (countryOptions[0]?.value ?? ''),
      state: '',
      city: '',
      pincode: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  // Set default country if not set
  useEffect(() => {
    const defaultCountry = countryOptions.find(c => c.value === 'IN')?.value || (countryOptions[0]?.value ?? '');
    if (methods.getValues('country') !== defaultCountry) {
      methods.setValue('country', defaultCountry);
    }
  }, [countryOptions, methods]);

  // Update state options when country changes
  useEffect(() => {
    const subscription = methods.watch((values, { name }) => {
      if (name === 'country') {
        const selectedCountry = values.country || 'IN';
        const states = getStatesOfCountry(selectedCountry);
        setStateOptions(states);
        if (values.state && !states.find(s => s.value === values.state)) {
          methods.setValue('state', '', { shouldDirty: false });
          methods.setValue('city', '', { shouldDirty: false });
          setCityOptions([]);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  // Update city options when state changes
  useEffect(() => {
    const subscription = methods.watch((values, { name }) => {
      if (name === 'state') {
        const selectedCountry = values.country || 'IN';
        const selectedState = values.state;
        if (selectedCountry && selectedState) {
          const cacheKey = `${selectedCountry}_${selectedState}`;
          if (cityCache.current[cacheKey]) {
            setCityOptions(cityCache.current[cacheKey]);
          } else {
            const cities = getCitiesOfState(selectedCountry, selectedState);
            cityCache.current[cacheKey] = cities;
            setCityOptions(cities);
          }
          if (!cityCache.current[cacheKey]?.find(c => c.value === values.city)) {
            methods.setValue('city', '', { shouldDirty: false });
          }
        } else {
          setCityOptions([]);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  const { handleSubmit, reset, setError, clearErrors, setValue, formState: { errors, isSubmitting } } = methods;

  // Fetch agency data if editing
  useEffect(() => {
    setStateOptions(getStatesOfCountry('IN'));
  }, []);

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
            country: agency.country || '',
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
          if (agency.state) {
            setCityOptions(getCitiesOfState('IN', agency.state));
          }
        } else {
          toast.error('Failed to load agency data');
        }
      };
      fetchData();
    }
  }, [id, fetchAgencyById, reset, isInitialized]);

  // Update cities when state changes
  useEffect(() => {
    const subscription = methods.watch((values) => {
      if (values.state) {
        setCityOptions(getCitiesOfState('IN', values.state));
      } else {
        setCityOptions([]);
      }
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  const handleFieldChange = (fieldName: keyof AgencyFormData, minLength?: number) => (e: { target: { name: string; value: any } }) => {
    const rawValue = e.target.value;
    const valueForValidation = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
    const field = agencyFields.find(f => f.name === fieldName);
    
    if (!field) return;

    const validations = [] as any[];
    
    if (field.required) {
      const requiredError = ValidationHelper.isRequired(valueForValidation, fieldName);
      if (requiredError) {
        setError(fieldName, {
          type: 'manual',
          message: requiredError.message,
        });
        setValue(fieldName, rawValue, { shouldValidate: false });
        return;
      }
    }
    
    if (valueForValidation) {
      if (field.type === 'email') {
        validations.push(ValidationHelper.isValidEmail(valueForValidation, fieldName));
      }
      
      if (field.type === 'password') {
        validations.push(ValidationHelper.isValidPassword(valueForValidation, fieldName));
      }
      
      if (minLength && typeof valueForValidation === 'string') {
        validations.push(ValidationHelper.minLength(valueForValidation, fieldName, minLength));
      }
    }

    if (field.type === 'file' && rawValue instanceof File) {
      validations.push(ValidationHelper.isValidFileType(rawValue, fieldName, field.accept || ''));
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
  };

  // Real-time email check on blur
  const handleEmailBlur = async (fieldName: 'yourEmail' | 'companyEmail') => {
    const yourEmail = methods.getValues('yourEmail');
    const companyEmail = methods.getValues('companyEmail');
    
    // Only check if both emails are filled and valid
    if (!yourEmail || !companyEmail) return;
    
    // Skip if emails haven't changed in edit mode
    if (id && existingAgencyData) {
      if (fieldName === 'yourEmail' && yourEmail === existingAgencyData.yourEmail) return;
      if (fieldName === 'companyEmail' && companyEmail === existingAgencyData.companyEmail) return;
    }

    // Clear previous email errors
    clearErrors('yourEmail');
    clearErrors('companyEmail');

    try {
      setIsCheckingEmails(true);
      const emailCheck = await useAgencyStore.getState().checkEmailsExist(yourEmail, companyEmail, id);
      
      if (emailCheck.yourEmailExists) {
        setError('yourEmail', {
          type: 'manual',
          message: 'This personal email is already registered'
        });
      }
      
      if (emailCheck.companyEmailExists) {
        setError('companyEmail', {
          type: 'manual',
          message: 'This company email is already registered'
        });
      }
    } catch (error) {
      console.error('Error checking emails:', error);
    } finally {
      setIsCheckingEmails(false);
    }
  };
  const onSubmit = async (data: AgencyFormData) => {
    clearErrors();

    // Prevent double submission
    if (isCheckingEmails) {
      toast.error('Please wait while we verify email availability');
      return;
    }

    // Normalize values
    const d = normalizeFormValues(data);

    // Validate all fields
    const validations: any[] = [];
    validations.push(ValidationHelper.isRequired(d.agencyName, 'agencyName'));
    if (d.agencyName) validations.push(ValidationHelper.minLength(d.agencyName, 'agencyName', 3));

    validations.push(ValidationHelper.isRequired(d.name, 'name'));
    if (d.name) validations.push(ValidationHelper.minLength(d.name, 'name', 3));

    validations.push(ValidationHelper.isRequired(d.position, 'position'));

    validations.push(ValidationHelper.isRequired(d.yourEmail, 'yourEmail'));
    if (d.yourEmail) validations.push(ValidationHelper.isValidEmail(d.yourEmail, 'yourEmail'));

    validations.push(ValidationHelper.isRequired(d.yourPhone, 'yourPhone'));
    if (d.yourPhone) validations.push(ValidationHelper.minLength(d.yourPhone, 'yourPhone', 10));

    validations.push(ValidationHelper.isRequired(d.companyEmail, 'companyEmail'));
    if (d.companyEmail) validations.push(ValidationHelper.isValidEmail(d.companyEmail, 'companyEmail'));

    validations.push(ValidationHelper.isRequired(d.companyPhone, 'companyPhone'));
    if (d.companyPhone) validations.push(ValidationHelper.minLength(d.companyPhone, 'companyPhone', 10));

    validations.push(ValidationHelper.isRequired(d.companyRegistrationNumberGST, 'companyRegistrationNumberGST'));
    validations.push(ValidationHelper.isRequired(d.website, 'website'));
    validations.push(ValidationHelper.isRequired(d.agencyAddress, 'agencyAddress'));
    validations.push(ValidationHelper.isRequired(d.agencyLocation, 'agencyLocation'));
    validations.push(ValidationHelper.isRequired(d.country, 'country'));
    validations.push(ValidationHelper.isRequired(d.state, 'state'));
    validations.push(ValidationHelper.isRequired(d.city, 'city'));
    validations.push(ValidationHelper.isRequired(d.pincode, 'pincode'));

    validations.push(ValidationHelper.isRequired(d.agencyLogo, 'agencyLogo'));
    if (d.agencyLogo instanceof File) validations.push(ValidationHelper.isValidFileType(d.agencyLogo, 'agencyLogo', 'image/*'));

    validations.push(ValidationHelper.isRequired(d.photo, 'photo'));
    if (d.photo instanceof File) validations.push(ValidationHelper.isValidFileType(d.photo, 'photo', 'image/*'));

    validations.push(ValidationHelper.isRequired(d.uploadIdProof, 'uploadIdProof'));
    if (d.uploadIdProof instanceof File) validations.push(ValidationHelper.isValidFileType(d.uploadIdProof, 'uploadIdProof', '.pdf,application/pdf'));

    validations.push(ValidationHelper.isRequired(d.uploadBusinessProof, 'uploadBusinessProof'));
    if (d.uploadBusinessProof instanceof File) validations.push(ValidationHelper.isValidFileType(d.uploadBusinessProof, 'uploadBusinessProof', '.pdf,application/pdf'));

    if (!id) {
      validations.push(ValidationHelper.isRequired(d.password, 'password'));
      if (d.password) validations.push(ValidationHelper.isValidPassword(d.password, 'password'));
    }

    const validationErrors = ValidationHelper.validate(validations);

    if (validationErrors.length > 0) {
      const seen = new Set<string>();
      for (const err of validationErrors) {
        const fieldName = err.field as keyof AgencyFormData;
        const key = String(err.field);
        if (seen.has(key)) continue;
        seen.add(key);
        setError(fieldName, {
          type: 'manual',
          message: err.message,
        });
      }
      toast.error('Please fix all validation errors');
      return;
    }

    // Final email check before submission
    try {
      setIsCheckingEmails(true);
      const emailCheck = await useAgencyStore.getState().checkEmailsExist(d.yourEmail, d.companyEmail, id);
      
      if (emailCheck.yourEmailExists) {
        setError('yourEmail', {
          type: 'manual',
          message: 'This personal email is already registered'
        });
        toast.error('This personal email is already registered');
        setIsCheckingEmails(false);
        return;
      }
      
      if (emailCheck.companyEmailExists) {
        setError('companyEmail', {
          type: 'manual',
          message: 'This company email is already registered'
        });
        toast.error('This company email is already registered');
        setIsCheckingEmails(false);
        return;
      }
    } catch (error: any) {
      toast.error('Error checking email availability');
      setIsCheckingEmails(false);
      return;
    } finally {
      setIsCheckingEmails(false);
    }

    try {
      const formData = new FormData();
      Object.entries(d).forEach(([key, value]) => {
        if (key === 'country') {
          formData.append('country', value ?? '');
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });
      
      if (id && existingAgencyData?.userId) {
        formData.append('userId', existingAgencyData.userId);
      }

      if (id) {
        await updateAgency(id, formData);
        await Swal.fire({
          title: 'Success!',
          text: 'Agency updated successfully',
          icon: 'success',
          confirmButtonColor: 'var(--puprle-color)',
        });
      } else {
        try {
          await addAgency(formData);
          await Swal.fire({
            title: 'Success!',
            text: 'Agency added successfully',
            icon: 'success',
            confirmButtonColor: 'var(--puprle-color)',
          });
        } catch (addError: any) {
          if (addError?.response?.data?.code === 11000 || 
              (addError?.response?.data?.message && addError.response.data.message.includes('duplicate'))) {
            const errorMessage = addError?.response?.data?.message || '';
            const keyPattern = addError?.response?.data?.keyPattern || {};
            
            if (errorMessage.includes('yourEmail') || keyPattern.yourEmail) {
              setError('yourEmail', {
                type: 'manual',
                message: 'This personal email address is already registered'
              });
              toast.error('This personal email address is already registered');
              return;
            }
            
            if (errorMessage.includes('companyEmail') || keyPattern.companyEmail) {
              setError('companyEmail', {
                type: 'manual',
                message: 'This company email address is already registered'
              });
              toast.error('This company email address is already registered');
              return;
            }
            
            const field = Object.keys(keyPattern)[0] || 'field';
            setError(field as keyof AgencyFormData, {
              type: 'manual',
              message: `This ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} already exists`
            });
            toast.error(`This ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} already exists`);
            return;
          }
          throw addError;
        }
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
  
  const normalizeFormValues = (values: AgencyFormData): AgencyFormData => {
    const normalized: any = {};
    Object.entries(values).forEach(([k, v]) => {
      normalized[k] = typeof v === 'string' ? v.trim() : v;
    });
    return normalized as AgencyFormData;
  };
  
  const onInvalid = () => {
    const values = methods.getValues();
    return onSubmit(values);
  };
  
  const togglePassword = () => setShowPassword(!showPassword);

  const filteredFields = (id
    ? agencyFields.filter(field => field.name !== 'password')
    : agencyFields
  ).map(field => {
    if (field.name === 'agencyName') {
      return {
        ...field,
        className: id ? 'md:col-span-12' : 'md:col-span-6',
      };
    }
    return field;
  });

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
          fields={filteredFields}
          isSubmitting={isSubmitting || isCheckingEmails}
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          data-testid="agency-form"
          extraProps={{
            togglePassword,
            showPassword,
            countryOptions,
            stateOptions,
            cityOptions,
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
            yourEmail: (e) => {
              handleFieldChange('yourEmail')(e);
              // Debounce email check
              const timer = setTimeout(() => handleEmailBlur('yourEmail'), 500);
              return () => clearTimeout(timer);
            },
            yourPhone: handleFieldChange('yourPhone', 10),
            companyEmail: (e) => {
              handleFieldChange('companyEmail')(e);
              // Debounce email check
              const timer = setTimeout(() => handleEmailBlur('companyEmail'), 500);
              return () => clearTimeout(timer);
            },
            companyPhone: handleFieldChange('companyPhone', 10),
            companyRegistrationNumberGST: handleFieldChange('companyRegistrationNumberGST'),
            website: handleFieldChange('website'),
            agencyAddress: handleFieldChange('agencyAddress'),
            agencyLocation: handleFieldChange('agencyLocation'),
            country: handleFieldChange('country'),
            state: handleFieldChange('state'),
            city: handleFieldChange('city'),
            pincode: handleFieldChange('pincode'),
            ...(id ? {} : { password: handleFieldChange('password') }),
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