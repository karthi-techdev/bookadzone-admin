import React from 'react';
import BAZButton from './BAZ-Button';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

interface SocialShareButtonProps {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp';
  onClick: () => void;
  className?: string;
}

const platformStyles = {
  facebook: {
    bg: 'bg-[#1877F2]',
    hover: 'hover:bg-[#166FE5]',
    text: 'Share on Facebook',
    icon: <FaFacebook className="mr-2" />
  },
  twitter: {
    bg: 'bg-[#1DA1F2]',
    hover: 'hover:bg-[#1a8cd8]',
    text: 'Share on Twitter',
    icon: <FaTwitter className="mr-2" />
  },
  linkedin: {
    bg: 'bg-[#0A66C2]',
    hover: 'hover:bg-[#004182]',
    text: 'Share on LinkedIn',
    icon: <FaLinkedin className="mr-2" />
  },
  whatsapp: {
    bg: 'bg-[#25D366]',
    hover: 'hover:bg-[#128C7E]',
    text: 'Share on WhatsApp',
    icon: <FaWhatsapp className="mr-2" />
  }
};

const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  platform,
  onClick,
  className = ''
}) => {
  const style = platformStyles[platform];
  
  return (
    <BAZButton
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 text-white rounded transition-colors ${style.bg} ${style.hover} ${className}`}
    >
      {style.icon}
      {style.text}
    </BAZButton>
  );
};

export default SocialShareButton;

