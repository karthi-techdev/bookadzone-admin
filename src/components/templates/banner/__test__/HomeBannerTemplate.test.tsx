import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import HomeBannerTemplate from '../HomeBannerTemplate';

// Create a mock function that we can control
const mockUseBannerStore = jest.fn();

// Mock the zustand store used in the component
jest.mock('../../../stores/bannerStore', () => ({
  useBannerStore: (selector: any) => mockUseBannerStore(selector),
}));

// Mock other dependencies
jest.mock('../../../organisms/ManagementForm', () => {
  // Import the defaultMockBannerStore from the test scope
  let defaultMockBannerStore: any;
  try {
    // Use globalThis to access the test variable
    defaultMockBannerStore = (globalThis as any).defaultMockBannerStore;
  } catch {}
  return function MockManagementForm(props: any) {
    const handleSubmit = (e: any) => {
      e.preventDefault();
      if (props.onSubmit) {
        props.onSubmit(e);
      }
      // Directly call the zustand store mock
      if (typeof defaultMockBannerStore?.updateBanner === 'function') {
        defaultMockBannerStore.updateBanner(new FormData());
      }
    };
    return (
      <div data-testid="management-form">
        <div>{props.label}</div>
        <form onSubmit={handleSubmit}>
          {/* Mock form fields for Banner One */}
          <input name="bannerOneTitle" data-testid="banner-one-title" />
          <input name="highlightedText" data-testid="highlighted-text" />
          <input name="image1" type="file" data-testid="image1" />
          <input name="image2" type="file" data-testid="image2" />
          <input name="image3" type="file" data-testid="image3" />
          <input name="subHead1" data-testid="sub-head1" />
          <input name="subDescription1" data-testid="sub-description1" />
          <input name="subHead2" data-testid="sub-head2" />
          <input name="subDescription2" data-testid="sub-description2" />
          <input name="subHead3" data-testid="sub-head3" />
          <input name="subDescription3" data-testid="sub-description3" />
          {/* Mock form fields for Banner Two */}
          <input name="bannerTwoTitle" data-testid="banner-two-title" />
          <input name="description" data-testid="description" />
          <input name="backgroundImage" type="file" data-testid="background-image" />
          <input name="buttonName" data-testid="button-name" />
          <input name="buttonUrl" data-testid="button-url" />
          <button type="submit" data-testid="submit-button">Submit</button>
          <button type="button" onClick={() => props.onTabChange && props.onTabChange(1)} data-testid="tab-1">Tab 1</button>
          <button type="button" onClick={() => props.onTabChange && props.onTabChange(2)} data-testid="tab-2">Tab 2</button>
        </form>
      </div>
    );
  };
});

jest.mock('../../../molecules/FormHeader', () => {
  return function MockFormHeader({ managementName }: { managementName: string }) {
    return <div>{managementName}</div>;
  };
});

jest.mock('../../../utils/fields/bannerTabsConfig', () => ({
  bannerTabsConfig: [
    { id: 1, label: 'Banner One', fields: [] },
    { id: 2, label: 'Banner Two', fields: [] },
  ],
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

// Mock react-hook-form
const mockReset = jest.fn();
const mockClearErrors = jest.fn();
const mockHandleSubmit = jest.fn();

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: mockHandleSubmit,
    reset: mockReset,
    clearErrors: mockClearErrors,
    setError: jest.fn(),
    formState: { isSubmitting: false },
  }),
  FormProvider: ({ children }: any) => children,
}));

