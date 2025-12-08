import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCheck, FiUpload, FiMapPin, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { usePropertyStore } from '../../stores/PropertyStore';
import { useCategoryStore } from '../../stores/categoryStore';
import { generateSlug, getStatesOfCountry, getCitiesOfState } from '../../utils/helper';
import BAZModal from '../../atoms/BAZ-Modal';
import BAZJodiEdit from '../../atoms/BAZ-Jodit';
import Button from '../../atoms/BAZ-Button';
import { useParams, useNavigate } from 'react-router-dom';
import ImportedURL from '../../common/urls';
import FormHeader from '../../molecules/FormHeader';
import LabeledInput from '../../molecules/LabeledInput';

interface ExtendedFieldConfig {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: (string | { label: string; value: string })[];
  placeholder?: string;
  multiple?: boolean;
}

// Dynamic options state sourced from API-driven stores
const defaultOptionState: any[] = [];

const buildDynamicSteps = (opts: {
  categoryOptions: any[];
  propertyStatusOptions: any[];
  locationTypeOptions: any[];
  orientationOptions: any[];
  pricingTypeOptions: any[];
  fileTypeAllowedOptions: any[];
  interestsOptions: any[];
  zoneOptions: any[];
}) => {
  const {
    categoryOptions,
    propertyStatusOptions,
    locationTypeOptions,
    orientationOptions,
    pricingTypeOptions,
    fileTypeAllowedOptions,
    interestsOptions,
    zoneOptions,
  } = opts;

  const steps: { id: number; label: string; fields: ExtendedFieldConfig[] }[] = [
    {
      id: 1,
      label: 'Basic Info',
      fields: [
        { name: 'title', label: 'Property Title', type: 'text', required: true },
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'bannerCode', label: 'Banner Code', type: 'text', required: false },
        { name: 'category', label: 'Category', type: 'select', required: true, options: categoryOptions },
        { name: 'propertyStatus', label: 'Property Status', type: 'select', required: true, options: propertyStatusOptions },
        // { name: 'status', label: 'Status', type: 'select', required: true, options: ['active', 'inactive'] },
      ],
    },
    {
      id: 2,
      label: 'Location',
      fields: [
        { name: 'locationType', label: 'Location Type', type: 'select', required: true, options: locationTypeOptions },
        { name: 'locationName', label: 'Location Name', type: 'text', required: true },
        { name: 'landmark', label: 'Landmark', type: 'text', required: false },
        { name: 'address', label: 'Address', type: 'text', required: true },
        { name: 'state', label: 'State', type: 'state-select', required: true },
        { name: 'city', label: 'City', type: 'city-select', required: true },
        { name: 'pincode', label: 'Pincode', type: 'number', required: true },
      ],
    },
    {
      id: 3,
      label: 'Media',
      fields: [
        { name: 'images', label: 'Images', type: 'file', required: true, multiple: true },
        { name: 'previewImage', label: 'Preview Image', type: 'file', required: false },
        // { name: 'fileTypeAllowed', label: 'File Type Allowed', type: 'select', required: true, options: fileTypeAllowedOptions },
      ],
    },
    {
      id: 4,
      label: 'Size',
      fields: [
        { name: 'height', label: 'Size (Height in ft)', type: 'number', required: true },
        { name: 'width', label: 'Size (Width in ft)', type: 'number', required: true },
        { name: 'orientation', label: 'Orientation', type: 'select', required: true, options: orientationOptions },
        { name: 'fileTypeAllowed', label: 'File Type Allowed', type: 'select', required: true, options: fileTypeAllowedOptions },

      ],
    },
    {
      id: 5,
      label: 'Pricing',
      fields: [
        { name: 'pricingType', label: 'Pricing Type', type: 'select', required: true, options: pricingTypeOptions },
        { name: 'days', label: 'Number of Days', type: 'number', required: true },
        { name: 'minPrice', label: 'Price Minimum', type: 'number', required: true },
        { name: 'maxPrice', label: 'Price Maximum', type: 'number', required: true },
      ],
    },
    {
      id: 6,
      label: 'Description',
      fields: [
        { name: 'template', label: 'Description (template-enabled)', type: 'textarea', required: true, placeholder: 'Use placeholders like {{height}}, {{width}}, {{locationName}}' },
        { name: 'specifications', label: 'Specifications', type: 'dynamic', required: false },
      ],
    },
    {
      id: 7,
      label: 'Performance',
      fields: [
        { name: 'monthlyImpressions', label: 'Estimated Monthly Impressions', type: 'text', required: true, placeholder: 'e.g., "1.5M+ views/month"' },
        { name: 'dailyVisibility', label: 'Daily Visibility Duration', type: 'text', required: true, placeholder: 'e.g., "24/7 exposure"' },
        { name: 'trafficData', label: 'Vehicle Traffic', type: 'number', required: true, placeholder: 'Average Daily Traffic – ADT' },
        { name: 'dwellTime', label: 'Audience Dwell Time', type: 'text', required: true, placeholder: 'e.g., "Avg. 30 seconds"' },
      ],
    },
    {
      id: 8,
      label: 'Targeting',
      fields: [
        { name: 'nearbyInstitutions', label: 'Nearby Institutions', type: 'text', required: true, placeholder: 'Schools, Colleges, Hospitals, Malls' },
        { name: 'zone', label: 'Zone', type: 'select', required: true, options: zoneOptions },
        { name: 'interests', label: 'Interests', type: 'select', required: true, multiple: true, options: interestsOptions },
        { name: 'visibilityRange', label: 'Banner Visibility Range', type: 'number', required: true, placeholder: 'in km/m' },
      ],
    },
  ];

  return steps;
};

