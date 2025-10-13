import React from 'react';
import ValidationHelper from '../../utils/validationHelper';
import { useForm, FormProvider } from 'react-hook-form';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { useSettingsStore } from '../../stores/settingsStore';
import { ogConfigFields } from '../../utils/fields/ogConfigFields';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';
import ImportedURL from '../../common/urls';
import OgPreviewCard from '../../atoms/OgPreviewCard';
import SocialShareButton from '../../atoms/SocialShareButton';

type OgConfigFormValues = {
  [key: string]: any;
};

const OgConfigTemplate: React.FC = () => {
  const methods = useForm<OgConfigFormValues>({ defaultValues: {}, mode: 'onSubmit' });
  const { handleSubmit, reset, setError, clearErrors, setValue, formState: { isSubmitting } } = methods;

  const fetchSettings = useSettingsStore((state: any) => state.fetchSettings);
  const settings = useSettingsStore((state: any) => state.settings);
  const loading = useSettingsStore((state: any) => state.loading);
  const updateSettings = useSettingsStore((state: any) => state.updateSettings);

  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  React.useEffect(() => {
    if (settings?.og) {
      reset(settings.og);
    }
  }, [settings, reset]);

  // Validation logic for a single field
  const validateField = (field: any, value: any) => {
    let error = null;
    if (field.required) {
      if (field.type === 'file') {
        if (value === '__invalid_file_type__') {
          return { field: field.name, message: `${field.label} must be of type: ${field.accept}` };
        }
        if (settings?.og && settings.og[field.name]) {
          if (!value) return null;
        }
        error = ValidationHelper.isRequired(value, field.name);
        if (!error && field.accept) {
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
    const validationErrors = ogConfigFields.map(field => {
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
      // Check if there are any file uploads
      const hasFileUploads = ogConfigFields.some(field => 
        field.type === 'file' && formData[field.name] instanceof File
      );

      if (hasFileUploads) {
        // Create FormData for file uploads
        const formDataObj = new FormData();
        ogConfigFields.forEach(field => {
          const value = formData[field.name];
          if (field.type === 'file') {
            if (value instanceof File) {
              formDataObj.append(field.name, value);
            } else if (typeof value === 'string') {
              formDataObj.append(field.name, value);
            }
          } else {
            formDataObj.append(field.name, value ?? '');
          }
        });
        // Append the og data as a JSON string for the backend to parse
        formDataObj.append('og', JSON.stringify(formData));
        await updateSettings(formDataObj);
      } else {
        // Regular JSON update if no files
        await updateSettings({ og: formData });
      }
      
      toast.success('OG configuration updated successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Update failed');
    }
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="OG Configuration"
      />
      <div className="mb-6 p-6 bg-[var(--light-dark-color)] rounded-lg shadow-sm border border-[var(--light-blur-grey-color)]">
        <h3 className="text-lg font-medium mb-6 text-[var(--white-color)]">Share Preview</h3>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview Card */}
          <div className="bg-[var(--dark-color)] p-4 rounded-lg border border-[var(--light-blur-grey-color)]">
            <OgPreviewCard
              className="w-full"
              image={settings?.og?.ogImage ? `${ImportedURL.FILEURL}${settings.og.ogImage}` : undefined}
              title={settings?.og?.ogTitle || settings?.seo?.metaTitle || ""}
              description={settings?.og?.ogDescription || settings?.seo?.metaDescription || ""}
              url={settings?.og?.ogUrl || window.location.origin}
            />
          </div>

          {/* Share and Validate Section */}
          <div className="space-y-6">
            {/* Share Buttons */}
            <div>
              <h4 className="text-sm font-medium mb-3 text-[var(--white-color)]">Share on Social Media</h4>
              <div className="grid grid-cols-2 gap-3">
                <SocialShareButton
                  platform="facebook"
                  onClick={() => {
                    const url = encodeURIComponent(window.location.origin);
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                      'facebook-share',
                      'width=580,height=296'
                    );
                  }}
                />

                <SocialShareButton
                  platform="twitter"
                  onClick={() => {
                    const url = encodeURIComponent(window.location.origin);
                    const text = encodeURIComponent(settings?.og?.ogTitle || settings?.seo?.metaTitle || '');
                    window.open(
                      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
                      'twitter-share',
                      'width=550,height=235'
                    );
                  }}
                />

                <SocialShareButton
                  platform="linkedin"
                  onClick={() => {
                    const url = encodeURIComponent(window.location.origin);
                    const title = encodeURIComponent(settings?.og?.ogTitle || settings?.seo?.metaTitle || '');
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`,
                      'linkedin-share',
                      'width=550,height=435'
                    );
                  }}
                />

                <SocialShareButton
                  platform="whatsapp"
                  onClick={() => {
                    const url = encodeURIComponent(window.location.origin);
                    const text = encodeURIComponent(
                      (settings?.og?.ogTitle || settings?.seo?.metaTitle || '') + '\n\n' +
                      (settings?.og?.ogDescription || settings?.seo?.metaDescription || '')
                    );
                    // For mobile devices
                    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                      window.location.href = `whatsapp://send?text=${text}%0A${url}`;
                    } else {
                      // For desktop devices
                      window.open(
                        `https://web.whatsapp.com/send?text=${text}%0A${url}`,
                        'whatsapp-share',
                        'width=600,height=700'
                      );
                    }
                  }}
                />
              </div>
            </div>

            {/* Validator Links */}
            <div className="bg-[var(--dark-color)] p-4 rounded-lg border border-[var(--light-blur-grey-color)]">
              <h4 className="text-sm font-medium mb-3 text-[var(--white-color)]">Validate OG Tags</h4>
              <div className="grid grid-cols-1 gap-3">
                <a 
                  href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(window.location.origin)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[var(--puprle-color)] hover:text-[var(--light-purple-color)] transition-colors"
                >
                  <FaFacebook className="mr-2" /> Facebook Debugger
                </a>
                <a 
                  href={`https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(window.location.origin)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[var(--puprle-color)] hover:text-[var(--light-purple-color)] transition-colors"
                >
                  <FaLinkedin className="mr-2" /> LinkedIn Inspector
                </a>
                <a 
                  href="https://cards-dev.twitter.com/validator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-[var(--puprle-color)] hover:text-[var(--light-purple-color)] transition-colors"
                >
                  <FaTwitter className="mr-2" /> Twitter Validator
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
      <FormProvider {...methods}>
        <ManagementForm
          label="Update"
          fields={ogConfigFields}
          isSubmitting={isSubmitting || loading}
          onSubmit={handleSubmit(onSubmit)}
          data-testid="og-config-form"
          existingFiles={{
            ogImage: settings?.og?.ogImage ?? '',
          }}
          onFieldChange={Object.fromEntries(
            ogConfigFields.map(field => [
              field.name,
              (e: { target: { value: any } }) => handleFieldChange(field, e.target.value)
            ])
          )}
        />
      </FormProvider>
    </div>
  );
};

export default OgConfigTemplate;