import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AboutBannertTemplate from '../AboutBannerTemplate';
import { useBannerStore } from '../../../stores/bannerStore';

jest.mock('../../../stores/bannerStore');

const mockFetchBanner = jest.fn();
const mockUpdateBanner = jest.fn();

const mockBanner = {
  aboutBanner: {
    bannerOne: {
      title: 'Submenu1',
      description: 'Desc1',
      backgroundImage: 'bg1.jpg',
      images: [{ id: 1, url: 'img1.jpg' }],
    },
    bannerTwo: {
      title: 'Submenu2',
      description: 'Desc2',
      backgroundImage: 'bg2.jpg',
      images: [{ id: 2, url: 'img2.jpg' }],
    },
  },
};

describe('AboutBannertTemplate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useBannerStore as unknown as jest.Mock).mockImplementation((selector) => {
      return selector({
        fetchBanner: mockFetchBanner,
        banner: mockBanner,
        loading: false,
        updateBanner: mockUpdateBanner,
      });
    });
  });

  it('renders loading state', () => {
    (useBannerStore as unknown as jest.Mock).mockImplementation((selector) => {
      return selector({
        fetchBanner: mockFetchBanner,
        banner: null,
        loading: true,
        updateBanner: mockUpdateBanner,
      });
    });
    render(<AboutBannertTemplate />);
    expect(screen.getByText(/Loading banner data/)).toBeInTheDocument();
  });

  it('renders form with initial data', async () => {
    render(
      <MemoryRouter>
        <AboutBannertTemplate />
      </MemoryRouter>
    );
  // There are multiple elements with 'About Banner', so use getAllByText
  expect(screen.getAllByText('About Banner').length).toBeGreaterThan(0);
    expect(screen.getByDisplayValue('Submenu1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Desc1')).toBeInTheDocument();
  });

  it('submits About Submenu 1 form', async () => {
    render(
      <MemoryRouter>
        <AboutBannertTemplate />
      </MemoryRouter>
    );
  fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Submenu1' } });
    fireEvent.click(screen.getByText(/Update/i));
    await waitFor(() => {
      expect(mockUpdateBanner).toHaveBeenCalled();
    });
  });

  it('submits About Submenu 2 form', async () => {
    render(
      <MemoryRouter>
        <AboutBannertTemplate />
      </MemoryRouter>
    );
  fireEvent.click(screen.getByText(/Banner Two/i)); // Switch tab
  fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Submenu2' } });
    fireEvent.click(screen.getByText(/Update/i));
    await waitFor(() => {
      expect(mockUpdateBanner).toHaveBeenCalled();
    });
  });

  it('handles update error', async () => {
    mockUpdateBanner.mockRejectedValueOnce(new Error('Update failed'));
    render(
      <MemoryRouter>
        <AboutBannertTemplate />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText(/Update/i));
    await waitFor(() => {
      expect(screen.getByText(/Update failed/)).toBeInTheDocument();
    });
  });
});
