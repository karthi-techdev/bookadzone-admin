// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
      // Mock CSS imports (including .css, .scss, .sass, .less, etc.)
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      // Mock static assets (images, fonts, etc.) if needed
      '\\.(jpg|jpeg|png|gif|webp|svg|eot|otf|ttf|woff|woff2)$': '<rootDir>/src/__mocks__/fileMock.js',
      // Mock JSON imports for testing
      '../../data/countries-states-cities-database/json/countries.json': '<rootDir>/src/data/countries-states-cities-database/json/countries.json',
      '../../data/countries-states-cities-database/json/states.json': '<rootDir>/src/data/countries-states-cities-database/json/states.json',
      '../../data/countries-states-cities-database/json/cities.json': '<rootDir>/src/data/countries-states-cities-database/json/cities.json',
    },
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  transformIgnorePatterns: [
    'node_modules/(?!swiper)'
  ],
};
