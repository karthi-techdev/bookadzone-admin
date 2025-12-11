import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiX, 
  FiMapPin, 
  FiUpload, 
  FiDollarSign,
  FiAlertCircle,
  FiTrash2,
  FiEye,
  FiChevronRight,
  FiChevronLeft,
  FiCheck
} from 'react-icons/fi';

// Define interfaces for type safety
interface Specification {
  title: string;
  feature: string;
}

interface FormData {
  title: string;
  slug: string;
  category: string;
  locationType: string;
  locationName: string;
  landmark: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  propertyImages: File[];
  height: string;
  width: string;
  orientation: 'portrait' | 'landscape';
  pricingType: 'perDay' | 'perWeek' | 'perMonth';
  days: string;
  minPrice: string;
  maxPrice: string;
  description: string;
  specifications: Specification[];
  monthlyImpressions: string;
  dailyVisibility: string;
  trafficData: string;
  dwellTime: string;
  nearbyInstitutions: string;
  zoneType: string;
  interests: string[];
  visibility: string;
  fileTypes: string[];
  status: 'active' | 'inactive';
}

interface Step {
  id: number;
  title: string;
}

const AddProperties: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    category: '',
    locationType: '',
    locationName: '',
    landmark: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    propertyImages: [],
    height: '',
    width: '',
    orientation: 'portrait',
    pricingType: 'perDay',
    days: '',
    minPrice: '',
    maxPrice: '',
    description: '',
    specifications: [{ title: '', feature: '' }],
    monthlyImpressions: '',
    dailyVisibility: '',
    trafficData: '',
    dwellTime: '',
    nearbyInstitutions: '',
    zoneType: '',
    interests: [],
    visibility: '',
    fileTypes: [],
    status: 'active'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [propertyId, setPropertyId] = useState<string>(generatePropertyId());
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Generate random property ID
  function generatePropertyId(): string {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `BAZ${randomNum}`;
  }

  // Steps configuration
  const steps: Step[] = [
    { id: 1, title: 'Basic Details' },
    { id: 2, title: 'Location Details' },
    { id: 3, title: 'Property Images' },
    { id: 4, title: 'Property Details' },
    { id: 5, title: 'Pricing Information' },
    { id: 6, title: 'Additional Information' },
    { id: 7, title: 'Review & Submit' }
  ];

  // Calculate completion percentage
  const completionPercentage: number = Math.floor((step / steps.length) * 100);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const files = (e.target as HTMLInputElement).files;
    
    if (type === 'file' && files) {
      const newImages: File[] = Array.from(files);
      const newPreviews: string[] = newImages.map(file => URL.createObjectURL(file));
      
      setFormData({ 
        ...formData, 
        propertyImages: [...formData.propertyImages, ...newImages] 
      });
      
      setImagePreviews([...imagePreviews, ...newPreviews]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (errors[name as keyof FormData]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Remove an image from the selection
  const removeImage = (index: number) => {
    const newImages: File[] = [...formData.propertyImages];
    const newPreviews: string[] = [...imagePreviews];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFormData({ ...formData, propertyImages: newImages });
    setImagePreviews(newPreviews);
  };

  // Handle multi-select changes
  const handleMultiSelect = (e: ChangeEvent<HTMLSelectElement>, field: keyof FormData) => {
    const options = e.target.options;
    const values: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    setFormData({ ...formData, [field]: values });
  };

  // Add specification field
  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { title: '', feature: '' }]
    });
  };

  // Remove specification field
  const removeSpecification = (index: number) => {
    const newSpecs: Specification[] = [...formData.specifications];
    newSpecs.splice(index, 1);
    setFormData({ ...formData, specifications: newSpecs });
  };

  // Handle specification field changes
  const handleSpecChange = (index: number, field: keyof Specification, value: string) => {
    const newSpecs: Specification[] = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData({ ...formData, specifications: newSpecs });
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    switch(step) {
      case 1:
        if (!formData.title) newErrors.title = 'Property title is required';
        if (!formData.slug) newErrors.slug = 'Slug is required';
        if (!formData.category) newErrors.category = 'Category is required';
        break;
        
      case 2:
        if (!formData.locationType) newErrors.locationType = 'Location type is required';
        if (!formData.locationName) newErrors.locationName = 'Location name is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.pincode) newErrors.pincode = 'Pincode is required';
        break;
        
      case 3:
        if (formData.propertyImages.length === 0) newErrors.propertyImages = 'At least one property image is required';
        break;
        
      case 4:
        if (!formData.height) newErrors.height = 'Height is required';
        if (!formData.width) newErrors.width = 'Width is required';
        break;
        
      case 5:
        if (!formData.minPrice) newErrors.minPrice = 'Minimum price is required';
        if (!formData.maxPrice) newErrors.maxPrice = 'Maximum price is required';
        break;
        
      case 6:
        if (!formData.description) newErrors.description = 'Description is required';
        if (!formData.monthlyImpressions) newErrors.monthlyImpressions = 'Monthly impressions is required';
        if (!formData.dailyVisibility) newErrors.dailyVisibility = 'Daily visibility is required';
        if (!formData.trafficData) newErrors.trafficData = 'Traffic data is required';
        if (!formData.dwellTime) newErrors.dwellTime = 'Dwell time is required';
        if (!formData.nearbyInstitutions) newErrors.nearbyInstitutions = 'Nearby institutions is required';
        if (!formData.zoneType) newErrors.zoneType = 'Zone type is required';
        if (formData.interests.length === 0) newErrors.interests = 'At least one interest is required';
        if (!formData.visibility) newErrors.visibility = 'Visibility is required';
        if (formData.fileTypes.length === 0) newErrors.fileTypes = 'At least one file type is required';
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigate to next step
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    setStep(step - 1);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep(step)) {
      console.log('Form submitted:', { propertyId, ...formData });
    }
  };

  // Options for selects
  const categories: string[] = ['Billboard', 'Hoarding', 'Unipole', 'Digital Billboard', 'Banner'];
  const locationTypes: string[] = ['Urban', 'Highway', 'Commercial', 'Others'];
  const orientations: string[] = ['Portrait', 'Landscape'];
  const pricingTypes: string[] = ['Per Day', 'Per Week', 'Per Month'];
  const zoneTypes: string[] = ['Residential', 'Commercial', 'Mixed'];
  const interestOptions: string[] = ['Shopping', 'Tech', 'Fashion', 'Education', 'Finance', 'Entertainment', 'Food', 'Travel'];
  const fileTypeOptions: string[] = ['JPG', 'PNG', 'GIF', 'PDF', 'PSD', 'AI'];
  const statusOptions: string[] = ['active', 'inactive'];

  // Render current step
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-2">Basic Information</h3>
            <p className="text-xs text-[var(--light-grey-color)] mb-6">Provide the basic details about your property</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Property Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                  placeholder="Enter property title"
                />
                {errors.title && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.title}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                  placeholder="Enter URL slug"
                />
                {errors.slug && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.slug}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Property ID</label>
                <div className="px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-[var(--light-grey-color)]">
                  {propertyId}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.category}</p>}
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-2">Location Details</h3>
            <p className="text-xs text-[var(--light-grey-color)] mb-6">Provide the location details of your property</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Location Type *</label>
                <select
                  name="locationType"
                  value={formData.locationType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                >
                  <option value="">Select Type</option>
                  {locationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.locationType && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.locationType}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Location Name *</label>
                <input
                  type="text"
                  name="locationName"
                  value={formData.locationName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                  placeholder="Enter location name"
                />
                {errors.locationName && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.locationName}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                  placeholder="Enter nearby landmark"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                  placeholder="Enter full address"
                />
                {errors.address && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.address}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                  placeholder="Enter city"
                />
                {errors.city && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.city}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                  placeholder="Enter state"
                />
                {errors.state && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.state}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                  placeholder="Enter pincode"
                />
                {errors.pincode && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.pincode}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Pin on Map</label>
                <div className="h-32 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded flex items-center justify-center">
                  <div className="text-center">
                    <FiMapPin className="h-5 w-5 text-[var(--light-grey-color)] mx-auto mb-1" />
                    <p className="text-xs text-[var(--light-grey-color)]">Map integration will be implemented here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-2">Property Images</h3>
            <p className="text-xs text-[var(--light-grey-color)] mb-6">Upload images of your property</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Upload Property Images *</label>
                
                <label className="flex flex-col items-center justify-center w-full h-32 bg-[var(--dark-color)] border-2 border-dashed border-[var(--light-blur-grey-color)] rounded cursor-pointer hover:border-[var(--puprle-color)] transition-colors">
                  <div className="text-center p-4">
                    <FiUpload className="h-6 w-6 text-[var(--light-grey-color)] mx-auto mb-2" />
                    <span className="text-xs text-[var(--light-grey-color)]">Click to upload or drag and drop</span>
                    <p className="text-xs text-[var(--light-grey-color)] mt-1">JPG, PNG or GIF (Max 5MB each)</p>
                  </div>
                  <input 
                    type="file" 
                    name="propertyImages" 
                    onChange={handleChange} 
                    className="hidden" 
                    accept="image/*"
                    multiple
                  />
                </label>
                
                {errors.propertyImages && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.propertyImages}</p>}
              </div>
              
              {imagePreviews.length > 0 && (
                <div className="space-y-3">
                  <label className="block text-xs text-[var(--light-grey-color)]">Selected Images ({imagePreviews.length})</label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-24 object-cover rounded border border-[var(--light-blur-grey-color)]"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 rounded">
                          <div className="flex space-x-2">
                            <button 
                              type="button" 
                              className="p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 text-white"
                              onClick={() => window.open(preview, '_blank')}
                            >
                              <FiEye className="h-4 w-4" />
                            </button>
                            <button 
                              type="button" 
                              className="p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 text-white"
                              onClick={() => removeImage(index)}
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="absolute top-1 right-1">
                          <span className="bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-[var(--light-grey-color)]">
                    You can upload up to 10 images. First image will be used as the main thumbnail.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-2">Property Details</h3>
            <p className="text-xs text-[var(--light-grey-color)] mb-6">Provide the physical details of your property</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Height (ft) *</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                  placeholder="Enter height"
                />
                {errors.height && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.height}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Width (ft) *</label>
                <input
                  type="number"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                  placeholder="Enter width"
                />
                {errors.width && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.width}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Orientation</label>
                <select
                  name="orientation"
                  value={formData.orientation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                >
                  {orientations.map(orientation => (
                    <option key={orientation} value={orientation.toLowerCase()}>{orientation}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-2">Pricing Information</h3>
            <p className="text-xs text-[var(--light-grey-color)] mb-6">Set the pricing details for your property</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Pricing Type</label>
                <select
                  name="pricingType"
                  value={formData.pricingType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                >
                  {pricingTypes.map(type => (
                    <option key={type} value={type.replace(' ', '').toLowerCase()}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Select No. Days</label>
                <input
                  type="number"
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                  placeholder="Enter number of days"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Minimum Price ($) *</label>
                <input
                  type="number"
                  name="minPrice"
                  value={formData.minPrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                  placeholder="Enter minimum price"
                />
                {errors.minPrice && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.minPrice}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Maximum Price ($) *</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={formData.maxPrice}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                  placeholder="Enter maximum price"
                />
                {errors.maxPrice && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.maxPrice}</p>}
              </div>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-2">Additional Information</h3>
            <p className="text-xs text-[var(--light-grey-color)] mb-6">Provide additional details about your property</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                  placeholder="Enter property description"
                ></textarea>
                {errors.description && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.description}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Estimated Monthly Impressions *</label>
                <input
                  type="text"
                  name="monthlyImpressions"
                  value={formData.monthlyImpressions}
                  onChange={handleChange}
                  placeholder="e.g., 1.5M+ Views per Month"
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                />
                {errors.monthlyImpressions && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.monthlyImpressions}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Daily Visibility Duration *</label>
                <input
                  type="text"
                  name="dailyVisibility"
                  value={formData.dailyVisibility}
                  onChange={handleChange}
                  placeholder="e.g., 24/7 exposure or 10 hours/day"
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                />
                {errors.dailyVisibility && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.dailyVisibility}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Vehicle Traffic Data (ADT) *</label>
                <input
                  type="text"
                  name="trafficData"
                  value={formData.trafficData}
                  onChange={handleChange}
                  placeholder="Average Daily Traffic"
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                />
                {errors.trafficData && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.trafficData}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Audience Dwell Time *</label>
                <input
                  type="text"
                  name="dwellTime"
                  value={formData.dwellTime}
                  onChange={handleChange}
                  placeholder="e.g., Avg. 30 seconds visual engagement"
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                />
                {errors.dwellTime && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.dwellTime}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Nearby Institutions *</label>
                <input
                  type="text"
                  name="nearbyInstitutions"
                  value={formData.nearbyInstitutions}
                  onChange={handleChange}
                  placeholder="Schools, Colleges, Hospitals, Shopping malls"
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                />
                {errors.nearbyInstitutions && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.nearbyInstitutions}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Zone Type *</label>
                <select
                  name="zoneType"
                  value={formData.zoneType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                >
                  <option value="">Select Zone Type</option>
                  {zoneTypes.map(zone => (
                    <option key={zone} value={zone.toLowerCase()}>{zone}</option>
                  ))}
                </select>
                {errors.zoneType && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.zoneType}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Interests *</label>
                <select
                  multiple
                  value={formData.interests}
                  onChange={(e) => handleMultiSelect(e, 'interests')}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)] h-32"
                >
                  {interestOptions.map(interest => (
                    <option key={interest} value={interest}>{interest}</option>
                  ))}
                </select>
                <p className="text-xs text-[var(--light-grey-color)] mt-1">Hold Ctrl/Cmd to select multiple options</p>
                {errors.interests && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.interests}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Banner Visibility *</label>
                <input
                  type="text"
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  placeholder="in km or m"
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                />
                {errors.visibility && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.visibility}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">File Types *</label>
                <select
                  multiple
                  value={formData.fileTypes}
                  onChange={(e) => handleMultiSelect(e, 'fileTypes')}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)] h-24"
                >
                  {fileTypeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <p className="text-xs text-[var(--light-grey-color)] mt-1">Hold Ctrl/Cmd to select multiple options</p>
                {errors.fileTypes && <p className="text-xs text-red-400 flex items-center mt-1"><FiAlertCircle className="mr-1" /> {errors.fileTypes}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-[var(--light-grey-color)]">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="pt-6">
              <h4 className="text-sm font-semibold text-white mb-4">Specifications</h4>
              
              <div className="space-y-3">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-5 space-y-2">
                      <label className="block text-xs text-[var(--light-grey-color)]">Title</label>
                      <input
                        type="text"
                        placeholder="Specification title"
                        value={spec.title}
                        onChange={(e) => handleSpecChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                      />
                    </div>
                    <div className="md:col-span-6 space-y-2">
                      <label className="block text-xs text-[var(--light-grey-color)]">Feature</label>
                      <input
                        type="text"
                        placeholder="Specification feature"
                        value={spec.feature}
                        onChange={(e) => handleSpecChange(index, 'feature', e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                      />
                    </div>
                    <div className="md:col-span-1 flex items-end pb-2">
                      {formData.specifications.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeSpecification(index)}
                          className="text-red-400 p-1"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                <button 
                  type="button" 
                  onClick={addSpecification}
                  className="flex items-center text-xs text-[var(--puprle-color)] mt-2"
                >
                  <FiPlus className="mr-1" /> Add Specification
                </button>
              </div>
            </div>
          </div>
        );
        
      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-2">Review & Submit</h3>
            <p className="text-xs text-[var(--light-grey-color)] mb-6">Review all the information before submitting</p>
            
            <div className="bg-[var(--dark-color)] rounded-lg p-4 border border-[var(--light-blur-grey-color)]">
              <h4 className="text-sm font-semibold text-white mb-4 pb-2 border-b border-[var(--light-blur-grey-color)]">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="text-[var(--light-grey-color)]">Property Title</p>
                  <p className="text-white">{formData.title || <span className="text-red-400">Not provided</span>}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[var(--light-grey-color)]">Slug</p>
                  <p className="text-white">{formData.slug || <span className="text-red-400">Not provided</span>}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[var(--light-grey-color)]">Property ID</p>
                  <p className="text-white">{propertyId}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[var(--light-grey-color)]">Category</p>
                  <p className="text-white">{formData.category || <span className="text-red-400">Not provided</span>}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--dark-color)] rounded-lg p-4 border border-[var(--light-blur-grey-color)]">
              <h4 className="text-sm font-semibold text-white mb-4 pb-2 border-b border-[var(--light-blur-grey-color)]">Location Details</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="text-[var(--light-grey-color)]">Location Type</p>
                  <p className="text-white">{formData.locationType || <span className="text-red-400">Not provided</span>}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[var(--light-grey-color)]">Location Name</p>
                  <p className="text-white">{formData.locationName || <span className="text-red-400">Not provided</span>}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[var(--light-grey-color)]">Address</p>
                  <p className="text-white">{formData.address || <span className="text-red-400">Not provided</span>}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[var(--light-grey-color)]">City</p>
                  <p className="text-white">{formData.city || <span className="text-red-400">Not provided</span>}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[var(--light-grey-color)]">State</p>
                  <p className="text-white">{formData.state || <span className="text-red-400">Not provided</span>}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[var(--light-grey-color)]">Pincode</p>
                  <p className="text-white">{formData.pincode || <span className="text-red-400">Not provided</span>}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--dark-color)] rounded-lg p-4 border border-[var(--light-blur-grey-color)]">
              <h4 className="text-sm font-semibold text-white mb-4 pb-2 border-b border-[var(--light-blur-grey-color)]">Property Details</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="text-[var(--light-grey-color)]">Height</p>
                  <p className="text-white">{formData.height ? `${formData.height} ft` : <span className="text-red-400">Not provided</span>}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[var(--light-grey-color)]">Width</p>
                  <p className="text-white">{formData.width ? `${formData.width} ft` : <span className="text-red-400">Not provided</span>}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[var(--light-grey-color)]">Orientation</p>
                  <p className="text-white">{formData.orientation ? formData.orientation.charAt(0).toUpperCase() + formData.orientation.slice(1) : <span className="text-red-400">Not provided</span>}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[var(--light-grey-color)]">Images Uploaded</p>
                  <p className="text-white">{formData.propertyImages.length} images</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--dark-color)] rounded-lg p-4 border border-[var(--light-blur-grey-color)]">
              <h4 className="text-sm font-semibold text-white mb-4 pb-2 border-b border-[var(--light-blur-grey-color)]">Pricing Information</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <p className="text-[var(--light-grey-color)]">Pricing Type</p>
                  <p className="text-white">{formData.pricingType ? formData.pricingType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) : <span className="text-red-400">Not provided</span>}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[var(--light-grey-color)]">Minimum Price</p>
                  <p className="text-white">{formData.minPrice ? `$${formData.minPrice}` : <span className="text-red-400">Not provided</span>}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[var(--light-grey-color)]">Maximum Price</p>
                  <p className="text-white">{formData.maxPrice ? `$${formData.maxPrice}` : <span className="text-red-400">Not provided</span>}</p>
                </div>
                {formData.days && (
                  <div className="space-y-2">
                    <p className="text-[var(--light-grey-color)]">Number of Days</p>
                    <p className="text-white">{formData.days}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-4 py-2 text-xs bg-[var(--dark-color)] text-[var(--light-grey-color)] rounded border border-[var(--light-blur-grey-color)] hover:bg-[var(--light-blur-grey-color)]/20 transition-colors"
              >
                <FiChevronLeft className="mr-1" /> Back
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 text-xs bg-[var(--puprle-color)] text-white rounded hover:bg-[var(--puprle-color)]/90 transition-colors"
              >
                <FiCheck className="mr-1" /> Submit Property
              </button>
            </div>
          </div>
        );
        
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="min-h-screen p-[20px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Add Property</h1>
        <p className="text-xs text-[var(--light-grey-color)]">Add a new advertising property to your portfolio</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-[var(--light-grey-color)]">Step {step} of {steps.length}</span>
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
                step > stepItem.id ? 'bg-[var(--puprle-color)] text-white' :
                step === stepItem.id ? 'bg-white text-[var(--dark-color)]' :
                'bg-[var(--dark-color)] text-[var(--light-grey-color)] border border-[var(--light-blur-grey-color)]'
              }`}>
                {step > stepItem.id ? <FiCheck className="h-4 w-4" /> : stepItem.id}
              </div>
              <span className={`text-xs mt-1 ${step >= stepItem.id ? 'text-white' : 'text-[var(--light-grey-color)]'}`}>
                {stepItem.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit}
        className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm p-6"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {step < 7 && (
          <div className="flex justify-between pt-8 mt-8 border-t border-[var(--light-blur-grey-color)]">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className={`flex items-center px-4 py-2 text-xs rounded transition-colors ${
                step === 1 
                  ? 'bg-[var(--dark-color)] text-[var(--light-grey-color)] cursor-not-allowed' 
                  : 'bg-[var(--dark-color)] text-[var(--light-grey-color)] hover:bg-[var(--light-blur-grey-color)]/20 border border-[var(--light-blur-grey-color)]'
              }`}
            >
              <FiChevronLeft className="mr-1" /> Previous
            </button>
            
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center px-4 py-2 text-xs bg-[var(--puprle-color)] text-white rounded hover:bg-[var(--puprle-color)]/90 transition-colors"
            >
              Next <FiChevronRight className="ml-1" />
            </button>
          </div>
        )}
      </motion.form>
    </div>
  );
};

export default AddProperties;