const PropertyFormTemplate: React.FC = () => {
  const methods = useForm({ defaultValues: {}, mode: 'onSubmit' });
  const { handleSubmit } = methods;
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<any>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: number; url: string }[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState([{ title: '', feature: '' }]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<Record<string, any> | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [previewImagePreview, setPreviewImagePreview] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previewImageName, setPreviewImageName] = useState<string>("");


  // Default country for state and city options (India)
  const defaultCountry = 'IN';
  const [stateOptions, setStateOptions] = useState<{ label: string; value: string }[]>([]);
  const [cityOptions, setCityOptions] = useState<{ label: string; value: string }[]>([]);

  // stores and options
  const { fetchPropertyConfig, propertyConfig, addProperty, fetchPropertyById, updateProperty, fetchNextBannerCode, nextBannerCode, loading, error: storeError } = usePropertyStore();
  const { fetchAllCategories } = useCategoryStore();

  const [categoryOptions, setCategoryOptions] = useState<any[]>(defaultOptionState);
  const [interestsOptions, setInterestsOptions] = useState<string[]>(defaultOptionState);
  const [locationTypeOptions, setLocationTypeOptions] = useState<string[]>(defaultOptionState);
  const [zoneOptions, setZoneOptions] = useState<string[]>(defaultOptionState);
  const [orientationOptions, setOrientationOptions] = useState<string[]>(defaultOptionState);
  const [pricingTypeOptions, setPricingTypeOptions] = useState<string[]>(defaultOptionState);
  const [propertyStatusOptions, setPropertyStatusOptions] = useState<string[]>(defaultOptionState);
  const [fileTypeAllowedOptions, setFileTypeAllowedOptions] = useState<string[]>(defaultOptionState);

  const [steps, setSteps] = useState<{ id: number; label: string; fields: ExtendedFieldConfig[] }[]>(
    buildDynamicSteps({
      categoryOptions: [],
      propertyStatusOptions: [],
      locationTypeOptions: [],
      orientationOptions: [],
      pricingTypeOptions: [],
      fileTypeAllowedOptions: [],
      interestsOptions: [],
      zoneOptions: [],
    })
  );

  // fetch categories
  useEffect(() => {
    const run = async () => {
      try {
        const allCategories = await fetchAllCategories();
        const options = (allCategories || [])
          .filter((c: any) => c && c._id && c.name)
          .map((c: any) => ({ label: String(c.name), value: String(c._id) }));
        setCategoryOptions(options);
      } catch (e) {
        setCategoryOptions([]);
      }
    };
    run();
  }, [fetchAllCategories]);

  // fetch property config
  useEffect(() => {
    fetchPropertyConfig();
  }, [fetchPropertyConfig]);

  // fetch next banner code for new properties
  useEffect(() => {
    if (!id) {
      fetchNextBannerCode();
    }
  }, [id, fetchNextBannerCode]);

  // set options from config when available
  useEffect(() => {
    if (!propertyConfig) return;
    const pick = (slug: string) => {
      const cfg = propertyConfig.find((c: any) => c.slug === slug);
      return cfg ? cfg.configFields.map((f: any) => String(f.value)) : [];
    };
    setInterestsOptions(pick('interests'));
    setLocationTypeOptions(pick('location-type'));
    setZoneOptions(pick('zone'));
    setOrientationOptions(pick('orientation'));
    setPricingTypeOptions(pick('pricing-type'));
    setPropertyStatusOptions(pick('property-status'));
    setFileTypeAllowedOptions(pick('file-type-allowed'));
  }, [propertyConfig]);

  // populate bannerCode from store when available (only for new properties)
  useEffect(() => {
    if (!id && nextBannerCode) {
      setFormData((prev) => ({ ...prev, bannerCode: nextBannerCode }));
    }
  }, [id, nextBannerCode]);

  // rebuild steps when any options change
  useEffect(() => {
    setSteps(
      buildDynamicSteps({
        categoryOptions,
        propertyStatusOptions,
        locationTypeOptions,
        orientationOptions,
        pricingTypeOptions,
        fileTypeAllowedOptions,
        interestsOptions,
        zoneOptions,
      })
    );
  }, [
    categoryOptions,
    propertyStatusOptions,
    locationTypeOptions,
    orientationOptions,
    pricingTypeOptions,
    fileTypeAllowedOptions,
    interestsOptions,
    zoneOptions,
  ]);

  // Compute state and city options based on formData
  useEffect(() => {
    setStateOptions(getStatesOfCountry(defaultCountry));
  }, [defaultCountry]);

  useEffect(() => {
    if (formData.state) {
      setCityOptions(getCitiesOfState(defaultCountry, formData.state));
    } else {
      setCityOptions([]);
    }
  }, [formData.state, defaultCountry]);

  const stepHeaders = [
    { title: 'Basic Information', desc: 'Provide the basic details about your property' },
    { title: 'Location Details', desc: 'Provide the location details of your property' },
    { title: 'Media Uploads', desc: 'Upload images and media for your property' },
    { title: 'Size & Orientation', desc: 'Specify the physical dimensions and orientation' },
    { title: 'Pricing & Duration', desc: 'Set the pricing details for your property' },
    { title: 'Description & Features', desc: 'Add detailed description and specifications' },
    { title: 'Performance Metrics', desc: 'Define performance and visibility metrics' },
    { title: 'Surroundings & Targeting', desc: 'Specify surroundings and target audience' },
    { title: 'Review & Submit', desc: 'Review all details before final submission' },
  ];

  const totalSteps = steps.length > 0 ? steps.length + 1 : 0;
  const completionPercentage = totalSteps > 0 ? Math.floor((activeStep / totalSteps) * 100) : 0;

  // Simple validation for demo
  const validateStep = (step: number): boolean => {
    if (!steps.length) return false;
    const stepFields = steps[step - 1]?.fields || [];
    const newErrors: any = {};
    stepFields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, files } = e.target as any;

// if (type === 'file') {
//   if (files && files.length > 0) {
//     const newFiles = Array.from(files as File[]);  // 🔥 Cast files → File[]

//     setFormData((prev) => ({
//       ...prev,
//       images: [
//         ...(prev.images || []).filter((img: string | File) => typeof img === "string"), // 🔥 Typed
//         ...newFiles
//       ]
//     }));

//     // 🔥 Cast file as File so URL.createObjectURL accepts it
//     const newPreviews = newFiles.map((file: File) => URL.createObjectURL(file));

//     setImagePreviews((prev) => [
//       ...prev.slice(0, existingImages.length),
//       ...newPreviews,
//     ]);
//   }

//   return; // Prevent fallback logic
// }
if (type === "file") {

  // 🟦 CASE 1: IMAGES FIELD (old code unchanged)
  if (name === "images") {
    if (files && files.length > 0) {
      const newFiles = Array.from(files as File[]);

      setFormData((prev) => ({
        ...prev,
        images: [
          ...(prev.images || []).filter((img: string | File) => typeof img === "string"),
          ...newFiles,
        ],
      }));

      const newPreviews = newFiles.map((file: File) =>
        URL.createObjectURL(file)
      );

      setImagePreviews((prev) => [
        ...prev.slice(0, existingImages.length),
        ...newPreviews,
      ]);
    }

    return; // Stop execution
  }

  // 🟩 CASE 2: PREVIEW IMAGE FIELD (new correct block)
  if (name === "previewImage") {
    const file = (files as FileList)[0];

    setFormData((prev) => ({
      ...prev,
      previewImage: file,
    }));

    // create separate preview for previewImage
    setPreviewImagePreview(URL.createObjectURL(file));

    return;
  }
}

 else {
      if (name === 'title') {
        const slugVal = generateSlug(value);
        setFormData((prev: Record<string, any>) => ({ ...prev, title: value, slug: slugVal }));
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>, fieldName: string) => {
    const values = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setFormData({ ...formData, [fieldName]: values });
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { title: '', feature: '' }]);
  };

  const removeSpecification = (index: number) => {
    const newSpecs = [...specifications];
    newSpecs.splice(index, 1);
    setSpecifications(newSpecs);
  };

  const handleSpecChange = (index: number, field: string, value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field as keyof (typeof newSpecs)[number]] = value;
    setSpecifications(newSpecs);
  };

