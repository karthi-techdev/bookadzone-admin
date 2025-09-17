import { render, screen } from '@testing-library/react';
import SidebarNavItem from '../SidebarNavItem';
import { MemoryRouter } from 'react-router-dom';

describe('SidebarNavItem', () => {
  const item = {
    text: 'Dashboard',
    path: '/',
    icon: <span>Icon</span>,
  };
  it('renders Dashboard nav item', () => {
    render(
      <MemoryRouter>
        <SidebarNavItem
          item={item}
          idx={0}
          collapsed={false}
          isActive={true}
          hasChildren={false}
          isExpanded={false}
          toggleMenu={() => {}}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
