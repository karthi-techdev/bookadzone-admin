import React, { useEffect, useState, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useUserStore } from '../../stores/userStore';
import { useUserRoleStore } from '../../stores/UserRoleStore'; // ✅ import role store
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';
import { userFields as baseUserFields } from '../../utils/fields/userFields';
import ValidationHelper from '../../utils/validationHelper';
import Swal from 'sweetalert2';

type UserFormData = {
  username: string;
  email?: string;
  role?: string;
  userType?: string;
  phone?: string;
  password?: string;
};

const getNestedError = (errors: any, path: string): any => {
  return path.split('.').reduce((acc: any, part: string) => {
    return acc && part in acc ? acc[part] : undefined;
  }, errors);
};

const UserFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchUserById, addUser, updateUser } = useUserStore();

 
  const { fetchRoles, roles, loading: roleLoading } = useUserRoleStore();

  const [isInitialized, setIsInitialized] = useState(false);

  const methods = useForm<UserFormData>({
    defaultValues: {
      username: '',
      email: '',
      role: '',
      userType: '',
      phone: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const { handleSubmit, reset, setError, clearErrors, formState: { errors, isSubmitting } } = methods;

  // Validation config
  const fieldValidations: Record<string, any> = {
    username: { required: true, min: 2, max: 100 },
    email: { email: true },
    role: { required: true }, // ✅ role required
    userType: { enum: ['full-time', 'part-time', 'contractor'] },
    phone: { pattern: /^\+?\d{10,15}$/ },
    password: { required: !id, min: 6 },
  };

  const validateField = (field: keyof UserFormData, value: any) => {
    const config = fieldValidations[field];
    const label = field.charAt(0).toUpperCase() + field.slice(1);
    if (config?.required) {
      const err = ValidationHelper.isRequired(value, label);
      if (err) return err;
    }
    if (config?.min && typeof value === 'string') {
      const err = ValidationHelper.minLength(value, label, config.min);
      if (err) return err;
    }
    if (config?.max && typeof value === 'string') {
      const err = ValidationHelper.maxLength(value, label, config.max);
      if (err) return err;
    }
    if (config?.email && value) {
      const err = ValidationHelper.isValidEmail(value, label);
      if (err) return err;
    }
    return null;
  };

  const handleFieldChange = (fieldName: keyof UserFormData) => (e: { target: { name: string; value: any } }) => {
    const value = e.target.value.trim();
    const error = validateField(fieldName, value);
    if (error) {
      setError(fieldName, {
        type: 'manual',
        message: error.message,
      });
    } else {
      clearErrors(fieldName);
    }
    methods.setValue(fieldName, value, { shouldValidate: false });
  };

  // ✅ Fetch roles from store once
  useEffect(() => {
    fetchRoles().catch((err) => toast.error(`Failed to load roles: ${err}`));
  }, [fetchRoles]);

  // Fetch user for edit
  useEffect(() => {
    if (id && !isInitialized) {
      const fetchData = async () => {
        const user = await fetchUserById(id);
        if (user) {
          reset({
            username: user.username || '',
            email: user.email || '',
            role: user.role || '',
            userType: user.userType || '',
            phone: user.phone || '',
            password: '',
          });
          setIsInitialized(true);
        } else {
          toast.error('Failed to load user data');
        }
      };
      fetchData();
    }
  }, [id, fetchUserById, reset, isInitialized]);

  // ✅ Map roles into select field options dynamically
  const userFields = useMemo(() => {
    const dynamicFields = baseUserFields.map((field) => {
      if (field.name === 'role') {
        return {
          ...field,
          options: roles.map((r) => ({
            value: r.name,
            label: r.name.charAt(0).toUpperCase() + r.name.slice(1),
          })),
        };
      }
      return field;
    });
    return dynamicFields;
  }, [roles]);

  const onSubmit = async (data: UserFormData) => {
    clearErrors();
    const trimmedData = {
      username: data.username.trim(),
      email: data.email?.trim() || undefined,
      role: data.role?.trim() || undefined,
      userType: data.userType?.trim() || undefined,
      phone: data.phone?.trim() || undefined,
      password: data.password?.trim() || undefined,
    };

    try {
      if (id) {
        await updateUser(id, trimmedData);
        await Swal.fire({
          title: 'Success!',
          text: 'User updated successfully',
          icon: 'success',
          confirmButtonColor: 'var(--purple-color)',
        });
      } else {
        await addUser(trimmedData);
        await Swal.fire({
          title: 'Success!',
          text: 'User added successfully',
          icon: 'success',
          confirmButtonColor: 'var(--purple-color)',
        });
      }
      navigate('/user');
    } catch (error: any) {
      const errorData = error?.response?.data || {};
      toast.error(errorData.message || 'Something went wrong');
    }
  };

  const onInvalid = () => {
    const values = methods.getValues();
    return onSubmit(values);
  };

  const hasErrors = () => {
    return userFields.some((field) => {
      const error = getNestedError(errors, field.name);
      return error?.message !== undefined;
    });
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="User"
        addButtonLink="/user"
        type={id ? 'Edit' : 'Add'}
      />
      <ToastContainer position="top-right" autoClose={3000} />
      <FormProvider {...methods}>
        <ManagementForm
          label={id ? 'Update' : 'Save'}
          fields={userFields}
          isSubmitting={isSubmitting || roleLoading}
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          data-testid="user-form"
          onFieldChange={{
            username: handleFieldChange('username'),
            email: handleFieldChange('email'),
            role: handleFieldChange('role'),
            userType: handleFieldChange('userType'),
            phone: handleFieldChange('phone'),
            password: handleFieldChange('password'),
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

export default UserFormTemplate;
