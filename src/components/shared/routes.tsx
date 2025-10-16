import type { ReactNode } from 'react';
import { lazy } from 'react';

// Core/Common Components
import Dashboard from '../pages/Dashboard';
import Login from '../templates/auth/loginTemplate';

// Property Management
import Properties from '../pages/Properties';
import AddProperties from '../pages/Add-Properties';
import CampaignList from '../pages/Campaign-List';
import CampaignDetails from '../pages/Campaign-Details';

// Agency Management
import AgencyListPage from '../pages/agency/AgencyListPage';
import AgencyFormPage from '../pages/agency/AgencyFormPage';
import AgencyViewPage from '../pages/agency/AgencyViewPage';

// Content Management
import BannerPage from '../pages/banner/HomeBannerPage';
import AboutBannerPage from '../pages/banner/AboutBannerPage';
import FaqListPage from '../pages/faq/FaqListPage';
import FaqFormPage from '../pages/faq/FaqFormPage';
import NewsLetterListPage from '../pages/newsLetter/NewsLetterListPage';
import NewsLetterFormPage from '../pages/newsLetter/NewsLetterFormPage';
import FooterInfoListPage from '../pages/footerinfo/FooterInfoListPage';
import FooterInfoFormPage from '../pages/footerinfo/FooterInfoFormPage';
import ConfigListPage from '../pages/config/ConfigListPage';
import ConfigFormPage from '../pages/config/ConfigFormPage';

// Authentication Pages (Lazy Loaded)
const ForgotPassword = lazy(() => import('../templates/auth/forgotPasswordTemplate'));
const ResetPassword = lazy(() => import('../templates/auth/resetPasswordTemplate'));

// Content Management (Lazy Loaded)
const BlogCategoryListPage = lazy(() => import('../pages/blogCategory/BlogCaategoryListPage'));
const BlogCategoryFormPage = lazy(() => import('../pages/blogCategory/BlogCategoryFormPage'));
const CategoryListPage = lazy(() => import('../pages/category/CategoryListPage'));
const CategoryFormPage = lazy(() => import('../pages/category/CategoryFormPage'));

// Trash Pages (Lazy Loaded)
const NewsLetterTrashListPage = lazy(() => import('../pages/trash/newsLetter/NewsLetterTrashListPage'));
const FaqTrashListPage = lazy(() => import('../pages/trash/faq/FaqTrashListPage'));
const BlogCategoryTrashListPage = lazy(() => import('../pages/trash/blogCategory/BlogTrashListPage'));
const CategoryTrashListPage = lazy(() => import('../pages/trash/category/CategoryTrashListPage'));
const FooterInfoTrashListPage = lazy(() => import('../pages/trash/footerinfo/FooterInfoTrashListPage'));
const ConfigTrashListPage = lazy(() => import('../pages/trash/config/ConfigTrashListPage'));
const AgencyTrashListPage = lazy(() => import('../pages/agency/AgencyTrashListPage'));

//pages management (Lazy Loaded)
const PageListPage = lazy(() => import('../pages/page/PageListPage'));
const PageFormPage = lazy(() => import('../pages/page/PageFormPage'));
const PageTrashListPage = lazy(() => import('../pages/trash/page/PageTrashListPage'));

// Settings Pages (Lazy Loaded)
const GeneralSettingsPage = lazy(() => import('../pages/settings/GeneralSettingsPage'));
const ContactInfoPage = lazy(() => import('../pages/settings/ContactInfoPage'));
const EmailConfigPage = lazy(() => import('../pages/settings/EmailConfigPage'));
const SeoConfigPage = lazy(() => import('../pages/settings/SeoConfigPage'));
const OgConfigPage = lazy(() => import('../pages/settings/OgConfigPage'));
const UserRoleListPage = lazy(() => import('../pages/userrole/UserRoleListPage'));
const UserRoleFormPage = lazy(() => import('../pages/userrole/UserRoleFormPage'));

// Profile Pages (Lazy Loaded)
const ProfileUpdatePage = lazy(() => import('../pages/profile/ProfileUpdatePage'));
const ChangePasswordPage = lazy(() => import('../pages/profile/ChangePasswordPage'));
export interface RouteData {
  path: string;
  pageTitle: string;
  component: ReactNode;
}

