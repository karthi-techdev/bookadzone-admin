import React, { createContext, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import ImportedURL from '../common/urls';
import type { Settings } from '../types/common';

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  fileUrl: string;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  loading: false,
  fileUrl: ImportedURL.FILEURL
});

export const useSettings = () => useContext(SettingsContext);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const settings = useSettingsStore(state => state.settings);
  const loading = useSettingsStore(state => state.loading);
  const fetchSettings = useSettingsStore(state => state.fetchSettings);

  // Fetch settings asynchronously without blocking render
  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('token');
    
    if (token) {
      // Use setTimeout to defer the fetch and allow UI to render first
      const timeoutId = setTimeout(() => {
        if (isMounted) {
          fetchSettings().catch(error => {
            if (isMounted) {
              console.error('Failed to fetch settings:', error);
            }
          });
        }
      }, 0);

      return () => {
        isMounted = false;
        clearTimeout(timeoutId);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [fetchSettings]);

  const updateFavicon = (faviconUrl: string, type: string) => {
    const linkElement = document.querySelector('link[rel="icon"]') as HTMLLinkElement || 
      document.createElement('link');
    linkElement.type = type;
    linkElement.rel = 'icon';
    linkElement.href = faviconUrl;
    
    if (!document.querySelector('link[rel="icon"]')) {
      document.head.appendChild(linkElement);
    }
  };

  const updateMetaTag = (name: string, content: string) => {
    let metaTag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.name = name;
      document.head.appendChild(metaTag);
    }
    metaTag.content = content;
  };

  const updateOgMetaTag = (property: string, content: string) => {
    let metaTag = document.querySelector(`meta[property="og:${property}"]`) as HTMLMetaElement;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('property', `og:${property}`);
      document.head.appendChild(metaTag);
    }
    metaTag.content = content;
  };

  const updateCanonicalUrl = (url: string) => {
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = url;
  };

  const updateSchemaMarkup = (markup: string) => {
    let schemaScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    try {
      schemaScript.textContent = markup;
    } catch (e) {
      console.error('Invalid schema markup:', e);
    }
  };

  const setupGoogleAnalytics = (gaId: string) => {
    if (!document.querySelector('script[data-ga-id]')) {
      const gaScript = document.createElement('script');
      gaScript.setAttribute('data-ga-id', gaId);
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(gaScript);

      const gaConfigScript = document.createElement('script');
      gaConfigScript.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `;
      document.head.appendChild(gaConfigScript);
    }
  };

  // Defer DOM updates to not block initial render
  useEffect(() => {
    if (!settings) return;

    // Use requestAnimationFrame to defer heavy DOM operations
    const updateDOM = () => {
      // Update favicon
      if (settings.general?.favicon) {
        const faviconUrl = `${ImportedURL.FILEURL}${settings.general.favicon}`;
        const type = settings.general.favicon.endsWith('.ico') ? 'image/x-icon' : 'image/png';
        updateFavicon(faviconUrl, type);
      }

      // Update SEO settings
      if (settings.seo) {
        document.title = settings.seo.metaTitle || settings.general?.siteName || 'Bookadzone Admin';
        
        const seoUpdates = {
          description: settings.seo.metaDescription,
          keywords: settings.seo.metaKeyword,
          robots: settings.seo.robotsMeta,
          'google-site-verification': settings.seo.googleSearchConsoleCode
        };

        Object.entries(seoUpdates).forEach(([name, content]) => {
          if (content) updateMetaTag(name, content);
        });

        if (settings.seo.canonicalUrl) updateCanonicalUrl(settings.seo.canonicalUrl);
        if (settings.seo.schemaMarkup) updateSchemaMarkup(settings.seo.schemaMarkup);
        if (settings.seo.googleAnalyticsCode) setupGoogleAnalytics(settings.seo.googleAnalyticsCode);
      }

      // Update Open Graph settings
      if (settings.og) {
        const ogUpdates = {
          title: settings.og.ogTitle,
          description: settings.og.ogDescription,
          image: settings.og.ogImage ? `${ImportedURL.FILEURL}${settings.og.ogImage}` : undefined,
          url: settings.og.ogUrl,
          type: settings.og.ogType
        };

        Object.entries(ogUpdates).forEach(([property, content]) => {
          if (content) updateOgMetaTag(property, content);
        });
      }
    };

    // Defer the DOM updates to not block render
    const rafId = requestAnimationFrame(updateDOM);
    
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [settings]);

  const contextValue = useMemo(() => {
    return {
      settings,
      loading,
      fileUrl: ImportedURL.FILEURL
    };
  }, [settings, loading]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};