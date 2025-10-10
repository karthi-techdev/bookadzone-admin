import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BAZModal from '../BAZ-Modal';

describe('BAZModal', () => {
  test('does not render when isOpen is false', () => {
    render(
      <BAZModal isOpen={false} onClose={jest.fn()}>
        Content
      </BAZModal>
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  test('renders when isOpen is true', () => {
    render(
      <BAZModal isOpen={true} onClose={jest.fn()}>
        Hello Modal
      </BAZModal>
    );
    expect(screen.getByText('Hello Modal')).toBeInTheDocument();
  });

  test('renders title if provided', () => {
    render(
      <BAZModal isOpen={true} onClose={jest.fn()} title="My Modal">
        Content
      </BAZModal>
    );
    expect(screen.getByText('My Modal')).toBeInTheDocument();
  });

  test('calls onClose when close button clicked', () => {
    const handleClose = jest.fn();
    render(
      <BAZModal isOpen={true} onClose={handleClose} title="Closable">
        Content
      </BAZModal>
    );
    fireEvent.click(screen.getByLabelText('Close'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when backdrop clicked', () => {
    const handleClose = jest.fn();
    render(
      <BAZModal isOpen={true} onClose={handleClose}>
        Content
      </BAZModal>
    );
    fireEvent.click(screen.getByTestId('backdrop')); // ✅ works now
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when Escape key is pressed', () => {
    const handleClose = jest.fn();
    render(
      <BAZModal isOpen={true} onClose={handleClose}>
        Content
      </BAZModal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('applies correct size class', () => {
    const { rerender } = render(
      <BAZModal isOpen={true} onClose={jest.fn()} size="sm">
        Small modal
      </BAZModal>
    );
    expect(screen.getByText('Small modal').parentElement?.className).toMatch(/max-w-md/);

    rerender(
      <BAZModal isOpen={true} onClose={jest.fn()} size="full">
        Full modal
      </BAZModal>
    );
    expect(screen.getByText('Full modal').parentElement?.className).toMatch(/max-w-\[95vw\]/);
  });
});
