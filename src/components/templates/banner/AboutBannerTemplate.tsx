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
    fields: [...aboutSubmenu3Fields, aboutSmallBoxDynamicField],
    isDynamic: true,
    dynamicFieldName: 'aboutSmallBoxes',
    dynamicFieldConfig: aboutSmallBoxDynamicField.config,
    dynamicFieldLimit: aboutSmallBoxDynamicField.limit,
  },
  {
    id: 4,
    label: 'Banner Four',
    fields: [aboutBannerFourTitleField, aboutBannerFourDynamicField],
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

  // Handler for image field changes (removes, dedupes)
  const handleImageFieldChange = (fieldName: string, removedFieldName: string) => (e: { target: { value: any; removedFiles?: string[] } }) => {
    let images = Array.isArray(e.target.value) ? [...e.target.value] : [];
    // Remove deleted images
    if (e.target.removedFiles?.length) {
      images = images.filter(img => typeof img === 'string' ? !e.target.removedFiles!.includes(img) : true);
      setValue(removedFieldName, e.target.removedFiles, { shouldValidate: true });
    }
    // Deduplicate by string path or file name+size
    const unique: any[] = [];
    const seen = new Set<string>();
    images.forEach(img => {
      if (typeof img === 'string') {
        if (!seen.has(img)) { unique.push(img); seen.add(img); }
      } else if (img instanceof File) {
        const key = `${img.name}_${img.size}`;
        if (!seen.has(key)) { unique.push(img); seen.add(key); }
      }
    });
    setValue(fieldName, unique, { shouldValidate: true });
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
          ? bannerThree.smallBoxes.map((box: any) => ({
              count: box.count || '',
              label: box.label || '',
              description: box.description || '',
            }))
          : [],
        aboutBannerFourTitle: bannerFour.title || '',
        aboutBannerFourHistory: Array.isArray(bannerFour.history)
          ? bannerFour.history.map((item: any) => ({
              year: item.year || '',
              month: item.month || '',
              description: item.description || '',
            }))
          : [],
      };
      reset(formData);
    }
  }, [banner, reset]);

  const onSubmit = async (formData: AboutBannerFormData) => {
    clearErrors();
    try {
      const formDataObj = new FormData();
      const removedBannerOneImages = formData.aboutSubmenu1RemovedImages || [];
      const removedBannerTwoImages = formData.aboutSubmenu2RemovedImages || [];

      if (activeTab === 1) {
        formDataObj.append('aboutBanner.bannerOne.title', formData.aboutSubmenu1Title || '');
        formDataObj.append('aboutBanner.bannerOne.description', formData.aboutSubmenu1Description || '');
        if (formData.aboutSubmenu1BackgroundImage instanceof File) {
          formDataObj.append('aboutBanner.bannerOne.backgroundImage', formData.aboutSubmenu1BackgroundImage);
        } else if (typeof formData.aboutSubmenu1BackgroundImage === 'string' && formData.aboutSubmenu1BackgroundImage) {
          formDataObj.append('aboutBanner.bannerOne.backgroundImage', formData.aboutSubmenu1BackgroundImage);
        }
        if (Array.isArray(formData.aboutSubmenu1Images)) {
          const newFiles: File[] = [];
          const existingImages: { id: number; url: string }[] = [];
          formData.aboutSubmenu1Images.forEach((img: any) => {
            if (img && typeof img === 'object' && 'url' in img && 'id' in img) {
              if (!removedBannerOneImages.includes(img.url)) {
                existingImages.push(img);
              }
            } else if (img instanceof File) {
              newFiles.push(img);
            }
          });
          newFiles.forEach((img: any) => {
            formDataObj.append('aboutBanner.bannerOne.images', img);
          });
          if (existingImages.length > 0) {
            formDataObj.append('aboutBanner.bannerOne.images', JSON.stringify(existingImages));
          }
        }
        if (removedBannerOneImages.length > 0) {
          formDataObj.append('aboutBanner.bannerOne.removedImages', JSON.stringify(removedBannerOneImages));
        }
        await updateBanner(formDataObj);
        toast.success('Banner One updated successfully');
      } else if (activeTab === 2) {
        formDataObj.append('aboutBanner.bannerTwo.title', formData.aboutSubmenu2Title || '');
        formDataObj.append('aboutBanner.bannerTwo.description', formData.aboutSubmenu2Description || '');
        if (formData.aboutSubmenu2BackgroundImage instanceof File) {
          formDataObj.append('aboutBanner.bannerTwo.backgroundImage', formData.aboutSubmenu2BackgroundImage);
        } else if (typeof formData.aboutSubmenu2BackgroundImage === 'string' && formData.aboutSubmenu2BackgroundImage) {
          formDataObj.append('aboutBanner.bannerTwo.backgroundImage', formData.aboutSubmenu2BackgroundImage);
        }
        if (Array.isArray(formData.aboutSubmenu2Images)) {
          const newFiles: File[] = [];
          const existingImages: { id: number; url: string }[] = [];
          formData.aboutSubmenu2Images.forEach((img: any) => {
            if (img && typeof img === 'object' && 'url' in img && 'id' in img) {
              if (!removedBannerTwoImages.includes(img.url)) {
                existingImages.push(img);
              }
            } else if (img instanceof File) {
              newFiles.push(img);
            }
          });
          newFiles.forEach((img: any) => {
            formDataObj.append('aboutBanner.bannerTwo.images', img);
          });
          if (existingImages.length > 0) {
            formDataObj.append('aboutBanner.bannerTwo.images', JSON.stringify(existingImages));
          }
        }
        if (removedBannerTwoImages.length > 0) {
          formDataObj.append('aboutBanner.bannerTwo.removedImages', JSON.stringify(removedBannerTwoImages));
        }
        await updateBanner(formDataObj);
        toast.success('Banner Two updated successfully');
      } else if (activeTab === 3) {
        formDataObj.append('aboutBanner.bannerThree.title', formData.aboutSubmenu3Title || '');
        formDataObj.append('aboutBanner.bannerThree.description', formData.aboutSubmenu3Description || '');
        if (Array.isArray(formData.aboutSmallBoxes)) {
          formDataObj.append('aboutBanner.bannerThree.smallBoxes', JSON.stringify(formData.aboutSmallBoxes));
        }
        await updateBanner(formDataObj);
        toast.success('Banner Three updated successfully');
      } else if (activeTab === 4) {
        const bannerFour = {
          title: formData.aboutBannerFourTitle || '',
          history: Array.isArray(formData.aboutBannerFourHistory)
            ? formData.aboutBannerFourHistory.map((item: any) => ({
                year: item.year || '',
                month: item.month || '',
                description: item.description || '',
              }))
            : [],
        };
        formDataObj.append('aboutBanner.bannerFour', JSON.stringify(bannerFour));
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
        />
      </FormProvider>
    </div>
  );
};

export default AboutBannertTemplate;