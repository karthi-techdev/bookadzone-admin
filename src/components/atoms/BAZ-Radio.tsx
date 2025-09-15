import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import type { SelectOption } from '../types/common';

interface RadioProps {
  name: string;
  selectedValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: SelectOption[];
  disabled?: boolean;
  label?: string;
  className?: string;
  error?: string;
}

const BAZRadio: React.FC<RadioProps> = ({
  name,
  selectedValue,
  onChange,
  options = [],
  disabled,
  label,
  className = '',
  error,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className={`flex flex-col space-y-2 ${className}`}
  >
    {label && (
      <label className="block text-xs text-[var(--light-grey-color)]">
        {label}
      </label>
    )}
    <div className="flex items-center gap-4">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2 text-xs text-[var(--light-grey-color)]"
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={selectedValue === opt.value}
            onChange={onChange}
            className="text-[var(--puprle-color)] focus:ring-[var(--puprle-color)] border-[var(--light-blur-grey-color)] disabled:opacity-50"
            disabled={disabled}
          />
          {opt.label}
        </label>
      ))}
    </div>
    {error && (
      <p className="text-xs text-red-400 flex items-center mt-1">
        <FiAlertCircle className="mr-1" /> {error}
      </p>
    )}
  </motion.div>
);

export default BAZRadio;