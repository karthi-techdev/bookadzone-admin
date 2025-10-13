import { lazy, Suspense } from 'react';
import BAZLoader from '../atoms/BAZ-Loader';

type PreloadableComponent<T> = React.ComponentType<T> & {
  preload?: () => Promise<{ default: React.ComponentType<T> }>;
};

// Generic lazy loading wrapper with loading state
export const withLazyLoading = <T extends object>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>
): PreloadableComponent<T> => {
  const LazyComponent = lazy(importFn);

  // Create wrapped component with loading state
  const WrappedComponent: React.FC<T> = (props: T) => (
    <Suspense fallback={<div className="flex items-center justify-center"><BAZLoader /></div>}>
      <LazyComponent {...props} />
    </Suspense>
  );

  // Add preload capability
  return Object.assign(WrappedComponent, { preload: importFn });
};

// Lazy loaded routes with proper typing
export const Dashboard = withLazyLoading(() => import('../pages/Dashboard'));
export const CampaignList = withLazyLoading(() => import('../pages/Campaign-List'));
export const CampaignDetails = withLazyLoading(() => import('../pages/Campaign-Details'));
export const Properties = withLazyLoading(() => import('../pages/Properties'));
export const AddProperties = withLazyLoading(() => import('../pages/Add-Properties'));
export const Settings = withLazyLoading(() => import('../pages/SettingsPage'));

// Preload critical routes with proper typing
export const preloadCriticalRoutes = () => {
  const criticalRoutes = [Dashboard, CampaignList] as const;
  criticalRoutes.forEach(component => {
    component.preload?.();
  });
};

// Export the route component type for use in other files
export type RouteComponent = ReturnType<typeof withLazyLoading>;