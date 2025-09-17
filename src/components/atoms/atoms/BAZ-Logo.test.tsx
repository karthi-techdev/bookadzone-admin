import { render, screen } from '@testing-library/react';
import BAZLogo from '../BAZ-Logo';

jest.mock('../../assets/image/logo/bookadzone-logo.png', () => 'logo.png');

test('renders logo image', () => {
  render(<BAZLogo />);
  expect(screen.getByRole('img')).toBeInTheDocument();
});
