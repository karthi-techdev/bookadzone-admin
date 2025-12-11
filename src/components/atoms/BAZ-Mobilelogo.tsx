import type { FC } from "react";

interface LogoProps {
  className?: string;
}

const BAZMobilelogo: FC<LogoProps> = ({ className = "" }) => (
  <img
    src="/assets/image/logo/bookadzone-favicon.svg"
    alt="bookadzone logo"
    className={`logo-img ${className}`}
  />
);

export default BAZMobilelogo;