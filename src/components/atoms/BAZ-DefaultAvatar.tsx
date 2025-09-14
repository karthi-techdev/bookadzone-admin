import type { ReactNode, FC } from "react";
interface AvatarImageProps {
  src: string;
  alt: string;
  className?: string;
}

const BAZDefultAvatar: FC<AvatarImageProps> = ({ src, alt, className = "" }) => (
  <img
    src={src}
    alt={alt}
    className={`h-[30px] w-[30px] rounded-full object-cover ${className}`}
  />
);

export default BAZDefultAvatar;