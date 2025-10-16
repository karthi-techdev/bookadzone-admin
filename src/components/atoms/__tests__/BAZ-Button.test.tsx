import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BAZButton from '../BAZ-Button';

describe('BAZButton', () => {
  test('renders children', () => {
    render(<BAZButton>Click Me</BAZButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<BAZButton onClick={handleClick}>Click</BAZButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('forwards the type prop', () => {
    render(<BAZButton type="submit">Submit</BAZButton>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  test('applies the className', () => {
    render(<BAZButton className="my-class">A</BAZButton>);
    expect(screen.getByRole('button')).toHaveClass('my-class');
  });

  test('can be disabled', () => {
    const handleClick = jest.fn();
    render(
      <BAZButton disabled onClick={handleClick}>
        Disabled
      </BAZButton>
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
