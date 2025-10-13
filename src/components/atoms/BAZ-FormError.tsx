import React, { memo } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

interface FormErrorProps {
  error?: string;
}

const FormError = memo(({ error }: FormErrorProps) => {
  if (!error) return null;
  
  return (
    <p className="text-xs text-red-400 flex items-center mt-1">
      <FiAlertCircle className="mr-1" data-testid="fi-alert-circle" />
      {error}
    </p>
  );
});

export default FormError;