import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  error?: string;
  label?: string;
}

const BAZTextArea: React.FC<TextAreaProps> = ({ className = '', error, label, ...rest }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className={`space-y-2 ${className}`}
  >
    {label && (
      <label className="block text-xs text-[var(--light-grey-color)]">
        {label}
      </label>
    )}
    <textarea
      {...rest}
      className={`w-full px-3 py-2 bg-[var(--dark-color)] border ${
        error ? 'border-red-400' : 'border-[var(--light-blur-grey-color)]'
      } rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)] ${className}`}
    />
    {error && (
      <p className="text-xs text-red-400 flex items-center mt-1">
        <FiAlertCircle className="mr-1" /> {error}
      </p>
    )}
  </motion.div>
);

export default BAZTextArea;