const removeImage = (index: number) => {
  const totalExisting = existingImages.length;

  // CASE 1: Removing existing image
  if (index < totalExisting) {
    const removed = existingImages[index];

    setRemovedImages(prev => [...prev, removed.url]);

    setExistingImages(prev => prev.filter((_, i) => i !== index));

    // Remove from formData.images (urls)
    setFormData(prev => ({
      ...prev,
      images: (prev.images as (string | File)[] || []).filter(
        (img: string | File, i: number) => {
          if (typeof img === "string") {
            return img !== removed.url;
          }
          return true; // keep Files
        }
      )
    }));

    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    return;
  }

  // CASE 2: Removing newly uploaded file
  const newIndex = index - totalExisting;

  setFormData(prev => ({
    ...prev,
    images: (prev.images as (string | File)[] || []).filter(
      (img: string | File, i: number) => {
        if (typeof img === "string") return true;
        return i !== newIndex;
      }
    )
  }));

  setImagePreviews(prev => prev.filter((_, i) => i !== index));
};




  const nextStep = () => {
    if (activeStep < steps.length) {
      if (validateStep(activeStep)) {
        setActiveStep(prev => Math.min((steps.length + 1) || 1, prev + 1));
      }
      return;
    }

    // At last data-entry step, validate and build review data then go to review step
    if (activeStep === steps.length) {
      if (!validateStep(activeStep)) return;

      const finalData: Record<string, any> = { ...formData, specifications };
      const templateText: string = (finalData.template as string) || '';
      const getValue = (obj: any, path: string) => {
        try {
          return path.split('.').reduce((acc: any, key: string) => (acc ? acc[key] : undefined), obj);
        } catch {
          return undefined;
        }
      };
      const processedDescription = templateText.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_m, p1) => {
        const v = getValue(finalData, p1);
        return v !== undefined && v !== null ? String(v) : '';
      });

      setSubmittedData({ ...finalData, description: processedDescription });
      setIsPreviewVisible(true);
      setActiveStep(steps.length + 1);
    }
  };

  const prevStep = () => {
    setActiveStep(prev => Math.max(1, prev - 1));
  };

  // Load existing property in edit mode
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    const load = async () => {
      if (!id || isInitialized) return;
      const property = await fetchPropertyById(id);
      if (property) {
       
        console.log('Loaded property for edit:', property);
        // Normalize incoming property into our flat formData shape
        const flat: Record<string, any> = {
          title: property.title || '',
          slug: property.slug || '',
          bannerCode: property.bannerCode || '',
          category: typeof property.category === 'object' ? property.category._id : property.category || '',
          locationType: property.locationType || '',
          locationName: property.locationName || '',
          address: property.address || '',
          city: property.city || '',
          state: property.state || '',
          pincode: property.pincode || '',
          landmark: property.landmark || '',
          coordinates: property.coordinates || undefined,
          // Keep existing image URLs in formData so UI can show previews in edit mode
          images: Array.isArray(property.images) ? property.images : [],
          // previewImage: prefer explicit previewImage, fall back to first image path if present
          previewImage: property.previewImage || (Array.isArray(property.images) && property.images.length > 0 ? property.images[0] : undefined) || undefined,
          height: property.size?.height || '',
          width: property.size?.width || '',
          orientation: property.orientation || '',
          pricingType: property.pricingType || '',
          days: property.days || '',
          minPrice: property.priceRange?.min || '',
          maxPrice: property.priceRange?.max || '',
          // Template/editor initial value - backend may store HTML under different keys
          template: property.description || (property as any).template || (property as any).html || (property as any).content || '',
          monthlyImpressions: property.estimatedMonthlyImpressions || '',
          dailyVisibility: property.dailyVisibilityDuration || '',
          trafficData: property.vehicleTrafficData || '',
          dwellTime: property.audienceDwellTime || '',
          nearbyInstitutions: property.nearbyInstitutions || '',
          zone: property.zone || '',
          interests: property.interests || [],
          visibilityRange: property.bannerVisibilityRange || '',
          fileTypeAllowed: property.fileTypeAllowed || '',
          propertyStatus: property.propertyStatus || '',
          
        };
      
        console.log('Setting formData (flat):', flat);
        setFormData(flat);
        // Prepare image previews (full URLs) for display in edit mode
        try {
          const imgs: string[] = Array.isArray(property.images)
            ? (property.images as any[]).filter((i: any) => typeof i === 'string') as string[]
            : [];
          const previews = imgs.map((img: string) => {
            const clean = String(img).replace(/^\//, '');
            return `${ImportedURL.FILEURL.replace(/\/$/, '')}/${clean}`;
          });
          // Debug: log computed image preview URLs
          // eslint-disable-next-line no-console
          console.log('Computed imagePreviews:', previews);
          setImagePreviews(previews);

          // Set existing images for proper tracking
          const existing = imgs.map((img: string, idx: number) => ({
            id: idx + 1,
            url: img
          }));
          setExistingImages(existing);
        } catch (e) {
          setImagePreviews([]);
          setExistingImages([]);
        }
        if (property.previewImage && typeof property.previewImage === "string") {
  const clean = property.previewImage.replace(/^\//, "");
  const fullURL = `${ImportedURL.FILEURL.replace(/\/$/, "")}/${clean}`;

  setPreviewImagePreview(fullURL);

  setFormData((prev) => ({
    ...prev,
    previewImage: fullURL,
  }));
}

        setSpecifications(Array.isArray(property.specifications) ? property.specifications : [{ title: '', feature: '' }]);
        setIsInitialized(true);
      }
    };
    load();
  }, [id, isInitialized, fetchPropertyById]);

  const onSubmit = async () => {
    // Only submit if we're on the review page (activeStep > steps.length)
    // All validation has already been done while stepping through the form
    if (activeStep <= steps.length) {
      setSubmitError('Please complete all steps before submitting');
      return;
    }

    // Aggregate and normalize values
    const finalData: Record<string, any> = { ...formData, specifications };

    // Validate arrays
    if (!finalData.interests || (Array.isArray(finalData.interests) && finalData.interests.length === 0)) {
      setSubmitError('At least one interest must be selected');
      return;
    }

    const validSpecs = specifications.filter((s: any) => s.title && s.feature);
    if (validSpecs.length === 0) {
      setSubmitError('At least one specification is required (title and feature)');
      return;
    }


      // Debug: show assembled finalData before restructuring
      // eslint-disable-next-line no-console
      console.log('finalData before restructure:', Object.keys(finalData), finalData);

      // Reconstruct nested objects from flat keys (coordinates.latitude -> coordinates.latitude)
      if ((finalData['coordinates.latitude'] !== undefined || finalData['coordinates.longitude'] !== undefined)) {
        finalData.coordinates = {
          latitude: finalData['coordinates.latitude'],
          longitude: finalData['coordinates.longitude']
        };
        // eslint-disable-next-line no-console
        console.log('Reconstructed coordinates from flat keys:', finalData.coordinates);
        delete finalData['coordinates.latitude'];
        delete finalData['coordinates.longitude'];
      }

      // Reconstruct size from flat keys (height, width)
      if (finalData.height !== undefined || finalData.width !== undefined) {
        finalData.size = {
          height: finalData.height,
          width: finalData.width
        };
      }

      // Reconstruct priceRange from flat keys (minPrice, maxPrice)
      if (finalData.minPrice !== undefined || finalData.maxPrice !== undefined) {
        finalData.priceRange = {
          min: finalData.minPrice,
          max: finalData.maxPrice
        };
      }

    // Process template placeholders like {{height}}, {{width}}, {{locationName}}
    const templateText: string = (finalData.template as string) || '';
    const getValue = (obj: any, path: string) => {
      try {
        return path.split('.').reduce((acc: any, key: string) => (acc ? acc[key] : undefined), obj);
      } catch {
        return undefined;
      }
    };
    const processedDescription = templateText.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_m, p1) => {
      const v = getValue(finalData, p1);
      return v !== undefined && v !== null ? String(v) : '';
    });

    // Build FormData similar to PropertyFormTemplate
    const fd = new FormData();
    const append = (key: string, value: any) => {
      if (value === undefined || value === null) return;
      if (value instanceof File) return fd.append(key, value);
      if (Array.isArray(value)) {
        value.forEach((val) => append(key, val));
        return;
      }
      if (typeof value === 'object') return fd.append(key, JSON.stringify(value));
      fd.append(key, String(value));
    };

    // Map flat fields
    append('title', finalData.title);
    append('slug', finalData.slug);
    append('bannerCode', finalData.bannerCode);
    append('category', finalData.category);
    append('locationType', finalData.locationType);
    append('locationName', finalData.locationName);
    append('address', finalData.address);
    append('city', finalData.city);
    append('state', finalData.state);
    append('pincode', finalData.pincode);
    append('landmark', finalData.landmark);

    // Coordinates - ensure proper structure with numeric types
    if (finalData.coordinates && (finalData.coordinates.latitude !== undefined && finalData.coordinates.longitude !== undefined)) {
      fd.append('coordinates', JSON.stringify({
        latitude: Number(finalData.coordinates.latitude),
        longitude: Number(finalData.coordinates.longitude)
      }));
    }
