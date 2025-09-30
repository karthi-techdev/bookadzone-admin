import React, { useEffect, useState } from 'react';
import ValidationHelper from '../../utils/validationHelper';
import { useForm, FormProvider } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { useBannerStore } from '../../stores/bannerStore';
import ManagementForm from '../../organisms/ManagementForm';
import { homeBannerTabsConfig } from '../../utils/fields/homeBannerTabsConfig';
import type { Banner } from '../../types/common';
import FormHeader from '../../molecules/FormHeader';

const HomeBannerTemplate: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1);

  const fetchBanner = useBannerStore((state) => state.fetchBanner);
  const banner: Banner | null = useBannerStore((state) => state.banner);
  const loading = useBannerStore((state) => state.loading);
  const updateBanner = useBannerStore((state) => state.updateBanner);

  // Define the form data type to match your fields
  type BannerFormValues = {
    bannerOneTitle: string;
    highlightedText: string;
    image1: string;
    subHead1: string;
    subDescription1: string;
    image2: string;
    subHead2: string;
    subDescription2: string;
    image3: string;
    subHead3: string;
    subDescription3: string;
    backgroundImage: string;
    bannerTwoTitle: string;
    description: string;
    buttonName: string;
    buttonUrl: string;
    features: { icon: string; title: string }[];
  };

  // Initialize form with empty values, then reset when banner data loads
  const methods = useForm<BannerFormValues>({ 
    defaultValues: {
      bannerOneTitle: '',
      highlightedText: '',
      image1: '',
      subHead1: '',
      subDescription1: '',
      image2: '',
      subHead2: '',
      subDescription2: '',
      image3: '',
      subHead3: '',
      subDescription3: '',
      backgroundImage: '',
      bannerTwoTitle: '',
      description: '',
      buttonName: '',
      buttonUrl: '',
      features: [],
    }, 
    mode: 'onSubmit' 
  });
  const { handleSubmit, reset, setError, clearErrors, setValue, formState: { isSubmitting } } = methods;

  useEffect(() => {
    fetchBanner();
  }, [fetchBanner]);

  useEffect(() => {
    
    if (banner && banner.homepage) {
      // Use optional chaining and proper fallbacks instead of || {}
      const bannerOne = banner.homepage.bannerOne;
      const bannerTwo = banner.homepage.bannerTwo;
      
      // Handle features array properly with optional chaining
      const featuresArr = Array.isArray(bannerTwo?.features)
        ? bannerTwo.features.map((f: any) => ({ 
            icon: f?.icon || '', 
            title: f?.title || '' 
          })).filter((f: any) => f.icon || f.title)
        : [];
      
      const formData = {
        bannerOneTitle: bannerOne?.title || '',
        highlightedText: bannerOne?.highlightedText || '',
        image1: bannerOne?.image1 || '',
        subHead1: bannerOne?.subHead1 || '',
        subDescription1: bannerOne?.subDescription1 || '',
        image2: bannerOne?.image2 || '',
        subHead2: bannerOne?.subHead2 || '',
        subDescription2: bannerOne?.subDescription2 || '',
        image3: bannerOne?.image3 || '',
        subHead3: bannerOne?.subHead3 || '',
        subDescription3: bannerOne?.subDescription3 || '',
        backgroundImage: bannerTwo?.backgroundImage || '',
        bannerTwoTitle: bannerTwo?.title || '',
        description: bannerTwo?.description || '',
        buttonName: bannerTwo?.buttonName || '',
        buttonUrl: bannerTwo?.buttonUrl || '',
        features: featuresArr,
      };
      
      reset(formData);
    }
  }, [banner, reset]);

  // Tab config for Home banner
  type TabConfig = {
    id: number;
    label: string;
    fields: any[];
    isDynamic?: boolean;
    dynamicFieldName?: string;
    dynamicFieldConfig?: any[];
    dynamicFieldLimit?: number;
  };
  const tabs: TabConfig[] = homeBannerTabsConfig;

  // Validation logic for a single field
  const validateField = (field: any, value: any) => {
    let error = null;
    if (field.required) {
      if (field.type === 'file') {
        // Check for invalid file type
        if (value === '__invalid_file_type__') {
          return { field: field.name, message: `${field.label} must be of type: ${field.accept}` };
        }
        // Check if there is an existing file for this field
        let existingFile = '';
        if (["image1", "image2", "image3"].includes(field.name)) {
          existingFile = banner?.homepage?.bannerOne ? (banner.homepage.bannerOne as any)[field.name] : '';
        } else if (field.name === "backgroundImage") {
          existingFile = banner?.homepage?.bannerTwo ? (banner.homepage.bannerTwo as any)[field.name] : '';
        }
        // Required: must have either a new file or an existing file
        if (!value && !existingFile) {
          error = ValidationHelper.isRequired(value, field.name);
        }
        // File type validation (only if a new file is selected)
        if (!error && field.accept && value instanceof File) {
          error = ValidationHelper.isValidFileType(value, field.name, field.accept);
        }
      } else {
        error = ValidationHelper.isRequired(value, field.name);
      }
    }
    if (!error && field.minLength) {
      error = ValidationHelper.minLength(value, field.name, field.minLength);
    }
    if (!error && field.maxLength) {
      error = ValidationHelper.maxLength(value, field.name, field.maxLength);
    }
    if (!error && field.type === 'email') {
      error = ValidationHelper.isValidEmail(value, field.name);
    }
    if (!error && Array.isArray(field.options)) {
      const allowedValues = field.options.map((opt: any) => opt.value);
      error = ValidationHelper.isValidEnum(value, field.name, allowedValues);
    }
    return error;
  };

  // Handle field change and validate
  const handleFieldChange = (field: any, value: any) => {
    setValue(field.name, value, { shouldValidate: true });
    // Special handling for file type error
    if (field.type === 'file' && value === '__invalid_file_type__') {
      setError(field.name, { type: 'manual', message: `${field.label} must be of type: ${field.accept}` });
      return;
    }
    const error = validateField(field, value);
    if (error) {
      setError(field.name, { type: 'manual', message: error.message });
    } else {
      clearErrors(field.name);
    }
  };

  const onSubmit = async (formData: any) => {
    clearErrors();
    // Collect validation errors using ValidationHelper
    const allFields = tabs.flatMap(tab => tab.fields);
    const validationErrors = allFields.map(field => {
      const value = formData[field.name];
      return validateField(field, value);
    }).filter(e => e);

    if (validationErrors.length > 0) {
      // Set errors in react-hook-form
      validationErrors.forEach(err => {
        if (err) {
          setError(err.field as any, { type: 'manual', message: err.message });
        }
      });
      toast.error('Please fix validation errors');
      return;
    }

    try {
      const formDataObj = new FormData();
      if (activeTab === 1) {
        // ...existing code for Banner One submission...
        formDataObj.append('homepage[bannerOne][title]', formData.bannerOneTitle || '');
        formDataObj.append('homepage[bannerOne][highlightedText]', formData.highlightedText || '');
        formDataObj.append('homepage[bannerOne][subHead1]', formData.subHead1 || '');
        formDataObj.append('homepage[bannerOne][subDescription1]', formData.subDescription1 || '');
        formDataObj.append('homepage[bannerOne][subHead2]', formData.subHead2 || '');
        formDataObj.append('homepage[bannerOne][subDescription2]', formData.subDescription2 || '');
        formDataObj.append('homepage[bannerOne][subHead3]', formData.subHead3 || '');
        formDataObj.append('homepage[bannerOne][subDescription3]', formData.subDescription3 || '');
        // Handle image files
        if (formData.image1 instanceof File) {
          formDataObj.append('homepage.bannerOne.image1', formData.image1);
        } else if (typeof formData.image1 === 'string' && formData.image1) {
          formDataObj.append('homepage[bannerOne][image1]', formData.image1);
        }
        if (formData.image2 instanceof File) {
          formDataObj.append('homepage.bannerOne.image2', formData.image2);
        } else if (typeof formData.image2 === 'string' && formData.image2) {
          formDataObj.append('homepage[bannerOne][image2]', formData.image2);
        }
        if (formData.image3 instanceof File) {
          formDataObj.append('homepage.bannerOne.image3', formData.image3);
        } else if (typeof formData.image3 === 'string' && formData.image3) {
          formDataObj.append('homepage[bannerOne][image3]', formData.image3);
        }
        await updateBanner(formDataObj);
        toast.success('Banner One updated successfully');
      } else if (activeTab === 2) {
        // ...existing code for Banner Two submission...
        formDataObj.append('homepage[bannerTwo][title]', formData.bannerTwoTitle || '');
        formDataObj.append('homepage[bannerTwo][description]', formData.description || '');
        formDataObj.append('homepage[bannerTwo][buttonName]', formData.buttonName || '');
        formDataObj.append('homepage[bannerTwo][buttonUrl]', formData.buttonUrl || '');
        // Handle features array
        if (Array.isArray(formData.features)) {
          const validFeatures = formData.features.filter((feature: any) => 
            feature && (feature.icon?.trim() || feature.title?.trim())
          );
          formDataObj.append('homepage[bannerTwo][features]', JSON.stringify(validFeatures));
        }
        // Handle background image
        if (formData.backgroundImage instanceof File) {
          formDataObj.append('homepage.bannerTwo.backgroundImage', formData.backgroundImage);
        } else if (typeof formData.backgroundImage === 'string' && formData.backgroundImage) {
          formDataObj.append('homepage[bannerTwo][backgroundImage]', formData.backgroundImage);
        }
        await updateBanner(formDataObj);
        toast.success('Banner Two updated successfully');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Update failed');
    }
  };

  // Handle tab change
  const handleTabChange = setActiveTab;

  if (loading && !banner) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <FormHeader
        managementName="Home Banner"
      /> 
      <ToastContainer position="top-right" autoClose={3000} />
      <FormProvider {...methods}>
        <ManagementForm
          label="Update"
          tabs={tabs}
          initialTab={1}
          isSubmitting={isSubmitting || loading}
          onSubmit={handleSubmit(onSubmit)}
          data-testid="banner-management-form"
          onTabChange={handleTabChange}
          activeTab={activeTab}
          existingFiles={{
            image1: banner?.homepage?.bannerOne?.image1 ?? '',
            image2: banner?.homepage?.bannerOne?.image2 ?? '',
            image3: banner?.homepage?.bannerOne?.image3 ?? '',
            backgroundImage: banner?.homepage?.bannerTwo?.backgroundImage ?? '',
          }}
          onFieldChange={Object.fromEntries(
            tabs.flatMap(tab => tab.fields.map(field => [
              field.name,
              (e: { target: { value: any } }) => handleFieldChange(field, e.target.value)
            ]))
          )}
           dynamicSectionLabel={activeTab === 2 ? 'Features' : undefined}
        />
      </FormProvider>
    </div>
  );
};

export default HomeBannerTemplate;