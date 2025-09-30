import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BAZJodiEdit from '../BAZ-Jodit';

describe('BAZJodiEdit', () => {
  test('renders with placeholder', () => {
    render(<BAZJodiEdit placeholder="Type here..." />);
    // Instead of getByPlaceholderText, check by text
    expect(screen.getByText('Type here...')).toBeInTheDocument();
  });

  test('renders with initial value', () => {
    render(<BAZJodiEdit value="<p>Hello</p>" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  test('calls onChange when content changes', () => {
    const handleChange = jest.fn();
    render(<BAZJodiEdit value="<p>Initial</p>" onChange={handleChange} />);

    const editor = screen.getByText('Initial');
    fireEvent.input(editor, { target: { innerHTML: '<p>Changed</p>' } });

    expect(handleChange).toHaveBeenCalled();
  });

  test('updates when value prop changes', () => {
    const { rerender } = render(<BAZJodiEdit value="<p>First</p>" />);
    expect(screen.getByText('First')).toBeInTheDocument();

    rerender(<BAZJodiEdit value="<p>Second</p>" />);
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  test('applies default placeholder when not provided', () => {
    render(<BAZJodiEdit />);
    // Jodit renders default placeholder as text inside editor
    expect(screen.getByText('Start typing...')).toBeInTheDocument();
  });
});

