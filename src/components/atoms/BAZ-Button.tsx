import type { ReactNode, FC } from "react";

// Define props interface for the Button component
interface ButtonProps {
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
}

const BAZButton: FC<ButtonProps> = ({ type = "button", className = "", onClick, children, disabled = false }) => (
  <button
    type={type}
    className={`button cursor-pointer ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default BAZButton;