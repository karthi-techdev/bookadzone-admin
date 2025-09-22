import { render, screen } from '@testing-library/react';
import BAZDefultAvatar from '../BAZ-DefaultAvatar';

test('renders avatar image with alt', () => {
  render(<BAZDefultAvatar src="image.jpg" alt="User avatar" />);
  const avatarImg = screen.getByAltText('User avatar');
  expect(avatarImg).toBeInTheDocument();
});
