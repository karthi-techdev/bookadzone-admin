import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { useBannerStore } from '../../stores/bannerStore';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';
import {
  aboutSubmenu1Fields,
  aboutSubmenu2Fields,
  aboutSubmenu3Fields,
  aboutSmallBoxDynamicField,
  aboutSubmenuImagesFields,
  aboutBannerFourDynamicField,
  aboutBannerFourTitleField
} from '../../utils/fields/aboutBannerTabsConfig';

// Define form data interface
interface AboutBannerFormData {
  aboutSubmenu1Title: string;
  aboutSubmenu1Description: string;
  aboutSubmenu1BackgroundImage: string | File;
  aboutSubmenu1Images: ({ id: number; url: string } | File)[];
  aboutSubmenu1RemovedImages?: string[];
  aboutSubmenu2Title: string;
  aboutSubmenu2Description: string;
  aboutSubmenu2BackgroundImage: string | File;
  aboutSubmenu2Images: ({ id: number; url: string } | File)[];
  aboutSubmenu2RemovedImages?: string[];
  [key: string]: any;
}

// Define TabConfig type locally to resolve type error
type TabConfig = {
  id: number;
  label: string;
  fields: any[];
  isDynamic?: boolean;
  dynamicFieldName?: string;
  dynamicFieldConfig?: any[];
  dynamicFieldLimit?: number;
};




const aboutTabs: TabConfig[] = [
  {
    id: 1,
    label: 'Banner One',
    fields: [...aboutSubmenu1Fields, aboutSubmenuImagesFields[0]],
  },
  {
    id: 2,
    label: 'Banner Two',
    fields: [...aboutSubmenu2Fields, aboutSubmenuImagesFields[1]],
  },
  {
    id: 3,
    label: 'Banner Three',
    fields: [...aboutSubmenu3Fields],
    isDynamic: true,
    dynamicFieldName: 'aboutSmallBoxes',
    dynamicFieldConfig: aboutSmallBoxDynamicField.config,
    dynamicFieldLimit: aboutSmallBoxDynamicField.limit,
  },
  {
    id: 4,
    label: 'Banner Four',
    fields: [aboutBannerFourTitleField],
    isDynamic: true,
    dynamicFieldName: 'aboutBannerFourHistory',
    dynamicFieldConfig: aboutBannerFourDynamicField.config,
    dynamicFieldLimit: aboutBannerFourDynamicField.limit,
  },
];

