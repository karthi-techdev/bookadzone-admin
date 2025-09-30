import React, { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import ImportedURL from "../common/urls";

interface AppProps {
  placeholder?: string;
  value?: string; 
  onChange?: (val: string) => void; 
  managementName?: string;
}

const BAZJodiEdit: React.FC<AppProps> = ({ placeholder, value, onChange, managementName }) => {
  const editor = useRef<any>(null);
  const [content, setContent] = useState<string>(value || "");
  
  // Sync external value → internal state
  useEffect(() => {
    if (value !== undefined && value !== content) {
      setContent(value);
    }
  }, [value]);

  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Jodit config
  const config = useMemo(
    () =>
      ({
        readonly: false,
        placeholder: placeholder || "Start typing...",
        uploader: {
          insertImageAsBase64URI: false, 
          url: `${ImportedURL.API.templateImage}`, 
          method: "POST",
          filesVariableName: () => "image", 
          withCredentials: false,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          extraData: managementName ? { managementName } : {},
          format: 'json',
          prepareData: function (formData: FormData) {
            return formData;
          },
          isSuccess: function (resp: any) {
            return !resp.error;
          },
          getMessage: function (resp: any) {
            return resp.msg || resp.message || '';
          },
          // Process function to handle the response
          process: (resp: any) => {
            try {
              const response = typeof resp === 'string' ? JSON.parse(resp) : resp;
              
              if (response.success && response.files && response.files.length > 0) {
                const processedFiles = response.files.map((file: any) => {
                  // Fix: Don't add LIVEURL if the url already starts with http
                  let fullUrl = file.url;
                  if (!fullUrl.startsWith('http')) {
                    // Remove leading slash to avoid double slashes
                    const cleanPath = fullUrl.replace(/^\//, '');
                    fullUrl = `${ImportedURL.LIVEURL.replace(/\/$/, '')}/${cleanPath}`;
                  }
                  return fullUrl;
                });
                
                return {
                  files: processedFiles,
                  error: 0,
                  msg: ''
                };
              }
              
              return {
                files: [],
                error: 1,
                msg: 'Invalid response format'
              };
            } catch (error) {
              console.error('Error processing upload response:', error);
              return {
                files: [],
                error: 1,
                msg: 'Error processing response'
              };
            }
          },
          defaultHandlerSuccess: function (this: any, resp: any) {
            const j = this;
            if (resp.files && resp.files.length) {
              resp.files.forEach((fileUrl: string) => {
                j.s.insertImage(fileUrl, null, 250);
              });
            }
          },
          error: (e: Error) => {
            console.error('Upload error:', e);
          }
        },
        // Enable image editing features
        image: {
          openOnDblClick: true,
          editSrc: true,
          useImageEditor: true,
          editTitle: true,
          editAlt: true,
          editLink: true,
          editSize: true,
          editBorderRadius: true,
          editMargins: true,
          editClass: true,
          editStyle: true,
          editId: true,
          editAlign: true,
          showPreview: true,
          selectImageAfterClose: true,
        },
        // Enable resizing
        allowResizeX: true,
        allowResizeY: true,
        resizer: {
          showSize: true,
          hideSizeTimeout: 1000,
          useAspectRatio: true,
        },
        events: {
          afterInit: (editor: any) => {
            // Override the delete button in image properties
            editor.e.on('afterOpenImageProperties', (dialog: any) => {
              const deleteBtn = dialog.container.querySelector('button[data-ref="delete"], .jodit-ui-button_delete, button:has(.jodit-icon_bin)');
              if (deleteBtn) {
                // Remove existing listeners
                const newDeleteBtn = deleteBtn.cloneNode(true);
                deleteBtn.parentNode?.replaceChild(newDeleteBtn, deleteBtn);
                newDeleteBtn.addEventListener('click', async (e: Event) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const img = editor.s.current() as HTMLImageElement;
                  if (img && img.tagName === 'IMG') {
                    const imgSrc = img.getAttribute('src');
                    if (imgSrc && confirm('Are you sure you want to delete this image? This will remove it from the server.')) {
                      try {
                        // Extract the relative path from the full URL
                        let relativePath = '';
                        try {
                          const urlObj = new URL(imgSrc, window.location.origin);
                          relativePath = urlObj.pathname;
                        } catch {
                          // fallback for relative URLs
                          relativePath = imgSrc;
                        }
                        // Call backend to delete the image
                        const response = await fetch(`${ImportedURL.API.templateImage}`, {
                          method: 'DELETE',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({ 
                            imageUrl: relativePath 
                          })
                        });
                        if (response.ok) {
                          img.remove();
                          editor.synchronizeValues();
                          dialog.close();
                          alert('Image deleted successfully');
                        } else {
                          alert('Failed to delete image from server');
                        }
                      } catch (error) {
                        console.error('Error deleting image:', error);
                        alert('Error deleting image from server');
                      }
                    }
                  }
                });
              }
            });
            // Also handle click on images to select them
            editor.e.on('click', (e: MouseEvent) => {
              const target = e.target as HTMLElement;
              if (target.tagName === 'IMG') {
                editor.s.select(target);
              }
            });
          }
        },
      } as any),
    [placeholder, token, managementName]
  );
  
  // Handle change → update state + trigger parent onChange
  const handleChange = (newContent: string) => {
    setContent(newContent);
    if (onChange) onChange(newContent);
  };

  return (
    <div className="space-y-4">
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1}
        onBlur={(newContent: string) => handleChange(newContent)}
        onChange={(newContent: string) => handleChange(newContent)}
      />
    </div>
  );
};

export default BAZJodiEdit;