export const routesData = (): RouteData[] => {
  const Routes: RouteData[] = [
    // Core Routes
    {
      path: '/',
      pageTitle: 'Dashboard',
      component: <Dashboard />,
    },

    // Authentication Routes
    {
      path: '/login',
      pageTitle: 'Login',
      component: <Login />,
    },
    {
      path: '/forgot-password',
      pageTitle: 'Forgot Password',
      component: <ForgotPassword />,
    },
    {
      path: '/reset-password',
      pageTitle: 'Reset Password',
      component: <ResetPassword />,
    },

    // Property Management Routes
    {
      path: '/listings/properties',
      pageTitle: 'Properties',
      component: <Properties />,
    },
    {
      path: '/listings/properties/add-property',
      pageTitle: 'Add Property',
      component: <AddProperties />,
    },
    {
      path: '/bookings/campaigns-list',
      pageTitle: 'Campaigns List',
      component: <CampaignList />,
    },
    {
      path: '/bookings/campaigns-list/campaign-details',
      pageTitle: 'Campaign Details',
      component: <CampaignDetails />,
    },

    // Agency Management Routes
    {
      path: '/agency',
      pageTitle: 'Agency List',
      component: <AgencyListPage />,
    },
    {
      path: '/agency/add',
      pageTitle: 'Add Agency',
      component: <AgencyFormPage />,
    },
    {
      path: '/agency/edit/:id',
      pageTitle: 'Edit Agency',
      component: <AgencyFormPage />,
    },
    {
      path: '/agency/view/:id',
      pageTitle: 'View Agency',
      component: <AgencyViewPage />,
    },
    {
      path: '/trash/agency',
      pageTitle: 'Agency Trash',
      component: <AgencyTrashListPage />,
    },

    // Banner Management Routes
    {
      path: '/banner/homepage',
      pageTitle: 'Home Banners',
      component: <BannerPage />,
    },
    {
      path: '/banner/about',
      pageTitle: 'About Banner',
      component: <AboutBannerPage />,
    },

    // Content Management Routes
    {
      path: '/faq',
      pageTitle: 'FAQ List',
      component: <FaqListPage />,
    },
    {
      path: '/faq/add',
      pageTitle: 'Add FAQ',
      component: <FaqFormPage />,
    },
    {
      path: '/faq/edit/:id',
      pageTitle: 'Edit FAQ',
      component: <FaqFormPage />,
    },


    {
      path: '/userrole',
      pageTitle: 'UserRole List',
      component: <UserRoleListPage />,
    },
    {
      path: '/userrole/add',
      pageTitle: 'Add UserRole',
      component: <UserRoleFormPage />,
    },
    {
      path: '/userrole/edit/:id',
      pageTitle: 'Edit UserRole',
      component: <UserRoleFormPage />,
    },
    {
      path: '/trash/faq',
      pageTitle: 'FAQ Trash',
      component: <FaqTrashListPage />,
    },

    // Newsletter Management Routes
    {
      path: '/newsletter',
      pageTitle: 'Newsletter List',
      component: <NewsLetterListPage />,
    },
    {
      path: '/newsletter/add',
      pageTitle: 'Add Newsletter',
      component: <NewsLetterFormPage />,
    },
    {
      path: '/newsletter/edit/:id',
      pageTitle: 'Edit Newsletter',
      component: <NewsLetterFormPage />,
    },
    {
      path: '/trash/newsletter',
      pageTitle: 'Newsletter Trash',
      component: <NewsLetterTrashListPage />,
    },
    
    // Page routes
    {
      path: '/page',
      pageTitle: 'Page List',
      component: <PageListPage />,
    },
    {
      path: '/page/add',
      pageTitle: 'Add Page',
      component: <PageFormPage />,
    },
    {
      path: '/page/edit/:id',
      pageTitle: 'Edit Page',
      component: <PageFormPage />,
    },
    {
      path: '/trash/page',
      pageTitle: 'Trash Page',
      component: <PageTrashListPage />,
    },

    // Footer Management Routes
    {
      path: '/footerinfo',
      pageTitle: 'Footer List',
      component: <FooterInfoListPage />,
    },
    {
      path: '/footerinfo/add',
      pageTitle: 'Add Footer',
      component: <FooterInfoFormPage />,
    },
    {
      path: '/footerinfo/edit/:id',
      pageTitle: 'Edit Footer',
      component: <FooterInfoFormPage />,
    },
    {
      path: '/trash/footerinfo',
      pageTitle: 'Footer Trash',
      component: <FooterInfoTrashListPage />,
    },

    // Configuration Routes
    {
      path: '/config',
      pageTitle: 'Config List',
      component: <ConfigListPage />,
    },
    {
      path: '/config/add',
      pageTitle: 'Add Config',
      component: <ConfigFormPage />,
    },
    {
      path: '/config/edit/:id',
      pageTitle: 'Edit Config',
      component: <ConfigFormPage />,
    },
    {
      path: '/trash/config',
      pageTitle: 'Config Trash',
      component: <ConfigTrashListPage />,
    },

    // Blog Category Routes
    {
      path: '/blogcategory',
      pageTitle: 'Blog Category List',
      component: <BlogCategoryListPage />,
    },
    {
      path: '/blogcategory/add',
      pageTitle: 'Add Blog Category',
      component: <BlogCategoryFormPage />,
    },
    {
      path: '/blogcategory/edit/:id',
      pageTitle: 'Edit Blog Category',
      component: <BlogCategoryFormPage />,
    },
    {
      path: '/trash/blogcategory',
      pageTitle: 'Blog Category Trash',
      component: <BlogCategoryTrashListPage />,
    },

    // Category Routes
    {
      path: '/category',
      pageTitle: 'Category List',
      component: <CategoryListPage />,
    },
    {
      path: '/category/add',
      pageTitle: 'Add Category',
      component: <CategoryFormPage />,
    },
    {
      path: '/category/edit/:id',
      pageTitle: 'Edit Category',
      component: <CategoryFormPage />,
    },
    {
      path: '/trash/category',
      pageTitle: 'Category Trash',
      component: <CategoryTrashListPage />,
    },

    // Settings Routes
    {
      path: '/settings/general',
      pageTitle: 'General Settings',
      component: <GeneralSettingsPage />,
    },
    {
      path: '/settings/contact',
      pageTitle: 'Contact Info',
      component: <ContactInfoPage />,
    },
    {
      path: '/settings/email',
      pageTitle: 'Email Configuration',
      component: <EmailConfigPage />,
    },
    {
      path: '/settings/seo',
      pageTitle: 'SEO Configuration',
      component: <SeoConfigPage />,
    },
    {
      path: '/settings/og',
      pageTitle: 'OG Configuration',
      component: <OgConfigPage />,
    },

    // Profile Routes
    {
      path: '/profile/update',
      pageTitle: 'Update Profile',
      component: <ProfileUpdatePage />,
    },
    {
      path: '/profile/change-password',
      pageTitle: 'Change Password',
      component: <ChangePasswordPage />,
    },
  ];
  return Routes;
};
