
import axios from 'axios';
// Simple passthrough to axios without caching
export const cachedAxios = axios;
export const requestCache = null;