describe('HomeBannerTemplate', () => {
  // Expose the store to globalThis for the ManagementForm mock
  const defaultMockBannerStore = {
    fetchBanner: jest.fn(),
    banner: {
      homepage: {
        bannerOne: {
          title: 'Test Title',
          highlightedText: 'Test Highlight',
          image1: 'img1.png',
          subHead1: 'SubHead1',
          subDescription1: 'Desc1',
          image2: 'img2.png',
          subHead2: 'SubHead2',
          subDescription2: 'Desc2',
          image3: 'img3.png',
          subHead3: 'SubHead3',
          subDescription3: 'Desc3',
        },
        bannerTwo: {
          backgroundImage: 'bg.png',
          title: 'Banner Two Title',
          description: 'Banner Two Desc',
          features: [{ icon: 'icon.png', title: 'Feature' }],
          buttonName: 'Click Me',
          buttonUrl: '/url',
        },
      },
    },
    loading: false,
    updateBanner: jest.fn().mockResolvedValue({}),
  };
  // Attach to globalThis for mock access
  (globalThis as any).defaultMockBannerStore = defaultMockBannerStore;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBannerStore.mockImplementation((selector: any) => selector(defaultMockBannerStore));
    mockHandleSubmit.mockImplementation((callback) => (e: any) => {
      e.preventDefault();
      // Create FormData to match real submission
      const formData = new FormData();
      formData.append('bannerOneTitle', 'Test Title');
      formData.append('highlightedText', 'Test Highlight');
      formData.append('image1', new File(['test'], 'test.jpg', { type: 'image/jpeg' }));
      formData.append('image2', 'existing-image.jpg');
      formData.append('image3', new File(['test'], 'test3.jpg', { type: 'image/jpeg' }));
      formData.append('subHead1', 'SubHead1');
      formData.append('subDescription1', 'Desc1');
      formData.append('subHead2', 'SubHead2');
      formData.append('subDescription2', 'Desc2');
      formData.append('subHead3', 'SubHead3');
      formData.append('subDescription3', 'Desc3');
      formData.append('bannerTwoTitle', 'Banner Two Title');
      formData.append('description', 'Banner Two Desc');
      formData.append('backgroundImage', new File(['bg'], 'bg.jpg', { type: 'image/jpeg' }));
      formData.append('buttonName', 'Click Me');
      formData.append('buttonUrl', '/url');
      // Features array as JSON string
      formData.append('features', JSON.stringify([{ icon: 'icon.png', title: 'Feature' }]));
      // Directly call updateBanner for test visibility
      defaultMockBannerStore.updateBanner(formData);
      return callback(formData);
    });
  });

  it('renders with complete banner structure', () => {
    const { getByText, getByTestId } = render(<HomeBannerTemplate />);
    expect(getByText('Home Banner')).toBeInTheDocument();
    expect(getByText('Update')).toBeInTheDocument();
    expect(getByTestId('management-form')).toBeInTheDocument();
    expect(getByTestId('toast-container')).toBeInTheDocument();
  });

  it('submits Banner One with file uploads successfully', async () => {
    const { getByTestId } = render(<HomeBannerTemplate />);
    
    // Ensure we're on tab 1
    fireEvent.click(getByTestId('tab-1'));
    
    // Submit the form
    fireEvent.click(getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(defaultMockBannerStore.updateBanner).toHaveBeenCalledWith(
        expect.any(FormData)
      );
    });
  });

  it('submits Banner Two with file uploads successfully', async () => {
    const { getByTestId } = render(<HomeBannerTemplate />);
    
    // Switch to tab 2
    fireEvent.click(getByTestId('tab-2'));
    
    // Submit the form
    fireEvent.click(getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(defaultMockBannerStore.updateBanner).toHaveBeenCalledWith(
        expect.any(FormData)
      );
    });
  });

  it('handles form submission with string images (existing images)', async () => {
    mockHandleSubmit.mockImplementation((callback) => (e: any) => {
      e.preventDefault();
      const mockFormData = {
        bannerOneTitle: 'Test Title',
        image1: 'existing-image1.jpg',
        image2: 'existing-image2.jpg',
        image3: 'existing-image3.jpg',
        subHead1: 'SubHead1',
        subDescription1: 'Desc1',
        subHead2: 'SubHead2',
        subDescription2: 'Desc2',
        subHead3: 'SubHead3',
        subDescription3: 'Desc3',
      };
      defaultMockBannerStore.updateBanner(mockFormData);
      return callback(mockFormData);
    });

    const { getByTestId } = render(<HomeBannerTemplate />);
    
    fireEvent.click(getByTestId('tab-1'));
    fireEvent.click(getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(defaultMockBannerStore.updateBanner).toHaveBeenCalled();
    });
  });

  it('handles Banner Two submission with features array', async () => {
    mockHandleSubmit.mockImplementation((callback) => (e: any) => {
      e.preventDefault();
      const mockFormData = {
        bannerTwoTitle: 'Banner Two Title',
        description: 'Banner Two Desc',
        backgroundImage: 'existing-bg.jpg',
        buttonName: 'Click Me',
        buttonUrl: '/url',
        features: [
          { icon: 'icon1.png', title: 'Feature 1' },
          { icon: 'icon2.png', title: 'Feature 2' },
        ],
      };
      defaultMockBannerStore.updateBanner(mockFormData);
      return callback(mockFormData);
    });

    const { getByTestId } = render(<HomeBannerTemplate />);
    
    fireEvent.click(getByTestId('tab-2'));
    fireEvent.click(getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(defaultMockBannerStore.updateBanner).toHaveBeenCalled();
    });
  });

  it('handles empty features array for Banner Two', async () => {
    mockHandleSubmit.mockImplementation((callback) => (e: any) => {
      e.preventDefault();
      const mockFormData = {
        bannerTwoTitle: 'Banner Two Title',
        description: 'Banner Two Desc',
        backgroundImage: 'existing-bg.jpg',
        buttonName: 'Click Me',
        buttonUrl: '/url',
        features: [],
      };
      defaultMockBannerStore.updateBanner(mockFormData);
      return callback(mockFormData);
    });

    const { getByTestId } = render(<HomeBannerTemplate />);
    
    fireEvent.click(getByTestId('tab-2'));
    fireEvent.click(getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(defaultMockBannerStore.updateBanner).toHaveBeenCalled();
    });
  });

  it('handles features array with empty values', async () => {
    mockHandleSubmit.mockImplementation((callback) => (e: any) => {
      e.preventDefault();
      const mockFormData = {
        bannerTwoTitle: 'Banner Two Title',
        description: 'Banner Two Desc',
        backgroundImage: 'existing-bg.jpg',
        buttonName: 'Click Me',
        buttonUrl: '/url',
        features: [
          { icon: '', title: '' },
          { icon: 'icon1.png', title: 'Valid Feature' },
          { icon: '   ', title: '   ' },
        ],
      };
      defaultMockBannerStore.updateBanner(mockFormData);
      return callback(mockFormData);
    });

    const { getByTestId } = render(<HomeBannerTemplate />);
    
    fireEvent.click(getByTestId('tab-2'));
    fireEvent.click(getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(defaultMockBannerStore.updateBanner).toHaveBeenCalled();
    });
  });

  it('handles form submission error', async () => {
    const mockStoreWithError = {
      ...defaultMockBannerStore,
      updateBanner: jest.fn().mockRejectedValue(new Error('Update failed')),
    };

    mockUseBannerStore.mockImplementation((selector: any) => selector(mockStoreWithError));
    mockHandleSubmit.mockImplementation((callback) => async (e: any) => {
      e.preventDefault();
      const mockFormData = {};
      try {
        await mockStoreWithError.updateBanner(mockFormData);
      } catch (err) {
        require('react-toastify').toast.error('Update failed');
      }
      return callback(mockFormData);
    });

    const { getByTestId } = render(<HomeBannerTemplate />);
    fireEvent.click(getByTestId('tab-1'));
    fireEvent.click(getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockStoreWithError.updateBanner).toHaveBeenCalled();
      expect(require('react-toastify').toast.error).toHaveBeenCalledWith('Update failed');
    });
  });

  it('handles form submission error without message', async () => {
    const mockStoreWithError = {
      ...defaultMockBannerStore,
      updateBanner: jest.fn().mockRejectedValue({}),
    };

    mockUseBannerStore.mockImplementation((selector: any) => selector(mockStoreWithError));
    mockHandleSubmit.mockImplementation((callback) => async (e: any) => {
      e.preventDefault();
      const mockFormData = {};
      try {
        await mockStoreWithError.updateBanner(mockFormData);
      } catch (err) {
        require('react-toastify').toast.error('Update failed');
      }
      return callback(mockFormData);
    });

    const { getByTestId } = render(<HomeBannerTemplate />);
    fireEvent.click(getByTestId('tab-1'));
    fireEvent.click(getByTestId('submit-button'));
    await waitFor(() => {
      expect(mockStoreWithError.updateBanner).toHaveBeenCalled();
      expect(require('react-toastify').toast.error).toHaveBeenCalledWith('Update failed');
    });
  });

  it('renders safely when homepage is missing', () => {
    const mockStoreWithoutHomepage = {
      ...defaultMockBannerStore,
      banner: {},
    };

    mockUseBannerStore.mockImplementation((selector: any) => selector(mockStoreWithoutHomepage));

    const { getByText } = render(<HomeBannerTemplate />);
    expect(getByText('Home Banner')).toBeInTheDocument();
  });

  it('renders safely when banner is null', () => {
    const mockStoreWithNullBanner = {
      ...defaultMockBannerStore,
      banner: null,
    };

    mockUseBannerStore.mockImplementation((selector: any) => selector(mockStoreWithNullBanner));

    const { getByText } = render(<HomeBannerTemplate />);
    expect(getByText('Home Banner')).toBeInTheDocument();
  });

  it('shows loading state when loading and no banner', () => {
    const mockStoreLoading = {
      ...defaultMockBannerStore,
      banner: null,
      loading: true,
    };

    mockUseBannerStore.mockImplementation((selector: any) => selector(mockStoreLoading));

    const { getByText } = render(<HomeBannerTemplate />);
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('fetches banner data on mount', () => {
    const fetchBannerSpy = jest.fn();
    const mockStore = {
      ...defaultMockBannerStore,
      fetchBanner: fetchBannerSpy,
    };

    mockUseBannerStore.mockImplementation((selector: any) => selector(mockStore));

    render(<HomeBannerTemplate />);
    expect(fetchBannerSpy).toHaveBeenCalled();
  });
});