import { lazy } from 'react';

export const lazyWithPreload = (factory: () => Promise<{ default: React.ComponentType<any> }>) => {
  const Component = lazy(factory);
  let factoryPromise: Promise<{ default: React.ComponentType<any> }> | null = null;
  
  return Object.assign(Component, {
    preload() {
      if (!factoryPromise) {
        factoryPromise = factory();
      }
      return factoryPromise;
    }
  });
};

// Example usage:
// export const LazyComponent = lazyWithPreload(() => import('./Component'));