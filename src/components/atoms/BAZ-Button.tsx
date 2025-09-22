// removed duplicate import

// Define props interface for the Button component

import type { ButtonHTMLAttributes, ReactNode, FC } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}


const BAZButton: FC<ButtonProps> = ({ type = "button", className = "", children, ...rest }) => (
  <button
    type={type}
    className={`button cursor-pointer ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export default BAZButton;