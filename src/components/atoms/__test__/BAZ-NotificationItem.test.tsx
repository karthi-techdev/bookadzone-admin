
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BAZNotificationItem from '../BAZ-NotificationItem';

test('renders notification with name and message', () => {
  render(
    <MemoryRouter>
      <BAZNotificationItem
        to="/link"
        avatar="avatar.jpg"
        name="Alice"
        org="Org"
        message="New message"
        time="1min ago"
        unread={true}
      />
    </MemoryRouter>
  );
  expect(screen.getByText('Alice')).toBeInTheDocument();
  expect(screen.getByText('New message')).toBeInTheDocument();
});
