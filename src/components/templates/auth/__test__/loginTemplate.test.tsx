jest.mock('swiper/react', () => ({
  Swiper: () => <div>Swiper</div>,
  SwiperSlide: ({ children }: any) => <div>{children}</div>,
}));
jest.mock('swiper/modules', () => ({}));
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../loginTemplate';
import { useAuthStore } from '../../../stores/AuthStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

jest.mock('../../../stores/AuthStore', () => ({
  useAuthStore: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));
jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn() } }));
jest.mock('../../../organisms/ManagementForm', () => (props: any) => (
  <form onSubmit={e => { e.preventDefault(); props.onSubmit && props.onSubmit({ username: 'admin@gmail.com', password: 'admin@123' }); }}>
    <button type="submit">Login</button>
  </form>
));

describe('LoginTemplate', () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();
  beforeEach(() => {
  (useAuthStore as unknown as jest.Mock).mockReturnValue({ login: mockLogin, user: null, token: null });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/login' });
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Or Login With')).toBeInTheDocument();
  });

  it('calls login and navigates on success', async () => {
    mockLogin.mockResolvedValueOnce({});
    render(<Login />);
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'admin@gmail.com', password: 'admin@123' });
      expect(toast.success).toHaveBeenCalledWith('Login successful!');
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('shows error toast on login failure', async () => {
    mockLogin.mockRejectedValueOnce({ response: { data: { message: 'Invalid credentials' } } });
    render(<Login />);
    fireEvent.click(screen.getByText('Login'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
    });
  });
});
