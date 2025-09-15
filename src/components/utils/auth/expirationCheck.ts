import { checkTokenValidity } from './tokenValidation';

let expiryTimer: number | null = null;


export const startExpirationCheck = () => {
  // Only start timer if not already running and user is logged in
  const token = localStorage.getItem('token');
  if (!token) return;
  if (expiryTimer) window.clearInterval(expiryTimer);
  expiryTimer = window.setInterval(() => {
    checkTokenValidity();
  }, 10000);
};

export const stopExpirationCheck = () => {
  if (expiryTimer) window.clearInterval(expiryTimer);
  expiryTimer = null;
};