import { Suspense } from 'react';
import BAZLoader from '../atoms/BAZ-Loader';
import { lazyWithPreload } from '../utils/lazyLoading';
import type { ComponentType } from 'react';

// Lazy load page components with proper typing
export const Dashboard = lazyWithPreload(() => import('./Dashboard'));
export const CampaignList = lazyWithPreload(() => import('./Campaign-List'));
export const CampaignDetails = lazyWithPreload(() => import('./Campaign-Details'));
export const Properties = lazyWithPreload(() => import('./Properties'));
export const AddProperties = lazyWithPreload(() => import('./Add-Properties'));
export const SettingsPage = lazyWithPreload(() => import('./SettingsPage'));

// Helper type for components that can be wrapped with Suspense
type SuspendableProps<P = any> = {
  fallback?: React.ReactNode;
} & P;

// Wrap components with Suspense and proper loading state
export const withSuspense = <P extends object>(
  Component: ComponentType<P>
) => {
  const WrappedComponent = (props: SuspendableProps<P>) => (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[200px]">
        <BAZLoader />
      </div>
    }>
      <Component {...(props as P)} />
    </Suspense>
  );

  // Preserve displayName for debugging
  WrappedComponent.displayName = `withSuspense(${Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent;
};

// Export function to preload critical routes
export const preloadCriticalRoutes = () => {
  const criticalRoutes = [Dashboard, CampaignList] as const;
  return Promise.all(
    criticalRoutes.map(route => route.preload?.())
  );
};