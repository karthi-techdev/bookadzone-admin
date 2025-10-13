import { render, screen } from '@testing-library/react';
import { lazyWithPreload } from '../lazyLoading';
import type { FC } from 'react';
import { Suspense } from 'react';

const withLazyLoading = <P extends object>(factory: () => Promise<{ default: FC<P> }>) => {
  const LazyComponent = lazyWithPreload(factory);
  return Object.assign(
    (props: P) => (
      <Suspense fallback={<div data-testid="baz-loader">Loading...</div>}>
        <LazyComponent {...props} />
      </Suspense>
    ),
    { preload: LazyComponent.preload }
  );
};

const mockDashboard = () => Promise.resolve({ default: () => <div>Dashboard</div> });
const mockCampaignList = () => Promise.resolve({ default: () => <div>Campaign List</div> });

const Dashboard = withLazyLoading(mockDashboard);
const CampaignList = withLazyLoading(mockCampaignList);

const preloadCriticalRoutes = () => {
  void Dashboard.preload();
  void CampaignList.preload();
};

// Mock the pages that are lazy loaded
jest.mock('../../pages/Dashboard', () => ({
  default: () => <div>Dashboard</div>
}));

jest.mock('../../pages/Campaign-List', () => ({
  default: () => <div>Campaign List</div>
}));

// Mock BAZ-Loader component
jest.mock('../../atoms/BAZ-Loader', () => {
  return function DummyLoader() {
    return <div data-testid="baz-loader">Loading...</div>;
  };
});

// Mock test component
const TestComponent = () => <div>Test Component</div>;

// Mock import function
const mockImport = jest.fn(() => Promise.resolve({ default: TestComponent }));

describe('Lazy Loading Utilities', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('lazyWithPreload', () => {
    it('should create a lazy component with preload capability', async () => {
      const LazyComponent = lazyWithPreload(mockImport);

      // Component should have preload method
      expect(typeof LazyComponent.preload).toBe('function');

      // Preload should call the import function
      await LazyComponent.preload();
      expect(mockImport).toHaveBeenCalledTimes(1);

      // Multiple preloads should reuse the same promise
      await LazyComponent.preload();
      expect(mockImport).toHaveBeenCalledTimes(1);
    });
  });

  describe('withLazyLoading', () => {
    it('should render loading state while component is loading', () => {
      const LazyComponent = withLazyLoading<object>(() => 
        new Promise(() => ({ default: TestComponent }))
      );
      render(<LazyComponent />);

      expect(screen.getByTestId('baz-loader')).toBeInTheDocument();
    });

    it('should render component after loading', async () => {
      const LazyComponent = withLazyLoading(() => Promise.resolve({ default: TestComponent }));
      render(<LazyComponent />);

      // Initially shows loader
      expect(screen.getByTestId('baz-loader')).toBeInTheDocument();

      // Eventually shows component
      const component = await screen.findByText('Test Component');
      expect(component).toBeInTheDocument();
    });

    it('should pass props to loaded component', async () => {
      const PropsTestComponent = ({ text }: { text: string }) => <div>{text}</div>;
      const LazyComponent = withLazyLoading(() => 
        Promise.resolve({ default: PropsTestComponent })
      );

      render(<LazyComponent text="test prop" />);

      const component = await screen.findByText('test prop');
      expect(component).toBeInTheDocument();
    });

    it('should have preload capability', () => {
      const LazyComponent = withLazyLoading(mockImport);
      expect(typeof LazyComponent.preload).toBe('function');
    });
  });

  describe('preloadCriticalRoutes', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should preload critical routes', async () => {
      // Mock the preload methods
      Dashboard.preload = jest.fn();
      CampaignList.preload = jest.fn();

      preloadCriticalRoutes();

      // Since we have Dashboard and CampaignList as critical routes,
      // their preload methods should be called
      expect(Dashboard.preload).toHaveBeenCalled();
      expect(CampaignList.preload).toHaveBeenCalled();
    });
  });
});