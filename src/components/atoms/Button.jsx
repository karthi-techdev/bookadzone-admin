import React from "react";


const Button = ({ type = "button", className = "", onClick, children, disabled = false }) => (
  <button
    type={type}
    className={`button cursor-pointer ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;