import React from "react";
import logoImg from '../../assets/image/logo/bookadzone-logo.png';

const Logo = ({ className = "" }) => (
  <img
    src={logoImg}
    alt="bookadzone logo"
    className={`logo-img ${className}`}
  />
);

export default Logo;