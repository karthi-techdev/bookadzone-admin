
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useFaqStore } from '../../stores/FaqStore';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';
import { faqFields } from '../../utils/fields/faqFields';
import ValidationHelper from '../../utils/validationHelper';
import Swal from 'sweetalert2';

type FaqFormData = {
  question: string;
  answer: string;
  status?: boolean;
  priority: number;
};

const getNestedError = (errors: any, path: string): any => {
  return path.split('.').reduce((acc: any, part: string) => {
    return acc && part in acc ? acc[part] : undefined;
  }, errors);
};

const FaqFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchFaqById, addFaq, updateFaq } = useFaqStore();
  const [isInitialized, setIsInitialized] = useState(false);

  const methods = useForm<FaqFormData>({
    defaultValues: {
      question: '',
      answer: '',
      status: true,
      priority: 1,
    },
    mode: 'onSubmit',
  });

  const { handleSubmit, reset, setError, clearErrors, formState: { errors, isSubmitting } } = methods;

  const handleFieldChange = (fieldName: keyof FaqFormData, minLengthValue?: number, maxValue?: number) => (e: { target: { name: string; value: any; checked?: boolean } }) => {
    let value = e.target.value;
    if (typeof methods.getValues(fieldName) === 'boolean' && typeof e.target.checked === 'boolean') {
      value = e.target.checked;
    } else if (fieldName === 'priority') {
      value = parseInt(value, 10);
    }

    // Build validation rules for this field
    const validations = [
      ValidationHelper.isRequired(value, fieldName.charAt(0).toUpperCase() + fieldName.slice(1)),
    ];
    if (minLengthValue && typeof value === 'string') {
      validations.push(ValidationHelper.minLength(value, fieldName.charAt(0).toUpperCase() + fieldName.slice(1), minLengthValue));
    }
    if (maxValue && typeof value === 'number') {
      validations.push(ValidationHelper.maxValue(value, fieldName.charAt(0).toUpperCase() + fieldName.slice(1), maxValue));
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
    methods.setValue(fieldName, value, { shouldValidate: false });
  };

  useEffect(() => {
    if (id && !isInitialized) {
      const fetchData = async () => {
        const faq = await fetchFaqById(id);
        if (faq) {
          reset({
            question: faq.question || '',
            answer: faq.answer || '',
            status: typeof faq.status === 'boolean' ? faq.status : faq.status === 'active',
            priority: faq.priority || 1,
          });
          setIsInitialized(true);
        } else {
          toast.error('Failed to load FAQ data');
        }
      };
      fetchData();
    }
  }, [id, fetchFaqById, reset, isInitialized]);

  const onSubmit = async (data: FaqFormData) => {
    clearErrors();

    const trimmedData = {
      question: data.question.trim(),
      answer: data.answer.trim(),
      status: data.status,
      priority: data.priority,
    };

    // Frontend validation
    const validationErrors = ValidationHelper.validate([
      ValidationHelper.isRequired(trimmedData.question, 'Question'),
      ValidationHelper.minLength(trimmedData.question, 'Question', 5),
      ValidationHelper.maxLength(trimmedData.question, 'Question', 500),
      ValidationHelper.isRequired(trimmedData.answer, 'Answer'),
      ValidationHelper.minLength(trimmedData.answer, 'Answer', 5),
      ValidationHelper.maxLength(trimmedData.answer, 'Answer', 2000),
      ValidationHelper.isValidEnum(
        typeof trimmedData.status === 'boolean' ? (trimmedData.status ? 'active' : 'inactive') : trimmedData.status,
        'Status',
        ['active', 'inactive']
      ),
      ValidationHelper.isRequired(trimmedData.priority, 'Priority'),
      ValidationHelper.maxValue(trimmedData.priority, 'Priority', 100),
    ]);

    if (validationErrors.length > 0) {
      validationErrors.forEach((err) => {
        const fieldName = err.field.toLowerCase() as keyof FaqFormData;
        setError(fieldName, {
          type: 'manual',
          message: err.message,
        });
      });
      // Only show the first error in toast for clarity
      // toast.error(validationErrors[0].message);
      return;
    }

    // Only reach here if frontend validation passes
    try {
      if (id) {
        await updateFaq(id, trimmedData);
        await Swal.fire({
          title: 'Success!',
          text: 'FAQ updated successfully',
          icon: 'success',
          confirmButtonColor: 'var(--puprle-color)',
        });
      } else {
        await addFaq(trimmedData);
        await Swal.fire({
          title: 'Success!',
          text: 'FAQ added successfully',
          icon: 'success',
          confirmButtonColor: 'var(--puprle-color)',
        });
      }
      navigate('/faq');
    } catch (error: any) {
      // Show backend errors only in toast, do not set as field errors
      const errorData = error?.response?.data || {};
      if (error?.response?.status === 409 && errorData.message?.includes('already exists')) {
        toast.error(errorData.message);
        return;
      }
      if (errorData.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((err: { path: string; message: string }) => {
          toast.error(`${err.path}: ${err.message}`);
        });
      } else if (typeof error === 'string') {
        toast.error(error);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        const message = errorData.message || 'Something went wrong';
        toast.error(message);
      }
    }
  };

  const hasErrors = () => {
    return faqFields.some(field => {
      const error = getNestedError(errors, field.name);
      return error?.message !== undefined;
    });
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="FAQ"
        addButtonLink="/faq"
        type={id ? 'Edit' : 'Add'}
      />
      <ToastContainer position="top-right" autoClose={3000} />
      <FormProvider {...methods}>
        <ManagementForm
          label={id ? 'Update' : 'Save'}
          fields={faqFields}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit(onSubmit)}
          data-testid="faq-form"
          onFieldChange={{
            question: handleFieldChange('question', 5),
            answer: handleFieldChange('answer', 5),
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

export default FaqFormTemplate;