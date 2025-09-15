import type { ReactNode, FC } from "react";
import logoImg from '../../assets/image/logo/bookadzone-logo.png';

// Define props interface for the Logo component
interface LogoProps {
  className?: string;
}

const BAZLogo: FC<LogoProps> = ({ className = "" }) => (
  <img
    src={logoImg}
    alt="bookadzone logo"
    className={`logo-img ${className}`}
  />
);

export default BAZLogo;