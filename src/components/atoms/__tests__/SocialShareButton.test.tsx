import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SocialShareButton from '../SocialShareButton';

jest.mock('../BAZ-Button', () => {
  return function MockButton({ children, onClick, className }: any) {
    return (
      <button onClick={onClick} className={className} data-testid="baz-button">
        {children}
      </button>
    );
  };
});

describe('SocialShareButton', () => {
  const defaultProps = {
    platform: 'facebook' as const,
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Facebook button correctly', () => {
    render(<SocialShareButton {...defaultProps} />);
    
    expect(screen.getByText('Share on Facebook')).toBeInTheDocument();
    expect(screen.getByTestId('baz-button')).toHaveClass('bg-[#1877F2]', 'hover:bg-[#166FE5]');
  });

  it('renders Twitter button correctly', () => {
    render(<SocialShareButton {...defaultProps} platform="twitter" />);
    
    expect(screen.getByText('Share on Twitter')).toBeInTheDocument();
    expect(screen.getByTestId('baz-button')).toHaveClass('bg-[#1DA1F2]', 'hover:bg-[#1a8cd8]');
  });

  it('renders LinkedIn button correctly', () => {
    render(<SocialShareButton {...defaultProps} platform="linkedin" />);
    
    expect(screen.getByText('Share on LinkedIn')).toBeInTheDocument();
    expect(screen.getByTestId('baz-button')).toHaveClass('bg-[#0A66C2]', 'hover:bg-[#004182]');
  });

  it('renders WhatsApp button correctly', () => {
    render(<SocialShareButton {...defaultProps} platform="whatsapp" />);
    
    expect(screen.getByText('Share on WhatsApp')).toBeInTheDocument();
    expect(screen.getByTestId('baz-button')).toHaveClass('bg-[#25D366]', 'hover:bg-[#128C7E]');
  });

  it('calls onClick handler when clicked', () => {
    render(<SocialShareButton {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('baz-button'));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<SocialShareButton {...defaultProps} className="custom-class" />);
    
    expect(screen.getByTestId('baz-button')).toHaveClass('custom-class');
  });

  it('renders with default className properties', () => {
    render(<SocialShareButton {...defaultProps} />);
    
    const button = screen.getByTestId('baz-button');
    expect(button).toHaveClass(
      'inline-flex',
      'items-center',
      'px-4',
      'py-2',
      'text-white',
      'rounded',
      'transition-colors'
    );
  });

  it('renders social icon for each platform', () => {
    const platforms: Array<'facebook' | 'twitter' | 'linkedin' | 'whatsapp'> = [
      'facebook',
      'twitter',
      'linkedin',
      'whatsapp'
    ];

    platforms.forEach(platform => {
      const { container, unmount } = render(
        <SocialShareButton {...defaultProps} platform={platform} />
      );
      expect(container.querySelector('svg')).toBeInTheDocument();
      unmount();
    });
  });

  describe('Platform specific styles', () => {
    const platformStyles = {
      facebook: {
        bg: 'bg-[#1877F2]',
        hover: 'hover:bg-[#166FE5]',
        text: 'Share on Facebook'
      },
      twitter: {
        bg: 'bg-[#1DA1F2]',
        hover: 'hover:bg-[#1a8cd8]',
        text: 'Share on Twitter'
      },
      linkedin: {
        bg: 'bg-[#0A66C2]',
        hover: 'hover:bg-[#004182]',
        text: 'Share on LinkedIn'
      },
      whatsapp: {
        bg: 'bg-[#25D366]',
        hover: 'hover:bg-[#128C7E]',
        text: 'Share on WhatsApp'
      }
    };

    Object.entries(platformStyles).forEach(([platform, style]) => {
      it(`applies correct styles for ${platform}`, () => {
        render(
          <SocialShareButton
            {...defaultProps}
            platform={platform as 'facebook' | 'twitter' | 'linkedin' | 'whatsapp'}
          />
        );

        const button = screen.getByTestId('baz-button');
        expect(button).toHaveClass(style.bg, style.hover);
        expect(screen.getByText(style.text)).toBeInTheDocument();
      });
    });
  });
});