fd.append("existingImages", JSON.stringify(existingImages.map(img => img.url)));
fd.append("removedImages", JSON.stringify(removedImages));
    // Images

(formData.images || [])
  .filter((img: any) => img instanceof File)  // Only actual File objects
  .forEach((file: File) => {
    fd.append("images", file);  // ← Critical: use "images", not "newImages"
  });

// 2. Send metadata as regular fields (NOT as files)




    // Preview image (optional File)
    if (finalData.previewImage instanceof File) {
      fd.append('previewImage', finalData.previewImage);
    }

    // Size - send as JSON string with numeric coercion
    if (finalData.size && (finalData.size.height !== undefined || finalData.size.width !== undefined)) {
      fd.append('size', JSON.stringify({
        height: Number(finalData.size.height),
        width: Number(finalData.size.width)
      }));
    }

    // Orientation, pricing, days
    append('orientation', finalData.orientation);
    append('pricingType', finalData.pricingType);
    append('days', parseInt(String(finalData.days)) || finalData.days);

    // Price range - send as JSON string with numeric coercion
    if (finalData.priceRange && (finalData.priceRange.min !== undefined || finalData.priceRange.max !== undefined)) {
      fd.append('priceRange', JSON.stringify({
        min: Number(finalData.priceRange.min),
        max: Number(finalData.priceRange.max)
      }));
    }

    // Template -> template and description (required by backend)
    append('template', templateText);
    append('description', processedDescription);

    // Specifications - send as JSON string array
    if (Array.isArray(finalData.specifications) && finalData.specifications.length > 0) {
      // Filter out empty specs
      const specs = finalData.specifications.filter((s: any) => s.title && s.feature);
      if (specs.length > 0) {
        fd.append('specifications', JSON.stringify(specs));
      }
    }

    // Performance
    append('estimatedMonthlyImpressions', finalData.monthlyImpressions);
    append('dailyVisibilityDuration', finalData.dailyVisibility);
    append('vehicleTrafficData', finalData.trafficData);
    append('audienceDwellTime', finalData.dwellTime);

    // Targeting
    // nearbyInstitutions as array
    const nearby = finalData.nearbyInstitutions;
    if (nearby) {
      if (typeof nearby === 'string') {
        // Convert comma-separated string to array
        fd.append('nearbyInstitutions', JSON.stringify(nearby.split(',').map((v: string) => v.trim()).filter((v: string) => v)));
      } else if (Array.isArray(nearby)) {
        fd.append('nearbyInstitutions', JSON.stringify(nearby));
      } else {
        fd.append('nearbyInstitutions', JSON.stringify([nearby]));
      }
    }
    
    // interests as array
    if (Array.isArray(finalData.interests) && finalData.interests.length > 0) {
      fd.append('interests', JSON.stringify(finalData.interests));
    }
    
    append('zone', finalData.zone);
    append('bannerVisibilityRange', parseFloat(String(finalData.visibilityRange)) || finalData.visibilityRange);

    
    append('fileTypeAllowed', finalData.fileTypeAllowed);
    
   fd.append("removedImages", JSON.stringify(removedImages));
    
    setSubmittedData({ ...finalData, description: processedDescription });
    setIsPreviewVisible(true);
    setSubmitError(null);

    try {
      
      try {
        
        for (const pair of (fd as any).entries()) {
          
          console.log('FormData entry:', pair[0], pair[1]);
        }
      } catch (logErr) {
        
      }

      if (id) {
        await updateProperty(id, fd);
      } else {
        console.log(fd,
          'fd'
        );

        await addProperty(fd);
      }

      setSubmitError(null);
      // navigate('/properties');
    } catch (e: any) {
      const errorMsg = e?.response?.data?.message || e?.message || 'Failed to save property';
      setSubmitError(errorMsg);
      console.error('Failed to save property', e);
    }
  };

  const renderField = (field: ExtendedFieldConfig) => {
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'textarea':
        if (field.name === 'template') {
          return (
            <div className="space-y-2">
              <textarea
                name={field.name}
                value={value}
                onChange={handleChange}
                onClick={() => setIsEditorOpen(true)}
                className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                rows={6}
                readOnly
              />
              <div className="flex justify-end">
                <Button type="button" className="px-3 py-1 bg-[var(--puprle-color)] text-white rounded" onClick={() => setIsEditorOpen(true)}>
                  Open Editor
                </Button>
              </div>
              <BAZModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} title="Edit Template" size="xl">
                <div className="p-4 space-y-4">
                  <BAZJodiEdit
                    placeholder="Enter template with placeholders like {{height}}, {{width}}"
                    value={value}
                    onChange={(val: string) => setFormData((prev: any) => ({ ...prev, template: val }))}
                    managementName="Property"
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" className="px-4 py-2 bg-gray-600 text-white rounded" onClick={() => setIsEditorOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </BAZModal>
            </div>
          );
        }
        return (
          <textarea
            name={field.name}
            value={value}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            rows={3}
          />
        );

      case 'select':
      case 'state-select':
      case 'city-select': {
        const rawOptions = field.type === 'state-select' ? stateOptions : field.type === 'city-select' ? cityOptions : field.options || [];
        const options = rawOptions.map((opt) =>
          typeof opt === 'string' ? { label: opt, value: opt } : opt
        );
        return (
          <LabeledInput
            name={field.name}
            label=""
            type={field.type}
            value={value}
            onChange={(e) => {
              setFormData({ ...formData, [e.target.name]: e.target.value });
              if (errors[e.target.name]) {
                setErrors({ ...errors, [e.target.name]: '' });
              }
            }}
            options={options}
            multiple={field.multiple}
            required={field.required}
            error={errors[field.name]}
          />
        );
      }

      case 'file':
        if (field.name === 'images') {
          return (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-32 bg-[var(--dark-color)] border-2 border-dashed border-[var(--light-blur-grey-color)] rounded cursor-pointer hover:border-[var(--puprle-color)] transition-colors">
                <div className="text-center p-4">
                  <FiUpload className="h-6 w-6 text-[var(--light-grey-color)] mx-auto mb-2" />
                  <span className="text-xs text-[var(--light-grey-color)]">Click to upload or drag and drop</span>
                  <p className="text-xs text-[var(--light-grey-color)] mt-1">JPG, PNG or GIF (Max 5MB each)</p>
                </div>
                <input
                  type="file"
                  name={field.name}
                  onChange={handleChange}
                  className="hidden"
                  accept="image/*"
                  multiple={field.multiple}
                />
              </label>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded border border-[var(--light-blur-grey-color)]"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }
        return (
          // <input
          //   type="file"
          //   name={field.name}
          //   onChange={handleChange}
          //   className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
          //   accept="image/*"
          // />
          <div className="space-y-3">
  <input
    type="file"
    name={field.name}
    onChange={handleChange}
    className="w-full px-3 py-2 bg-[var(--dark-color)] border
               border-[var(--light-blur-grey-color)] rounded text-xs text-white
               focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
    accept="image/*"
  />

  {/* SHOW PREVIEW ONLY IF SELECTED */}
  {previewImagePreview && (
    <div className="mt-2">
      {/* <p className="text-xs text-[var(--light-grey-color)] mb-1">Preview Image</p> */}
      <img
        src={previewImagePreview}
        className="w-32 h-32 object-cover rounded border border-[var(--light-blur-grey-color)]"
        alt="Preview"
      />
    </div>
  )}
</div>

        );

      case 'dynamic':
        if (field.name === 'specifications') {
          return (
            <div className="space-y-3">
              {specifications.map((spec, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Specification title"
                      value={spec.title}
                      onChange={(e) => handleSpecChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Specification feature"
                      value={spec.feature}
                      onChange={(e) => handleSpecChange(index, 'feature', e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                    />
                    {specifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-400 p-1"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addSpecification}
                className="text-xs text-[var(--puprle-color)]"
              >
                + Add Specification
              </button>
            </div>
          );
        }
        return null;

      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={value}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      <FormHeader
        managementName="Properties"
        addButtonLink="/properties"
        type="Add"
      />

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-[var(--light-grey-color)]">Step {activeStep} of {totalSteps}</span>
          <span className="text-xs text-[var(--puprle-color)]">{completionPercentage}% Complete</span>
        </div>
        <div className="w-full bg-[var(--dark-color)] rounded-full h-2">
          <div
            className="bg-[var(--puprle-color)] h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-4">
          {steps.map((stepItem) => (
            <div key={stepItem.id} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                activeStep > stepItem.id ? 'bg-[var(--puprle-color)] text-white' :
                activeStep === stepItem.id ? 'bg-white text-[var(--dark-color)]' :
                'bg-[var(--dark-color)] text-[var(--light-grey-color)] border border-[var(--light-blur-grey-color)]'
              }`}>
                {activeStep > stepItem.id ? <FiCheck className="h-4 w-4" /> : stepItem.id}
              </div>
              <span className={`text-xs mt-1 ${activeStep >= stepItem.id ? 'text-white' : 'text-[var(--light-grey-color)]'}`}>
                {stepItem.label}
              </span>
            </div>
          ))}
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
              activeStep > steps.length ? 'bg-[var(--puprle-color)] text-white' :
              activeStep === steps.length + 1 ? 'bg-white text-[var(--dark-color)]' :
              'bg-[var(--dark-color)] text-[var(--light-grey-color)] border border-[var(--light-blur-grey-color)]'
            }`}>
              {steps.length + 1}
            </div>
            <span className={`text-xs mt-1 ${activeStep >= steps.length + 1 ? 'text-white' : 'text-[var(--light-grey-color)]'}`}>
              Review & Submit
            </span>
          </div>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm p-6"
      >
        <AnimatePresence mode="wait">
          {activeStep <= steps.length ? (
            <motion.div
              key={`step-${activeStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">{stepHeaders[activeStep-1].title}</h3>
              <p className="text-xs text-[var(--light-grey-color)] mb-6">{stepHeaders[activeStep-1].desc}</p>
              {activeStep === 6 ? (
                <div className="space-y-6">
                  {/* Specifications */}
                  <div className="w-full">
                    <label className="block text-xs text-[var(--light-grey-color)] mb-1">
                      Specifications{errors.specifications && <span className="text-red-400">*</span>}
                    </label>
                    {renderField(steps[5].fields[1])}
                    {errors.specifications && <p className="text-xs text-red-400 mt-1">{errors.specifications}</p>}
                  </div>
                  {/* Description */}
                  <div className="w-full">
                    <label className="block text-xs text-[var(--light-grey-color)] mb-1">
                      Description (template-enabled){errors.template && <span className="text-red-400">*</span>}
                    </label>
                    {renderField(steps[5].fields[0])}
                    {errors.template && <p className="text-xs text-red-400 mt-1">{errors.template}</p>}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {steps[activeStep-1].fields.map((field) => (
                    <div key={field.name} className="w-full">
                      <label className="block text-xs text-[var(--light-grey-color)] mb-1">
                        {field.label}{field.required && <span className={(errors[field.name] || (field.required && !formData[field.name])) ? 'text-red-400' : 'text-[var(--light-grey-color)]'}>*</span>}
                      </label>
                      {renderField(field)}
                      {(field.type !== 'select' && field.type !== 'state-select' && field.type !== 'city-select') && errors[field.name] && <p className="text-xs text-red-400 mt-1">{errors[field.name]}</p>}
                    </div>
                  ))}

                  {/* Special case for map in location step */}
                  {activeStep === 2 && (
                    <div className="w-full">
                      <label className="block text-xs text-[var(--light-grey-color)] mb-1">Pin on Map</label>
                      <div className="h-32 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded flex items-center justify-center">
                        <div className="text-center">
                          <FiMapPin className="h-5 w-5 text-[var(--light-grey-color)] mx-auto mb-1" />
                          <p className="text-xs text-[var(--light-grey-color)]">Map integration will be implemented here</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">{stepHeaders[stepHeaders.length - 1].title}</h3>
              <p className="text-xs text-[var(--light-grey-color)] mb-6">{stepHeaders[stepHeaders.length - 1].desc}</p>
              {/* Review preview content appears below the form based on activeStep check */}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between pt-8 mt-8 border-t border-[var(--light-blur-grey-color)]">
          <button
            type="button"
            onClick={prevStep}
            disabled={activeStep === 1 || loading}
            className={`flex items-center px-4 py-2 text-xs rounded transition-colors ${
              activeStep === 1 || loading
                ? 'bg-[var(--dark-color)] text-[var(--light-grey-color)] cursor-not-allowed'
                : 'bg-[var(--dark-color)] text-[var(--light-grey-color)] hover:bg-[var(--light-blur-grey-color)]/20 border border-[var(--light-blur-grey-color)]'
            }`}
          >
            <FiChevronLeft className="mr-1" /> Previous
          </button>

          {activeStep < steps.length + 1 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={loading}
              className={`flex items-center px-4 py-2 text-xs rounded transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''} bg-[var(--puprle-color)] text-white hover:bg-[var(--puprle-color)]/90`}
            >
              {activeStep === steps.length ? 'Next: Review' : 'Next'} <FiChevronRight className="ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center px-4 py-2 text-xs bg-[var(--puprle-color)] text-white rounded transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--puprle-color)]/90'}`}
            >
              {loading ? (
                <>
                  <FiLoader className="mr-1 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <FiCheck className="mr-1" /> Submit Property
                </>
              )}
            </button>
          )}
        </div>

        {submitError && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-600 rounded flex items-start gap-2">
            <FiAlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-red-600">Error</p>
              <p className="text-xs text-red-400">{submitError}</p>
            </div>
          </div>
        )}
      </motion.form>

      {activeStep === steps.length + 1 && submittedData && (
        <div className="mt-6 bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white"> Property Preview</h3>
            <Button type="button" className="px-3 py-1 bg-[var(--dark-color)] text-[var(--light-grey-color)] border border-[var(--light-blur-grey-color)] rounded" onClick={() => setIsPreviewVisible(v => !v)}>
              {isPreviewVisible ? 'Hide Preview' : 'Show Preview'}
            </Button>
          </div>
          {isPreviewVisible && (
          <div className="space-y-10 text-sm">

  {/* Row 1 — Basic + Location + Size/Pricing */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-9">

    {/* Basic */}
    <div>
      <h4 className="text-white font-medium mb-2">Basic</h4>
      <p className="text-[var(--light-grey-color)]">Title: <span className="text-white">{submittedData.title || '—'}</span></p>
      <p className="text-[var(--light-grey-color)]">Slug: <span className="text-white">{submittedData.slug || '—'}</span></p>
      <p className="text-[var(--light-grey-color)]">Banner Code: <span className="text-white">{submittedData.bannerCode || '—'}</span></p>
      <p className="text-[var(--light-grey-color)]">
        Category: <span className="text-white">
          {categoryOptions.find(opt => opt.value === submittedData.category)?.label || '—'}
        </span>
      </p>
      <p className="text-[var(--light-grey-color)]">Property Status: <span className="text-white">{submittedData.propertyStatus || '—'}</span></p>
    </div>

    {/* Location */}
    <div>
      <h4 className="text-white font-medium mb-2">Location</h4>
      <p className="text-[var(--light-grey-color)]">Type: <span className="text-white">{submittedData.locationType || '—'}</span></p>
      <p className="text-[var(--light-grey-color)]">Name: <span className="text-white">{submittedData.locationName || '—'}</span></p>
      <p className="text-[var(--light-grey-color)]">Landmark: <span className="text-white">{submittedData.landmark || '—'}</span></p>
      <p className="text-[var(--light-grey-color)]">Address: <span className="text-white">{submittedData.address || '—'}</span></p>
      <p className="text-[var(--light-grey-color)]">City / State / Pincode:
        <span className="text-white">
          {submittedData.city || '—'} / {submittedData.state || '—'} / {submittedData.pincode || '—'}
        </span>
      </p>
    </div>

    {/* Size + Pricing */}
    <div>
      <h4 className="text-white font-medium mb-2">Size & Pricing</h4>
      <p className="text-[var(--light-grey-color)]">Height × Width:
        <span className="text-white"> {submittedData.height || '—'} × {submittedData.width || '—'}</span>
      </p>
      <p className="text-[var(--light-grey-color)]">Orientation: <span className="text-white">{submittedData.orientation || '—'}</span></p>
      <p className="text-[var(--light-grey-color)]">Pricing Type: <span className="text-white">{submittedData.pricingType || '—'}</span></p>
      <p className="text-[var(--light-grey-color)]">Days: <span className="text-white">{submittedData.days || '—'}</span></p>
      <p className="text-[var(--light-grey-color)]">Price Range:
        <span className="text-white">{submittedData.minPrice || '—'} - {submittedData.maxPrice || '—'}</span>
      </p>
    </div>

  </div>

  {/* Row 2 — Specifications + Performance + Targeting */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-9">

    {/* Specifications */}
    <div>
      <h4 className="text-white font-medium mb-2">Specifications</h4>
      {submittedData.specifications?.length ? (
        <ul className="list-disc pl-6 text-[var(--light-grey-color)]">
          {submittedData.specifications?.map(
  (s: { title: string; feature: string }, i: number) => (
    <li key={i} className="text-white">
      <span className="text-[var(--light-grey-color)]">{s.title}:</span> {s.feature}
    </li>
  )
)}

        </ul>
      ) : (
        <p className="text-[var(--light-grey-color)]">—</p>
      )}
    </div>

    {/* Performance */}
    <div>
      <h4 className="text-white font-medium mb-2">Performance</h4>
      <p className="text-[var(--light-grey-color)]">Monthly Impressions: <span className="text-white">{submittedData.monthlyImpressions || '—'}</span></p>
      <p className="text-[var(--light-grey-color)]">Daily Visibility: <span className="text-white">{submittedData.dailyVisibility || '—'}</span></p>
      <p className="text-[var(--light-grey-color)]">Traffic Data: <span className="text-white">{submittedData.trafficData || '—'}</span></p>
      <p className="text-[var(--light-grey-color)]">Dwell Time: <span className="text-white">{submittedData.dwellTime || '—'}</span></p>
    </div>

    {/* Targeting */}
    <div>
      <h4 className="text-white font-medium mb-2">Targeting</h4>
      <p className="text-[var(--light-grey-color)]">Nearby Institutions: <span className="text-white">{submittedData.nearbyInstitutions || '—'}</span></p>
      <p className="text-[var(--light-grey-color)]">Zone: <span className="text-white">{submittedData.zone || '—'}</span></p>

      <p className="text-[var(--light-grey-color)]">Interests:</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {submittedData.interests?.map((v: string, i: number) => (
  <span
    key={i}
    className="px-2 py-1 text-xs bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] text-white rounded"
  >
    {v}
  </span>
))}

      </div>

      <p className="text-[var(--light-grey-color)] mt-2">Visibility Range:
        <span className="text-white"> {submittedData.visibilityRange || '—'}</span>
      </p>
    </div>

  </div>

  {/* Row 3 — Description (Full Width) */}
  <div>
    <h4 className="text-white font-medium mb-2">Description</h4>
    <div
      className="text-[var(--light-grey-color)] bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded p-3"
      dangerouslySetInnerHTML={{ __html: submittedData.description || '' }}
    />
  </div>


    {/* Row 4 — Media (Full Width) */}
  <div>
    <h4 className="text-white font-medium mb-2">Media</h4>
    <p className="text-[var(--light-grey-color)]">File Type Allowed:
      <span className="text-white">{submittedData.fileTypeAllowed || '—'}</span>
    </p>

    {imagePreviews.length > 0 && (
      <div className="mt-2 grid grid-cols-3 gap-2">
        {imagePreviews.map((src, index) => (
          <img key={index} src={src} className="w-full h-20 object-cover rounded" />
        ))}
      </div>
    )}
    {previewImagePreview && (
    <div className="mt-5">
      <p className="text-[var(--light-grey-color)] mb-1">Preview Image:</p>

      {previewImageName && (
        <p className="text-xs text-[var(--light-grey-color)] mb-1">
          File: {previewImageName}
        </p>
      )}

      <img
        src={previewImagePreview}
        className="w-48 h-48 object-cover rounded-lg border border-[var(--light-blur-grey-color)]"
      />
    </div>
  )}
  </div>

</div>
          )}
          <div className="mt-6 flex justify-end">
            <Button 
              type="button" 
              onClick={() => navigate('/properties')}
              className="px-6 py-1 bg-[var(--puprle-color)]  text-white rounded hover:bg-[var(--puprle-color)]/90 transition-colors"
            >
              Back to List
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFormTemplate;
