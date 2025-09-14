import React, { useEffect, useState, useRef } from 'react';
import { FiUpload, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import urls from '../common/urls';

interface FileInputProps {
  name: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const BAZFileInput: React.FC<FileInputProps> = ({
  name,
  value,
  onChange,
  accept,
  multiple = false,
  disabled,
  error,
  className = '',
}) => {
  const [previews, setPreviews] = useState<{ url: string; name: string; isImage: boolean }[]>([]);
  const objectUrlsRef = useRef<string[]>([]);
  const isUserChange = useRef(false);

  useEffect(() => {
    if (isUserChange.current) {
      isUserChange.current = false;
      return;
    }

    objectUrlsRef.current.forEach(URL.revokeObjectURL);
    objectUrlsRef.current = [];

    if (!value) {
      setPreviews([]);
      return;
    }

    const filesToPreview = Array.isArray(value) ? value : [value];
    const resolvedPreviews = filesToPreview
      .map((file) => {
        if (typeof file === 'string' && file.trim() !== '') {
          const url = file.startsWith('http') ? file : `${urls.FILEURL}${file.replace(/^\/+/, '')}`;
          const isImage = /\.(jpe?g|png|gif|webp|svg)$/i.test(file);
          const fileName = file.split('/').pop() || 'file';
          return { url, name: fileName, isImage };
        }
        return null;
      })
      .filter((p): p is { url: string; name: string; isImage: boolean } => !!p);

    setPreviews(resolvedPreviews);
  }, [value]);

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach(URL.revokeObjectURL);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    objectUrlsRef.current.forEach(URL.revokeObjectURL);
    objectUrlsRef.current = [];

    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      const newPreviews = fileList.map((file) => {
        const objectUrl = URL.createObjectURL(file);
        objectUrlsRef.current.push(objectUrl);
        return {
          url: objectUrl,
          name: file.name,
          isImage: file.type.startsWith('image/'),
        };
      });
      setPreviews(newPreviews);
      isUserChange.current = true;
    } else {
      setPreviews([]);
    }
    onChange(e);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`space-y-2 ${className}`}
    >
      <label
        className={`flex flex-col items-center justify-center w-full h-32 bg-[var(--dark-color)] border-2 border-dashed ${
          error ? 'border-red-400' : 'border-[var(--light-blur-grey-color)]'
        } rounded cursor-pointer hover:border-[var(--puprle-color)] transition-colors`}
      >
        <div className="text-center p-4">
          <FiUpload className="h-6 w-6 text-[var(--light-grey-color)] mx-auto mb-2" />
          <span className="text-xs text-[var(--light-grey-color)]">Click to upload or drag and drop</span>
          <p className="text-xs text-[var(--light-grey-color)] mt-1">JPG, PNG or GIF (Max 5MB each)</p>
        </div>
        <input
          id={name}
          name={name}
          type="file"
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
          className="hidden"
          disabled={disabled}
        />
      </label>
      {previews.length > 0 && (
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {previews.map((preview, index) => (
            <div key={preview.url} className="relative group">
              {preview.isImage ? (
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="w-full h-24 object-cover rounded border border-[var(--light-blur-grey-color)]"
                />
              ) : (
                <a
                  href={preview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--puprle-color)] hover:text-[var(--puprle-color)]/90 underline"
                >
                  View {preview.name}
                </a>
              )}
              {preview.isImage && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 rounded">
                  <button
                    type="button"
                    onClick={() => {
                      const newPreviews = [...previews];
                      newPreviews.splice(index, 1);
                      setPreviews(newPreviews);
                      URL.revokeObjectURL(preview.url);
                      objectUrlsRef.current = objectUrlsRef.current.filter((url) => url !== preview.url);
                      if (onChange) {
                        // We can't reconstruct File objects from object URLs, so just call onChange with undefined files
                        const event = {
                          ...new Event('change'),
                          target: {
                            name,
                            files: undefined,
                          },
                        } as unknown as React.ChangeEvent<HTMLInputElement>;
                        onChange(event);
                      }
                    }}
                    className="p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 text-white"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {error && (
        <p className="text-xs text-red-400 flex items-center mt-1">
          <FiAlertCircle className="mr-1" /> {error}
        </p>
      )}
    </motion.div>
  );
};

export default BAZFileInput;