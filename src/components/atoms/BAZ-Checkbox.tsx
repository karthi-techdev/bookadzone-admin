import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface CheckboxProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  error?: string;
}

const BAZCheckbox: React.FC<CheckboxProps> = ({ id, name, checked, onChange, disabled, label, className, error }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className={`flex flex-col space-y-2 ${className}`}
  >
    <div className="flex items-center space-x-2">
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-[var(--puprle-color)] border-[var(--light-blur-grey-color)] rounded focus:ring-[var(--puprle-color)] disabled:opacity-50"
        disabled={disabled}
      />
      {label && (
        <label htmlFor={id} className="text-xs text-[var(--light-grey-color)]">
          {label}
        </label>
      )}
    </div>
    {error && (
      <p className="text-xs text-red-400 flex items-center mt-1">
        <FiAlertCircle className="mr-1" /> {error}
      </p>
    )}
  </motion.div>
);

export default BAZCheckbox;