// Mock browser APIs for file input tests
if (typeof URL.createObjectURL === 'undefined') {
  URL.createObjectURL = () => 'mock-url';
}
if (typeof URL.revokeObjectURL === 'undefined') {
  URL.revokeObjectURL = () => {};
}

import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder in Jest environment
// @ts-ignore
import { TextEncoder, TextDecoder } from 'util';
// @ts-ignore
if (typeof global.TextEncoder === 'undefined') {
  // @ts-ignore
  global.TextEncoder = TextEncoder;
}
// @ts-ignore
if (typeof global.TextDecoder === 'undefined') {
  // @ts-ignore
  global.TextDecoder = TextDecoder;
}
