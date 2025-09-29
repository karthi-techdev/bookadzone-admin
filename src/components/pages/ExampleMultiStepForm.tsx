import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import type { FieldConfig } from '../types/common';

const steps = [
  {
    id: 1,
    label: 'Step 1',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text', required: true },
      { name: 'lastName', label: 'Last Name', type: 'text', required: true },
    ] as FieldConfig[],
  },
  {
    id: 2,
    label: 'Step 2',
    fields: [
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'text', required: false },
    ] as FieldConfig[],
  },
  {
    id: 3,
    label: 'Step 3',
    fields: [
      { name: 'address', label: 'Address', type: 'text', required: false },
      { name: 'city', label: 'City', type: 'text', required: false },
    ] as FieldConfig[],
  },
];


const ExampleMultiStepForm: React.FC = () => {
  const methods = useForm({ defaultValues: {}, mode: 'onSubmit' });
  const { handleSubmit, reset } = methods;
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  const stepHeaders = [
    {
      title: 'Personal Information',
      desc: 'Enter your basic personal details.',
    },
    {
      title: 'Contact Details',
      desc: 'How can we reach you?',
    },
    {
      title: 'Address',
      desc: 'Where are you located?',
    },
  ];

  const completionPercentage = Math.floor((activeStep / steps.length) * 100);

  // Simple validation for demo
  const validateStep = (step: number): boolean => {
    const stepFields = steps[step - 1].fields;
    const newErrors: any = {};
    stepFields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const nextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(steps.length, prev + 1));
    }
  };

  const prevStep = () => {
    setActiveStep(prev => Math.max(1, prev - 1));
  };

  const onSubmit = (data: any) => {
    if (validateStep(activeStep)) {
      alert('Form submitted!\n' + JSON.stringify(formData, null, 2));
      reset();
      setFormData({});
      setActiveStep(1);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Example Multi-Step Form</h1>
        <p className="text-xs text-[var(--light-grey-color)]">A demo of a multi-step form layout</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-[var(--light-grey-color)]">Step {activeStep} of {steps.length}</span>
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
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-white mb-2">{stepHeaders[activeStep-1].title}</h3>
            <p className="text-xs text-[var(--light-grey-color)] mb-6">{stepHeaders[activeStep-1].desc}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {steps[activeStep-1].fields.map((field) => (
                <div key={field.name} className="w-full">
                  <label className="block text-xs text-[var(--light-grey-color)] mb-1">{field.label}{field.required && ' *'}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                  {errors[field.name] && <p className="text-xs text-red-400 mt-1">{errors[field.name]}</p>}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between pt-8 mt-8 border-t border-[var(--light-blur-grey-color)]">
          <button
            type="button"
            onClick={prevStep}
            disabled={activeStep === 1}
            className={`flex items-center px-4 py-2 text-xs rounded transition-colors ${
              activeStep === 1 
                ? 'bg-[var(--dark-color)] text-[var(--light-grey-color)] cursor-not-allowed' 
                : 'bg-[var(--dark-color)] text-[var(--light-grey-color)] hover:bg-[var(--light-blur-grey-color)]/20 border border-[var(--light-blur-grey-color)]'
            }`}
          >
            <FiChevronLeft className="mr-1" /> Previous
          </button>

          {activeStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center px-4 py-2 text-xs bg-[var(--puprle-color)] text-white rounded hover:bg-[var(--puprle-color)]/90 transition-colors"
            >
              Next <FiChevronRight className="ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center px-4 py-2 text-xs bg-[var(--puprle-color)] text-white rounded hover:bg-[var(--puprle-color)]/90 transition-colors"
            >
              <FiCheck className="mr-1" /> Submit
            </button>
          )}
        </div>
      </motion.form>
    </div>
  );
};

export default ExampleMultiStepForm;
