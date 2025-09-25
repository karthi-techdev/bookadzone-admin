import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Loader from '../Loader';

describe('Loader', () => {
  it('renders animated logo text', () => {
    const { container } = render(<Loader />);
    // The logo is split into spans, so check for all letters
    const logo = container.querySelector('.animated-logo');
    expect(logo).toBeInTheDocument();
    // Check that all letters of 'book' and 'adzone.' are present in order
    const book = Array.from(logo?.children[0].textContent || '').join('');
    const adzone = Array.from(logo?.children[1].textContent || '').join('');
    expect(book.toLowerCase()).toBe('book');
    expect(adzone.toLowerCase()).toBe('adzone.');
  });

  it('renders all slogan words', () => {
    render(<Loader />);
    expect(screen.getByText('Advertise')).toBeInTheDocument();
    expect(screen.getByText('Simplify')).toBeInTheDocument();
    expect(screen.getByText('Grow')).toBeInTheDocument();
  });
});
