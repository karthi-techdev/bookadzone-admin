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
  password?: string;
  agencyLogo: File | string;
  photo: File | string;
  uploadIdProof: File | string;
  uploadBusinessProof: File | string;
};

const AgencyFormTemplate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchAgencyById, addAgency, updateAgency } = useAgencyStore();

  const [isInitialized, setIsInitialized] = useState(false);
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
      country: '',
      state: '',
      city: '',
      pincode: '',
      password: '',
      agencyLogo: '',
      photo: '',
      uploadIdProof: '',
      uploadBusinessProof: '',
    },
    mode: 'onSubmit',
  });

  const {
    handleSubmit,
    reset,
    setError,
    clearErrors,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const watchedCountry = watch('country');
  const watchedState = watch('state');

  useEffect(() => {
    if (watchedCountry) {
      const states = getStatesOfCountry(watchedCountry);
      setStateOptions(states);
      setValue('state', '');
      setValue('city', '');
      setCityOptions([]);
    } else {
      setStateOptions([]);
      setCityOptions([]);
    }
  }, [watchedCountry, setValue]);

  useEffect(() => {
    if (watchedCountry && watchedState) {
      const cacheKey = `${watchedCountry}_${watchedState}`;
      if (cityCache.current[cacheKey]) {
        setCityOptions(cityCache.current[cacheKey]);
      } else {
        const cities = getCitiesOfState(watchedCountry, watchedState);
        cityCache.current[cacheKey] = cities;
        setCityOptions(cities);
      }
    } else {
      setCityOptions([]);
    }
  }, [watchedCountry, watchedState]);

  useEffect(() => {
    if (id && !isInitialized) {
      const fetchData = async () => {
        try {
          const agency = await fetchAgencyById(id);
          if (agency) {
            setExistingAgencyData(agency);
            reset({
              agencyName: agency.agencyName || '',
              name: agency.name || '',
              position: agency.position || '',
              yourPhone: agency.yourPhone || '',
              yourEmail: agency.yourEmail || '',
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
              agencyLogo: agency.agencyLogo || '',
              photo: agency.photo || '',
              uploadIdProof: agency.uploadIdProof || '',
              uploadBusinessProof: agency.uploadBusinessProof || '',
            });
            setIsInitialized(true);
          } else {
            toast.error('Failed to load agency');
            navigate('/agency');
          }
        } catch {
          toast.error('Error loading agency');
          navigate('/agency');
        }
      };
      fetchData();
    }
  }, [id, fetchAgencyById, reset, isInitialized, navigate]);

  const handleFieldChange = (fieldName: keyof AgencyFormData, minLength?: number) => (e: { target: { value: any } }) => {

    const rawValue = e.target.value;
    const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
    const field = agencyFields.find(f => f.name === fieldName);
    if (!field) return;

    const validations: any[] = [];

    if (field.required && !value) {
      setError(fieldName, { type: 'manual', message: `${field.label || fieldName} is required` });
      setValue(fieldName, rawValue, { shouldValidate: false });
      return;
    }

    if (value) {
      if (field.type === 'email') validations.push(ValidationHelper.isValidEmail(value, fieldName));
      if (field.type === 'password') validations.push(ValidationHelper.isValidPassword(value, fieldName));
      if (minLength && typeof value === 'string') validations.push(ValidationHelper.minLength(value, fieldName, minLength));
    }

    if (field.type === 'file' && rawValue instanceof File) {
      validations.push(ValidationHelper.isValidFileType(rawValue, fieldName, field.accept || ''));
    }

    const errorsArr = ValidationHelper.validate(validations);
    if (errorsArr.length) {
      setError(fieldName, { type: 'manual', message: errorsArr[0].message });
    } else {
      clearErrors(fieldName);
    }

    setValue(fieldName, rawValue, { shouldValidate: false });
  };

  const handleEmailBlur = async (fieldName: 'yourEmail' | 'companyEmail') => {
    if (id) return;

    const yourEmail = methods.getValues('yourEmail').trim();
    const companyEmail = methods.getValues('companyEmail').trim();
    if (!yourEmail || !companyEmail) return;

    clearErrors('yourEmail');
    clearErrors('companyEmail');

    try {
      setIsCheckingEmails(true);
      const check = await useAgencyStore.getState().checkEmailsExist(yourEmail, companyEmail);
      if (check.yourEmailExists) setError('yourEmail', { type: 'manual', message: 'Personal email already registered' });
      if (check.companyEmailExists) setError('companyEmail', { type: 'manual', message: 'Company email already registered' });
    } catch {
      toast.error('Email check failed');
    } finally {
      setIsCheckingEmails(false);
    }
  };

  const onSubmit = async (data: AgencyFormData) => {
    clearErrors();
    if (isCheckingEmails) {
      toast.error('Verifying emails...');
      return;
    }

    const d = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])) as AgencyFormData;

    const validations: any[] = [
      ValidationHelper.isRequired(d.agencyName, 'agencyName'),
      d.agencyName && ValidationHelper.minLength(d.agencyName, 'agencyName', 3),
      ValidationHelper.isRequired(d.name, 'name'),
      d.name && ValidationHelper.minLength(d.name, 'name', 3),
      ValidationHelper.isRequired(d.position, 'position'),
      ValidationHelper.isRequired(d.yourEmail, 'yourEmail'),
      d.yourEmail && ValidationHelper.isValidEmail(d.yourEmail, 'yourEmail'),
      ValidationHelper.isRequired(d.yourPhone, 'yourPhone'),
      d.yourPhone && ValidationHelper.minLength(d.yourPhone, 'yourPhone', 10),
      ValidationHelper.isRequired(d.companyEmail, 'companyEmail'),
      d.companyEmail && ValidationHelper.isValidEmail(d.companyEmail, 'companyEmail'),
      ValidationHelper.isRequired(d.companyPhone, 'companyPhone'),
      d.companyPhone && ValidationHelper.minLength(d.companyPhone, 'companyPhone', 10),
      ValidationHelper.isRequired(d.companyRegistrationNumberGST, 'companyRegistrationNumberGST'),
      ValidationHelper.isRequired(d.website, 'website'),
      ValidationHelper.isRequired(d.agencyAddress, 'agencyAddress'),
      ValidationHelper.isRequired(d.agencyLocation, 'agencyLocation'),
      ValidationHelper.isRequired(d.country, 'country'),
      ValidationHelper.isRequired(d.state, 'state'),
      ValidationHelper.isRequired(d.city, 'city'),
      ValidationHelper.isRequired(d.pincode, 'pincode'),
      ValidationHelper.isRequired(d.agencyLogo, 'agencyLogo'),
      d.agencyLogo instanceof File && ValidationHelper.isValidFileType(d.agencyLogo, 'agencyLogo', 'image/*'),
      ValidationHelper.isRequired(d.photo, 'photo'),
      d.photo instanceof File && ValidationHelper.isValidFileType(d.photo, 'photo', 'image/*'),
      ValidationHelper.isRequired(d.uploadIdProof, 'uploadIdProof'),
      d.uploadIdProof instanceof File && ValidationHelper.isValidFileType(d.uploadIdProof, 'uploadIdProof', '.pdf'),
      ValidationHelper.isRequired(d.uploadBusinessProof, 'uploadBusinessProof'),
      d.uploadBusinessProof instanceof File && ValidationHelper.isValidFileType(d.uploadBusinessProof, 'uploadBusinessProof', '.pdf'),
    ].filter(Boolean);

    if (!id) {
      validations.push(ValidationHelper.isRequired(d.password, 'password'));
      d.password && validations.push(ValidationHelper.isValidPassword(d.password, 'password'));
    }

    const errors = ValidationHelper.validate(validations);
    if (errors.length) {
      errors.forEach(e => setError(e.field as keyof AgencyFormData, { type: 'manual', message: e.message }));
      
      return;
    }

    if (!id) {
      try {
        setIsCheckingEmails(true);
        const check = await useAgencyStore.getState().checkEmailsExist(d.yourEmail, d.companyEmail);
        if (check.yourEmailExists || check.companyEmailExists) {
          check.yourEmailExists && setError('yourEmail', { type: 'manual', message: 'Email already registered' });
          check.companyEmailExists && setError('companyEmail', { type: 'manual', message: 'Email already registered' });
          toast.error('Email already in use');
          return;
        }
      } catch {
        toast.error('Email check failed');
        return;
      } finally {
        setIsCheckingEmails(false);
      }
    }

    const formData = new FormData();
    Object.entries(d).forEach(([k, v]) => v != null && formData.append(k, v instanceof File ? v : String(v)));
    if (id && existingAgencyData?.userId) formData.append('userId', existingAgencyData.userId);

    try {
      id ? await updateAgency(id, formData) : await addAgency(formData);
      await Swal.fire({ title: 'Success!', text: `Agency ${id ? 'updated' : 'added'}`, icon: 'success' });
      navigate('/agency');
    } catch (err: any) {
      const data = err?.response?.data;
      data?.errors?.forEach((e: any) => toast.error(`${e.path}: ${e.message}`));
      toast.error(data?.message || 'Error');
    }
  };

  const onInvalid = () => toast.error('Fix form errors');

  const filteredFields = agencyFields
    .filter(f => !id || f.name !== 'password')
    .map(f => {
      if (f.name === 'agencyName') return { ...f, className: id ? 'md:col-span-12' : 'md:col-span-6' };
      if (id && ['yourEmail', 'companyEmail'].includes(f.name)) return { ...f, disabled: true };
      return f;
    });

  return (
    <div className="p-6">
      <FormHeader managementName="Agency" addButtonLink="/agency" type={id ? 'Edit' : 'Add'} />
      <ToastContainer position="top-right" autoClose={3000} />
      <FormProvider {...methods}>
        <ManagementForm
          label={id ? 'Update' : 'Save'}
          fields={filteredFields}
          isSubmitting={isSubmitting || isCheckingEmails}
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          data-testid="agency-form"
          extraProps={{ countryOptions, stateOptions, cityOptions }}
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
            yourEmail: id ? () => {} : (e: any) => { handleFieldChange('yourEmail')(e); setTimeout(() => handleEmailBlur('yourEmail'), 500); },
            yourPhone: handleFieldChange('yourPhone', 10),
            companyEmail: id ? () => {} : (e: any) => { handleFieldChange('companyEmail')(e); setTimeout(() => handleEmailBlur('companyEmail'), 500); },
            companyPhone: handleFieldChange('companyPhone', 10),
            companyRegistrationNumberGST: handleFieldChange('companyRegistrationNumberGST'),
            website: handleFieldChange('website'),
            agencyAddress: handleFieldChange('agencyAddress'),
            agencyLocation: handleFieldChange('agencyLocation'),
            country: handleFieldChange('country'),
            state: handleFieldChange('state'),
            city: handleFieldChange('city'),
            pincode: handleFieldChange('pincode'),
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
