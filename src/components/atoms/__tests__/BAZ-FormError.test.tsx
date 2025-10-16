import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import FormError from '../BAZ-FormError';

describe('FormError', () => {
  it('renders error message when error prop is provided', () => {
    render(<FormError error="Test error message" />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByTestId('fi-alert-circle')).toBeInTheDocument();
  });

  it('does not render anything when error prop is undefined', () => {
    const { container } = render(<FormError />);
    expect(container).toBeEmptyDOMElement();
  });

  it('does not render anything when error prop is empty string', () => {
    const { container } = render(<FormError error="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders with correct styling', () => {
    render(<FormError error="Test error message" />);
    const errorContainer = screen.getByText('Test error message', { exact: false }).closest('p');
    expect(errorContainer).toHaveClass('text-xs', 'text-red-400', 'flex', 'items-center', 'mt-1');
  });

  it('renders alert icon with correct margin', () => {
    render(<FormError error="Test error message" />);
    const icon = screen.getByTestId('fi-alert-circle');
    expect(icon).toHaveClass('mr-1');
  });
});