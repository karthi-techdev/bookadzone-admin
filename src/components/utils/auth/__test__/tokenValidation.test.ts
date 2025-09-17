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
import { checkTokenValidity } from '../tokenValidation';
import axios from 'axios';
import Swal from 'sweetalert2';

jest.mock('axios');
jest.mock('sweetalert2');

const mockSwal = Swal as jest.Mocked<typeof Swal>;
const mockAxios = axios as jest.Mocked<typeof axios>;



describe('checkTokenValidity', () => {

  let setItemSpy: jest.SpyInstance;
  let removeItemSpy: jest.SpyInstance;
  let getItemSpy: jest.SpyInstance;
  // jsdom does not allow mocking window.location or its properties. We'll only check for side effects.



  beforeEach(() => {
    jest.resetAllMocks();
  setItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem');
  removeItemSpy = jest.spyOn(window.localStorage.__proto__, 'removeItem');
  getItemSpy = jest.spyOn(window.localStorage.__proto__, 'getItem');
    delete axios.defaults.headers.common['Authorization'];
  });


  // No teardown needed for window.location



  it('returns false if no token or expiry', () => {
    getItemSpy.mockReturnValueOnce(null);
    expect(checkTokenValidity()).toBe(false);
  });

  it('logs out and redirects if token expired', () => {
    getItemSpy.mockImplementation((key) => {
      if (key === 'token') return 'tok';
      if (key === 'tokenExpiry') return (Date.now() - 1000).toString();
      return null;
    });
    expect(checkTokenValidity()).toBe(false);
  expect(removeItemSpy).toHaveBeenCalledWith('token');
  // jsdom limitation: cannot assert redirect
  });

  it('shows renew prompt if token expiring soon and handles confirm (renew)', async () => {
    getItemSpy.mockImplementation((key) => {
      if (key === 'token') return 'tok';
      if (key === 'tokenExpiry') return (Date.now() + 20000).toString();
      return null;
    });
    mockSwal.fire.mockResolvedValueOnce({ isConfirmed: true } as any);
    mockAxios.post.mockResolvedValueOnce({ data: { token: 'newtok', expiresIn: '1000' } });
    const result = checkTokenValidity();
    // Wait for all microtasks to complete (Swal.then, axios.then)
    await Promise.resolve();
    await Promise.resolve();
    expect(result).toBe(true);
    expect(setItemSpy).toHaveBeenCalledWith('token', 'newtok');
  });

  it('shows renew prompt if token expiring soon and handles cancel (logout)', async () => {
    getItemSpy.mockImplementation((key) => {
      if (key === 'token') return 'tok';
      if (key === 'tokenExpiry') return (Date.now() + 20000).toString();
      return null;
    });
    mockSwal.fire.mockResolvedValueOnce({ isConfirmed: false } as any);
    const result = checkTokenValidity();
    await Promise.resolve();
    expect(result).toBe(true);
    expect(removeItemSpy).toHaveBeenCalledWith('token');
    // jsdom limitation: cannot assert redirect
  });

  it('returns true if token is valid and not expiring soon', () => {
    getItemSpy.mockImplementation((key) => {
      if (key === 'token') return 'tok';
      if (key === 'tokenExpiry') return (Date.now() + 60000).toString();
      return null;
    });
    expect(checkTokenValidity()).toBe(true);
  });

  it('handles error in try/catch and logs out', () => {
    getItemSpy.mockImplementation((key) => {
      if (key === 'token') return 'tok';
      if (key === 'tokenExpiry') throw new Error('fail');
      return null;
    });
    const result = checkTokenValidity();
    expect(result).toBe(false);
    expect(removeItemSpy).toHaveBeenCalledWith('token');
    // jsdom limitation: cannot assert redirect
  });
});
