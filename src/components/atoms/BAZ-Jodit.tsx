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
          url: `${ImportedURL.API.templateImage}image`, 
          method: "POST",
          filesVariableName: () => "image", 
          withCredentials: false,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          extraData: managementName ? { managementName } : {},
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