const AboutBannertTemplate: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1);
  const methods = useForm<AboutBannerFormData>({ defaultValues: {}, mode: 'onSubmit' });
  const { handleSubmit, reset, clearErrors, setValue, getValues, formState: { isSubmitting } } = methods;

  // Handler for image field changes - separates new, existing and removed images
  const handleImageFieldChange = (fieldName: string, removedFieldName: string) => (e: { target: { value: any; removedFiles?: string[] } }) => {
    const currentValue = getValues(fieldName) || [];
    const newFiles: File[] = [];
    const existingImages: { id: number; url: string }[] = [];
    
    // Handle existing images
    currentValue.forEach((img: any) => {
      if (img && typeof img === 'object' && 'url' in img && 'id' in img) {
        // Only keep existing images that haven't been removed
        if (!e.target.removedFiles?.includes(img.url)) {
          existingImages.push(img);
        }
      }
    });

    // Handle new files
    if (Array.isArray(e.target.value)) {
      e.target.value.forEach((file: File) => {
        if (file instanceof File) {
          newFiles.push(file);
        }
      });
    } else if (e.target.value instanceof File) {
      newFiles.push(e.target.value);
    }

    // Update removed files if any
    if (e.target.removedFiles?.length) {
      setValue(removedFieldName, e.target.removedFiles, { shouldValidate: true });
    }

    // Set the combined value but keep new files and existing images separate in the internal structure
    setValue(fieldName, [...existingImages, ...newFiles], { shouldValidate: true });
  };

  const fetchBanner = useBannerStore((state) => state.fetchBanner);
  const banner = useBannerStore((state) => state.banner) as any;
  const loading = useBannerStore((state) => state.loading);
  const updateBanner = useBannerStore((state) => state.updateBanner);

  useEffect(() => {
    fetchBanner();
  }, [fetchBanner]);

  useEffect(() => {
    if (banner && banner.aboutBanner) {
      const bannerOne = banner.aboutBanner.bannerOne || {};
      const bannerTwo = banner.aboutBanner.bannerTwo || {};
      const bannerThree = banner.aboutBanner.bannerThree || {};
      const bannerFour = banner.aboutBanner.bannerFour || {};

      // Log received data (for debugging)
      console.log('Received banner data:', {
        bannerThree,
        bannerFour
      });

      // Convert images to array of objects with id and url
      const bannerOneImages = Array.isArray(bannerOne.images)
        ? bannerOne.images.map((img: any, idx: number) =>
            typeof img === 'string'
              ? { id: idx + 1, url: img }
              : img
          )
        : [];
      const bannerTwoImages = Array.isArray(bannerTwo.images)
        ? bannerTwo.images.map((img: any, idx: number) =>
            typeof img === 'string'
              ? { id: idx + 1, url: img }
              : img
          )
        : [];
      // Log the raw banner data before processing
      console.log('Raw banner data:', {
        bannerThree,
        bannerFour
      });

      const formData = {
        aboutSubmenu1Title: bannerOne.title || '',
        aboutSubmenu1Description: bannerOne.description || '',
        aboutSubmenu1BackgroundImage: bannerOne.backgroundImage || '',
        aboutSubmenu1Images: bannerOneImages,
        aboutSubmenu2Title: bannerTwo.title || '',
        aboutSubmenu2Description: bannerTwo.description || '',
        aboutSubmenu2BackgroundImage: bannerTwo.backgroundImage || '',
        aboutSubmenu2Images: bannerTwoImages,
        aboutSubmenu3Title: bannerThree.title || '',
        aboutSubmenu3Description: bannerThree.description || '',
        aboutSmallBoxes: Array.isArray(bannerThree.smallBoxes)
          ? bannerThree.smallBoxes.map((box: any) => {
              console.log('Processing small box:', box);
              return {
                count: box.count?.toString() || '',
                label: box.label || '',
                description: box.description || '',
              };
            })
          : [],
        aboutBannerFourTitle: bannerFour.title || '',
        aboutBannerFourHistory: Array.isArray(bannerFour.history)
          ? bannerFour.history.map((item: any) => {
              console.log('Processing history item:', item);
              return {
                year: item.year?.toString() || '',
                month: item.month || '',
                description: item.description || '',
              };
            })
          : [],
      };

      // Log the processed form data
      console.log('Processed form data:', formData);
      reset(formData);
    }
  }, [banner, reset]);

  const onSubmit = async (formData: AboutBannerFormData) => {
    clearErrors();
    try {
      // Validate required fields based on active tab
    if (activeTab === 1) {
      if (!formData.aboutSubmenu1Title?.trim()) {
        toast.error('Title is required for Banner One');
        return;
      }
      if (!formData.aboutSubmenu1Description?.trim()) {
        toast.error('Description is required for Banner One');
        return;
      }
      
      // Validate minimum images
      const existingImages = Array.isArray(formData.aboutSubmenu1Images)
        ? formData.aboutSubmenu1Images.filter((img: any) => 
            img && typeof img === 'object' && 'url' in img
          )
        : [];
      const newFiles = Array.isArray(formData.aboutSubmenu1Images)
        ? formData.aboutSubmenu1Images.filter((img: any) => img instanceof File)
        : [];
      const removedCount = formData.aboutSubmenu1RemovedImages?.length || 0;
      const totalImages = existingImages.length + newFiles.length;
      
      if (totalImages === 0) {
        toast.error('Please add at least one image to Banner One');
        return;
      }
    }

    if (activeTab === 2) {
      if (!formData.aboutSubmenu2Title?.trim()) {
        toast.error('Title is required for Banner Two');
        return;
      }
      if (!formData.aboutSubmenu2Description?.trim()) {
        toast.error('Description is required for Banner Two');
        return;
      }
      
      //  Validate minimum images
      const existingImages = Array.isArray(formData.aboutSubmenu2Images)
        ? formData.aboutSubmenu2Images.filter((img: any) => 
            img && typeof img === 'object' && 'url' in img
          )
        : [];
      const newFiles = Array.isArray(formData.aboutSubmenu2Images)
        ? formData.aboutSubmenu2Images.filter((img: any) => img instanceof File)
        : [];
      const totalImages = existingImages.length + newFiles.length;
      
      if (totalImages === 0) {
        toast.error('Please add at least one image to Banner Two');
        return;
      }
    }

    if (activeTab === 3 && (!formData.aboutSubmenu3Title?.trim() || !formData.aboutSubmenu3Description?.trim())) {
      toast.error('Title and Description are required for Banner Three');
      return;
    }

    if (activeTab === 4 && !formData.aboutBannerFourTitle?.trim()) {
      toast.error('Title is required for Banner Four');
      return;
    }

      // Create FormData object with validation
      const formDataObj = new FormData();
      const removedBannerOneImages = formData.aboutSubmenu1RemovedImages || [];
      const removedBannerTwoImages = formData.aboutSubmenu2RemovedImages || [];

      if (activeTab === 1) {
        formDataObj.append('aboutBanner.bannerOne.title', formData.aboutSubmenu1Title || '');
        formDataObj.append('aboutBanner.bannerOne.description', formData.aboutSubmenu1Description || '');
        
        // Handle background image
        if (formData.aboutSubmenu1BackgroundImage instanceof File) {
          formDataObj.append('aboutBanner.bannerOne.backgroundImage', formData.aboutSubmenu1BackgroundImage);
        } else if (typeof formData.aboutSubmenu1BackgroundImage === 'string' && formData.aboutSubmenu1BackgroundImage) {
          formDataObj.append('aboutBanner.bannerOne.backgroundImageUrl', formData.aboutSubmenu1BackgroundImage);
        }

        // Handle multiple images
        if (Array.isArray(formData.aboutSubmenu1Images)) {
          const newFiles: File[] = [];
          const existingImages: { id: number; url: string }[] = [];
          
          // Separate new files and existing images
          formData.aboutSubmenu1Images.forEach((img: any) => {
            if (img && typeof img === 'object' && 'url' in img && 'id' in img) {
              if (!removedBannerOneImages.includes(img.url)) {
                existingImages.push(img);
              }
            } else if (img instanceof File) {
              newFiles.push(img);
            }
          });

          // Append new files in a separate array
          newFiles.forEach((file: File) => {
            formDataObj.append('aboutBanner.bannerOne.newImages', file);
          });

          // Append existing images as a JSON string
          if (existingImages.length > 0) {
            formDataObj.append('aboutBanner.bannerOne.existingImages', JSON.stringify(existingImages));
          }

          // Append removed images as a separate array
          if (removedBannerOneImages.length > 0) {
            formDataObj.append('aboutBanner.bannerOne.removedImages', JSON.stringify(removedBannerOneImages));
          }
        }
        await updateBanner(formDataObj);
        toast.success('Banner One updated successfully');
      } else if (activeTab === 2) {
        formDataObj.append('aboutBanner.bannerTwo.title', formData.aboutSubmenu2Title || '');
        formDataObj.append('aboutBanner.bannerTwo.description', formData.aboutSubmenu2Description || '');
        
        // Handle background image
        if (formData.aboutSubmenu2BackgroundImage instanceof File) {
          formDataObj.append('aboutBanner.bannerTwo.backgroundImage', formData.aboutSubmenu2BackgroundImage);
        } else if (typeof formData.aboutSubmenu2BackgroundImage === 'string' && formData.aboutSubmenu2BackgroundImage) {
          formDataObj.append('aboutBanner.bannerTwo.backgroundImageUrl', formData.aboutSubmenu2BackgroundImage);
        }

        // Handle multiple images
        if (Array.isArray(formData.aboutSubmenu2Images)) {
          const newFiles: File[] = [];
          const existingImages: { id: number; url: string }[] = [];
          
          // Separate new files and existing images
          formData.aboutSubmenu2Images.forEach((img: any) => {
            if (img && typeof img === 'object' && 'url' in img && 'id' in img) {
              if (!removedBannerTwoImages.includes(img.url)) {
                existingImages.push(img);
              }
            } else if (img instanceof File) {
              newFiles.push(img);
            }
          });

          // Append new files in a separate array
          newFiles.forEach((file: File) => {
            formDataObj.append('aboutBanner.bannerTwo.newImages', file);
          });

          // Append existing images as a JSON string
          if (existingImages.length > 0) {
            formDataObj.append('aboutBanner.bannerTwo.existingImages', JSON.stringify(existingImages));
          }

          // Append removed images as a separate array
          if (removedBannerTwoImages.length > 0) {
            formDataObj.append('aboutBanner.bannerTwo.removedImages', JSON.stringify(removedBannerTwoImages));
          }
        }
        await updateBanner(formDataObj);
        toast.success('Banner Two updated successfully');
      } else if (activeTab === 3) {
        // Filter out empty small boxes
        let aboutSmallBoxes = Array.isArray(formData.aboutSmallBoxes)
          ? formData.aboutSmallBoxes.filter((box: any) => {
              if (!box) return false;
              return box.count?.toString().trim() || box.label?.trim() || box.description?.trim();
            })
          : [];

        // Add the basic fields
        formDataObj.append('aboutBanner.bannerThree.title', formData.aboutSubmenu3Title || '');
        formDataObj.append('aboutBanner.bannerThree.description', formData.aboutSubmenu3Description || '');
        
        // Add each small box as individual fields
        aboutSmallBoxes.forEach((box, index) => {
          formDataObj.append(`aboutBanner.bannerThree.smallBoxes[${index}][count]`, box.count?.toString() || '');
          formDataObj.append(`aboutBanner.bannerThree.smallBoxes[${index}][label]`, box.label || '');
          formDataObj.append(`aboutBanner.bannerThree.smallBoxes[${index}][description]`, box.description || '');
        });

        // Log the data being sent (for debugging)
        console.log('Sending bannerThree data:', {
          title: formData.aboutSubmenu3Title,
          description: formData.aboutSubmenu3Description,
          smallBoxes: aboutSmallBoxes
        });

        // Log the FormData entries
        for (let pair of formDataObj.entries()) {
          console.log('FormData entry:', pair[0], pair[1]);
        }

        await updateBanner(formDataObj);
        toast.success('Banner Three updated successfully');
      } else if (activeTab === 4) {
        // Filter out empty history items
        let aboutBannerFourHistory = Array.isArray(formData.aboutBannerFourHistory)
          ? formData.aboutBannerFourHistory.filter((item: any) => {
              if (!item) return false;
              return item.year?.toString().trim() || item.month?.trim() || item.description?.trim();
            })
          : [];

        // Add the title
        formDataObj.append('aboutBanner.bannerFour.title', formData.aboutBannerFourTitle || '');
        
        // Add each history item as individual fields
        aboutBannerFourHistory.forEach((item, index) => {
          formDataObj.append(`aboutBanner.bannerFour.history[${index}][year]`, item.year?.toString() || '');
          formDataObj.append(`aboutBanner.bannerFour.history[${index}][month]`, item.month || '');
          formDataObj.append(`aboutBanner.bannerFour.history[${index}][description]`, item.description || '');
        });

        // Log the data being sent (for debugging)
        console.log('Sending bannerFour data:', {
          title: formData.aboutBannerFourTitle,
          history: aboutBannerFourHistory
        });
        
        // Log the FormData entries
        console.log('FormData content:');
        for (let pair of formDataObj.entries()) {
          console.log('FormData entry:', pair[0], pair[1]);
        }
        
        await updateBanner(formDataObj);
        toast.success('Banner Four updated successfully');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Update failed');
    }
  };

  const handleTabChange = (tabId: number) => {
    setActiveTab(tabId);
    // Clear any existing errors when switching tabs
    clearErrors();
  };

  if (loading && !banner) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">Loading banner data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <FormHeader
        managementName="About Banner"
      /> 

      <ToastContainer position="top-right" autoClose={3000} />
      
      <FormProvider {...methods}>
        <ManagementForm
          label="Update"
          tabs={aboutTabs}
          initialTab={1}
          isSubmitting={isSubmitting || loading}
          onSubmit={handleSubmit(onSubmit)}
          data-testid="about-banner-management-form"
          onTabChange={handleTabChange}
          activeTab={activeTab}
          existingFiles={{
            aboutSubmenu1BackgroundImage: banner?.aboutBanner?.bannerOne?.backgroundImage ?? '',
            aboutSubmenu2BackgroundImage: banner?.aboutBanner?.bannerTwo?.backgroundImage ?? '',
            aboutSubmenu1Images: banner?.aboutBanner?.bannerOne?.images ?? [],
            aboutSubmenu2Images: banner?.aboutBanner?.bannerTwo?.images ?? [],
          }}
          onFieldChange={{
            aboutSubmenu1Images: handleImageFieldChange('aboutSubmenu1Images', 'aboutSubmenu1RemovedImages'),
            aboutSubmenu2Images: handleImageFieldChange('aboutSubmenu2Images', 'aboutSubmenu2RemovedImages'),
          }}
          dynamicSectionLabel={
            activeTab === 3
              ? aboutSmallBoxDynamicField.label
              : activeTab === 4
              ? aboutBannerFourDynamicField.label
              : undefined
          }
        />
      </FormProvider>
    </div>
  );
};

export default AboutBannertTemplate;