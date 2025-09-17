beforeAll(() => {
  // Suppress jsdom navigation error
  jest.spyOn(console, 'error').mockImplementation((msg) => {
    if (
      typeof msg === 'string' &&
      msg.includes('Not implemented: navigation (except hash changes)')
    ) {
      return;
    }
    // Otherwise, log other errors
    console.warn(msg);
  });
});
// Suppress jsdom navigation error message
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Not implemented: navigation (except hash changes)')
  ) {
    return;
  }
  originalError(...args);
};

import { act } from '@testing-library/react';
import axios from 'axios';
import { useAuthStore } from '../authStore';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Auth Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
  });

  it('logs in correctly and stores token', async () => {
    const loginResponse = {
      data: {
        token: 'fake_token',
        data: { username: 'testuser', email: 'test@example.com' },
        expiresIn: '1h',
      },
    };

    mockedAxios.post.mockResolvedValueOnce(loginResponse);

    await act(async () => {
      await useAuthStore.getState().login({ email: 'test@example.com', password: 'passwd' });
    });

    const state = useAuthStore.getState();
    expect(state.token).toBe('fake_token');
    expect(state.user?.username).toBe('testuser');
    expect(localStorage.getItem('token')).toBe('fake_token');
  });

  it('logs out and clears token', () => {
    useAuthStore.setState({ user: { username: 'test' }, token: 'fake_token' });

    act(() => {
      useAuthStore.getState().logout();
    });

    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('checkTokenValidity removes expired token and redirects', () => {
    // Cannot test window.location.href change directly, but can check localStorage cleanup
    localStorage.setItem('token', 'expired_token');
    localStorage.setItem('tokenExpiry', (Date.now() - 1000).toString()); // expired

    // Call checkTokenValidity from authStore or tokenValidation utility
    const valid = useAuthStore.getState().checkTokenValidity();

    expect(valid).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('tokenExpiry')).toBeNull();
  });
});
