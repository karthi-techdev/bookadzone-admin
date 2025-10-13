import React, { useEffect, useState, useRef } from 'react';
import { FiUpload, FiTrash2, FiAlertCircle, FiEye, FiDownload } from 'react-icons/fi';
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
  existingFiles?: string | string[];
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
  existingFiles,
}) => {
  const [previews, setPreviews] = useState<{ url: string; name: string; isImage: boolean; isExisting: boolean; originalPath?: string }[]>([]);
  const [removedFiles, setRemovedFiles] = useState<string[]>([]);
  const objectUrlsRef = useRef<string[]>([]);

  // Ensure objectUrlsRef.current is always an array
  if (!Array.isArray(objectUrlsRef.current)) {
    objectUrlsRef.current = [];
  }

  // Update previews when value or existingFiles change
  useEffect(() => {
    // Clean up old object URLs
    if (Array.isArray(objectUrlsRef.current)) {
      objectUrlsRef.current.forEach(URL.revokeObjectURL);
    }
    objectUrlsRef.current = [];

    const newPreviews: { url: string; name: string; isImage: boolean; isExisting: boolean; originalPath?: string }[] = [];

    // Add existing files (not removed)
    if (existingFiles) {
      const existingArray = Array.isArray(existingFiles) ? existingFiles : [existingFiles];
      existingArray.forEach(file => {
        if (typeof file === 'string' && file.trim() !== '' && !removedFiles.includes(file)) {
          const url = file.startsWith('http') ? file : `${urls.FILEURL}${file.replace(/^\/+/, '')}`;
          const isImage = /\.(jpe?g|png|gif|webp|svg)$/i.test(file);
          const fileName = file.split('/').pop() || 'file';
          newPreviews.push({ 
            url, 
            name: fileName, 
            isImage, 
            isExisting: true, 
            originalPath: file 
          });
        } else if (
          file &&
          typeof file === 'object' &&
          file !== null &&
          typeof (file as { url?: string }).url === 'string' &&
          !removedFiles.includes((file as { url: string }).url)
        ) {
          // Handle image object with id and url
          const imgObj = file as { id?: number; url: string };
          const url = imgObj.url.startsWith('http') ? imgObj.url : `${urls.FILEURL}${imgObj.url.replace(/^\/+/, '')}`;
          const isImage = /\.(jpe?g|png|gif|webp|svg)$/i.test(imgObj.url);
          const fileName = imgObj.url.split('/').pop() || 'file';
          newPreviews.push({
            url,
            name: fileName,
            isImage,
            isExisting: true,
            originalPath: imgObj.url
          });
        }
      });
    }

    // Add new files
    if (value) {
      const valueArray = Array.isArray(value) ? value : [value];
      valueArray.forEach(file => {
        if (file instanceof File) {
          const objectUrl = URL.createObjectURL(file);
          objectUrlsRef.current.push(objectUrl);
          newPreviews.push({
            url: objectUrl,
            name: file.name,
            isImage: file.type.startsWith('image/'),
            isExisting: false
          });
        }
      });
    }

    setPreviews(newPreviews);
  }, [value, existingFiles, removedFiles]);

  useEffect(() => {
    return () => {
      if (Array.isArray(objectUrlsRef.current)) {
        objectUrlsRef.current.forEach(URL.revokeObjectURL);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files);
      // File type validation
      const allowedTypes = (accept || '').split(',').map(type => type.trim());
      const invalidFile = fileList.find(file => {
        // Accept image/* or .jpg, .png, etc.
        if (allowedTypes.some(type => type === file.type || (type.endsWith('/*') && file.type.startsWith(type.slice(0, -1))))) {
          return false;
        }
        if (allowedTypes.some(type => type.startsWith('.') && file.name.endsWith(type))) {
          return false;
        }
        return true;
      });
      if (invalidFile) {
        // Clear input value
        e.target.value = '';
        // Show error by sending a special invalid value
        const customEvent = {
          ...e,
          target: {
            ...e.target,
            value: '__invalid_file_type__', // Special value to trigger validation error
            removedFiles: removedFiles
          }
        } as any;
        onChange(customEvent);
        return;
      }
      // Create a custom event that includes removed files info
      const customEvent = {
        ...e,
        target: {
          ...e.target,
          value: multiple ? fileList : fileList[0],
          removedFiles: removedFiles // Add removed files info
        }
      } as any;
      onChange(customEvent);
    } else {
      const customEvent = {
        ...e,
        target: {
          ...e.target,
          value: multiple ? [] : null,
          removedFiles: removedFiles
        }
      } as any;
      onChange(customEvent);
    }
  };

  const handleRemoveFile = (index: number) => {
    const fileToRemove = previews[index];
    
    if (fileToRemove.isExisting && fileToRemove.originalPath) {
      // Add to removed files list
      const newRemovedFiles = [...removedFiles, fileToRemove.originalPath];
      setRemovedFiles(newRemovedFiles);
      
      // Notify parent component about the removal
      if (onChange) {
        const customEvent = {
          target: {
            name,
            value: value, // Keep current new files
            removedFiles: newRemovedFiles
          }
        } as any;
        onChange(customEvent);
      }
    } else {
      // Handle new file removal
      if (fileToRemove.url && objectUrlsRef.current.includes(fileToRemove.url)) {
        URL.revokeObjectURL(fileToRemove.url);
        objectUrlsRef.current = objectUrlsRef.current.filter(url => url !== fileToRemove.url);
      }
      
      // Update the value by removing the file
      if (value) {
        let newValue;
        if (Array.isArray(value)) {
          const newFileIndex = previews.slice(0, index).filter(p => !p.isExisting).length;
          newValue = value.filter((_, i) => i !== newFileIndex);
        } else {
          newValue = null;
        }
        
        if (onChange) {
          const customEvent = {
            target: {
              name,
              value: newValue,
              removedFiles: removedFiles
            }
          } as any;
          onChange(customEvent);
        }
      }
    }
  };

  const removePreview = (index: number) => {
    const previewToRemove = previews[index];
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
    
    // Revoke the object URL to prevent memory leaks
    if (previewToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(previewToRemove.url);
      objectUrlsRef.current = objectUrlsRef.current.filter((url) => url !== previewToRemove.url);
    }
    
    if (onChange) {
      // Create a synthetic event to notify parent of the change
      const event = {
        ...new Event('change'),
        target: {
          name,
          files: undefined,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`space-y-3 ${className}`}
    >
      <label
        className={`flex flex-col items-center justify-center w-full h-40 bg-[var(--dark-color)] border-2 border-dashed ${
          error ? 'border-red-400' : 'border-[var(--light-blur-grey-color)]'
        } rounded-lg cursor-pointer hover:border-[var(--puprle-color)] transition-colors p-6`}
      >
        <div className="text-center">
          <FiUpload className="h-8 w-8 text-[var(--light-grey-color)] mx-auto mb-3" />
          <span className="text-sm font-medium text-[var(--light-grey-color)]">Click to upload or drag and drop</span>
          <p className="text-xs text-[var(--light-grey-color)] mt-2">JPG, PNG, GIF, SVG (Max 5MB each)</p>
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
          data-testid={`${name}-input`}
        />
      </label>
      
      {previews.length > 0 && (
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {previews.map((preview, index) => (
            <div key={`${preview.url}-${index}`} className="relative group">
              
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
                 {preview.name}
                </a>
              )}
              {/* Only show remove button for multiple uploads or if there are multiple files */}
              {(multiple || previews.length > 1) && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 rounded">
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    aria-label="Remove file"
                    className="p-1 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 text-white-600 bg-danger-600 hover:bg-danger-700 transition group-hover:opacity-100"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
              {preview.isExisting && (
                <div className="mb-1 bg-[var(--puprle-color)] text-white text-xs px-1 rounded inline-block">
                  Existing
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <p role="alert" className="text-sm text-red-400 flex items-center mt-2 p-2 bg-red-50 rounded">
          <FiAlertCircle className="mr-2" /> {error}
        </p>
      )}
    </motion.div>
  );
};

export default BAZFileInput;