import axios from 'axios';
import Swal from 'sweetalert2';
import ImportedURL from '../../common/urls';
import type { User } from '../../types/common';
import { parseExpiresIn } from './utils';

const { API } = ImportedURL;

export const checkTokenValidity = (): boolean => {
  try {
    const token = localStorage.getItem('token');
    const storedExpiry = localStorage.getItem('tokenExpiry');

    if (token && storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      const now = Date.now();

      if (expiryTime < now) {
        // Token expired; clear storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiry');
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = '/Login';
        return false;
      }

      // Token within 30 seconds of expiry: show renewal prompt
      if (expiryTime - now <= 30000) {
        Swal.fire({
          title: 'Session Expiring Soon',
          text: 'Your session will expire in 30 seconds. Do you want to renew?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Renew',
          cancelButtonText: 'Logout',
          confirmButtonColor: 'var(--puprle-color)',
          cancelButtonColor: 'var(--light-blur-grey-color)',
        }).then((result) => {
          if (result.isConfirmed) {
            axios
              .post(
                `${API.refresh}`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((res) => {
                const { token: newToken, data: user, expiresIn } = res.data as { token: string; data: User; expiresIn: string };
                const newExpiryTime = Date.now() + parseExpiresIn(expiresIn);
                localStorage.setItem('token', newToken);
                localStorage.setItem('tokenExpiry', newExpiryTime.toString());
                axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                Swal.fire({
                  title: 'Session Renewed!',
                  text: 'Your session has been extended.',
                  icon: 'success',
                  confirmButtonColor: 'var(--puprle-color)',
                });
              })
              .catch(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiry');
                delete axios.defaults.headers.common['Authorization'];
                Swal.fire({
                  title: 'Session Expired',
                  text: 'Please login again.',
                  icon: 'error',
                  confirmButtonColor: 'var(--puprle-color)',
                });
                window.location.href = '/Login';
              });
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('tokenExpiry');
            delete axios.defaults.headers.common['Authorization'];
            window.location.href = '/Login';
          }
        });
      }

      return true;
    }

    // No token or expiry found, consider invalid
    return false;
  } catch (e) {
    // On error, clear storage and redirect to login for safety
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/Login';
    return false;
  }
};
