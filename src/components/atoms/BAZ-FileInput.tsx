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
  const [previews, setPreviews] = useState<{ url: string; name: string; isImage: boolean }[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<{ url: string; name: string } | null>(null);
  const objectUrlsRef = useRef<string[]>([]);
  // Ensure objectUrlsRef.current is always an array
  if (!Array.isArray(objectUrlsRef.current)) {
    objectUrlsRef.current = [];
  }
  const isUserChange = useRef(false);

  useEffect(() => {
    if (isUserChange.current) {
      isUserChange.current = false;
      return;
    }

    if (Array.isArray(objectUrlsRef.current)) {
      objectUrlsRef.current.forEach(URL.revokeObjectURL);
    }
    objectUrlsRef.current = [];

    // Combine value and existingFiles for preview
    const filesToPreview: any[] = [];
    if (existingFiles) {
      if (Array.isArray(existingFiles)) {
        filesToPreview.push(...existingFiles);
      } else {
        filesToPreview.push(existingFiles);
      }
    }
    if (value) {
      if (Array.isArray(value)) {
        filesToPreview.push(...value);
      } else {
        filesToPreview.push(value);
      }
    }
    if (filesToPreview.length === 0) {
      setPreviews([]);
      return;
    }
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
  }, [value, existingFiles]);

  useEffect(() => {
    return () => {
      if (Array.isArray(objectUrlsRef.current)) {
        objectUrlsRef.current.forEach(URL.revokeObjectURL);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    if (Array.isArray(objectUrlsRef.current)) {
      objectUrlsRef.current.forEach(URL.revokeObjectURL);
    }
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
        />
      </label>
      
      {previews.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-[var(--light-grey-color)] mb-3">Uploaded Files:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {previews.map((preview, index) => (
              <div key={preview.url} className="relative group bg-[var(--dark-color)] rounded-lg overflow-hidden border border-[var(--light-blur-grey-color)]">
                {preview.isImage ? (
                  <div className="w-full h-48 bg-white flex items-center justify-center p-2">
                    <img
                      src={preview.url}
                      alt={preview.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="p-4 flex flex-col items-center justify-center h-48 bg-gray-100">
                    <div className="text-2xl mb-2">📄</div>
                    <p className="text-xs text-center text-gray-600 truncate w-full" title={preview.name}>
                      {preview.name}
                    </p>
                    <a
                      href={preview.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 text-xs text-[var(--puprle-color)] hover:text-[var(--puprle-color)]/90 flex items-center"
                      download
                    >
                      <FiDownload className="mr-1" /> Download
                    </a>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <div className="flex space-x-2">
                    {preview.isImage && (
                      <button
                        type="button"
                        onClick={() => setSelectedPreview(preview)}
                        className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 text-gray-800 shadow-md"
                        title="View larger"
                      >
                        <FiEye className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removePreview(index)}
                      className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 text-red-600 shadow-md"
                      title="Remove file"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Preview Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPreview(null)}>
          <div className="bg-white rounded-lg max-w-4xl max-h-screen overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">{selectedPreview.name}</h3>
              <button 
                onClick={() => setSelectedPreview(null)} 
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex justify-center">
              <img 
                src={selectedPreview.url} 
                alt={selectedPreview.name} 
                className="max-w-full max-h-[70vh] object-contain" 
              />
            </div>
            <div className="p-4 border-t flex justify-end">
              <a 
                href={selectedPreview.url} 
                download 
                className="px-4 py-2 bg-[var(--puprle-color)] text-white rounded hover:bg-[var(--puprle-color)]/90 flex items-center"
              >
                <FiDownload className="mr-2" /> Download
              </a>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-400 flex items-center mt-2 p-2 bg-red-50 rounded">
          <FiAlertCircle className="mr-2" /> {error}
        </p>
      )}
    </motion.div>
  );
};

export default BAZFileInput;