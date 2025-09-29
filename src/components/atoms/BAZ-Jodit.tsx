import React, { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";

interface AppProps {
  placeholder?: string;
  value?: string; 
  onChange?: (val: string) => void; 
}

const BAZJodiEdit: React.FC<AppProps> = ({ placeholder, value, onChange }) => {
  const editor = useRef<any>(null);
  const [content, setContent] = useState<string>(value || "");

  // Sync external value → internal state
  useEffect(() => {
    if (value !== undefined && value !== content) {
      setContent(value);
    }
  }, [value]);

  // Jodit config
  const config = useMemo(
  () =>
    ({
      readonly: false,
      placeholder: placeholder || "Start typing...",
      uploader: {
        insertImageAsBase64URI: false, // Base64 remove
        url: "http://localhost:5001/api/Uploads/image", // your upload API
        method: "POST",
        filesVariableName: () => "image", // multer field name
        withCredentials: false,
      },
    } as any),
  [placeholder]
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
