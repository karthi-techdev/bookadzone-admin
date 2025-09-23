import { render, screen } from '@testing-library/react';
import SidebarNavItem from '../SidebarNavItem';
import { MemoryRouter } from 'react-router-dom';

describe('SidebarNavItem', () => {
  const item = {
    text: 'Dashboard',
    path: '/',
    icon: <span>Icon</span>,
  };
  // Suppress React 19 Tippy.js ref warning
  jest.mock('@tippyjs/react', () => ({ __esModule: true, default: ({ children }: { children: React.ReactNode }) => children }));

  const originalError = console.error;
  beforeAll(() => {
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('Accessing element.ref was removed in React 19')
      ) {
        return;
      }
      originalError(...args);
    };
  });
  afterAll(() => {
    console.error = originalError;
  });
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
  it('renders collapsed Dashboard nav item', () => {
    render(
      <MemoryRouter>
        <SidebarNavItem
          item={item}
          idx={0}
          collapsed={true}
          isActive={false}
          hasChildren={false}
          isExpanded={false}
          toggleMenu={() => {}}
        />
      </MemoryRouter>
    );
  // Collapsed: check for link with icon accessible name
  expect(screen.getByRole('link', { name: 'Icon' })).toHaveAttribute('href', '/');
  });

  it('renders nav item with children (expanded)', () => {
    const itemWithChildren = {
      text: 'Settings',
      path: '/settings',
      icon: <span>Icon</span>,
      children: [
        { text: 'Profile', path: '/settings/profile' },
        { text: 'Account', path: '/settings/account' },
      ],
    };
    render(
      <MemoryRouter initialEntries={["/settings/profile"]}>
        <SidebarNavItem
          item={itemWithChildren}
          idx={1}
          collapsed={false}
          isActive={false}
          hasChildren={true}
          isExpanded={true}
          toggleMenu={() => {}}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  it('renders nav item with children (collapsed, expanded)', () => {
    const itemWithChildren = {
      text: 'Settings',
      path: '/settings',
      icon: <span>Icon</span>,
      children: [
        { text: 'Profile', path: '/settings/profile', icon: <span>SubIcon</span> },
      ],
    };
    render(
      <MemoryRouter initialEntries={["/settings/profile"]}>
        <SidebarNavItem
          item={itemWithChildren}
          idx={1}
          collapsed={true}
          isActive={false}
          hasChildren={true}
          isExpanded={true}
          toggleMenu={() => {}}
        />
      </MemoryRouter>
    );
  // Collapsed: check for submenu link with icon accessible name
  expect(screen.getByRole('link', { name: 'SubIcon' })).toHaveAttribute('href', '/settings/profile');
  });
  it('renders chevron for expandable item', () => {
    const itemWithChildren = {
      text: 'Settings',
      path: '/settings',
      icon: <span>Icon</span>,
      children: [
        { text: 'Profile', path: '/settings/profile' },
      ],
    };
    render(
      <MemoryRouter>
        <SidebarNavItem
          item={itemWithChildren}
          idx={1}
          collapsed={false}
          isActive={false}
          hasChildren={true}
          isExpanded={false}
          toggleMenu={() => {}}
        />
      </MemoryRouter>
    );
    // Check for SVG chevron icon
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('calls toggleMenu on click for expandable item', () => {
    const itemWithChildren = {
      text: 'Settings',
      path: '/settings',
      icon: <span>Icon</span>,
      children: [
        { text: 'Profile', path: '/settings/profile' },
      ],
    };
    const toggleMenu = jest.fn();
    render(
      <MemoryRouter>
        <SidebarNavItem
          item={itemWithChildren}
          idx={2}
          collapsed={false}
          isActive={false}
          hasChildren={true}
          isExpanded={false}
          toggleMenu={toggleMenu}
        />
      </MemoryRouter>
    );
    screen.getByText('Settings').parentElement?.click();
    expect(toggleMenu).toHaveBeenCalledWith(2);
  });
});
