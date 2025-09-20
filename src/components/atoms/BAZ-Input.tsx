import React, { memo } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: string;
  isAuth?: boolean;
}

const BAZInput: React.FC<InputProps> = memo(({ className = '', error, isAuth = false, ...props }) => {
  // Define different border radius styles based on isAuth
  const borderRadiusClass = isAuth 
    ? 'rounded-tl-[5px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[5px]' 
    : 'rounded';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`space-y-2 ${className}`}
    >
      <input
        {...props}
        className={`w-full px-3 py-2 bg-[var(--dark-color)] border ${
          error ? 'border-red-400' : 'border-[var(--light-blur-grey-color)]'
        } ${borderRadiusClass} text-[.75rem] text-[var(--white-color)] placeholder:text-[var(--light-grey-color)] focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)] ${className}`}
      />
      {error && (
        <p className="text-xs text-red-400 flex items-center mt-1">
          <FiAlertCircle className="mr-1" /> {error}
        </p>
      )}
    </motion.div>
  );
});

export default BAZInput;