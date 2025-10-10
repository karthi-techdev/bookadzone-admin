import type { ReactNode } from 'react';
import { lazy } from 'react';

// Direct imports for frequently accessed components
import Dashboard from '../pages/Dashboard';
import Properties from '../pages/Properties';
import Login from '../templates/auth/loginTemplate';
import AddProperties from '../pages/Add-Properties';
import AgencyListPage from '../pages/agency/AgencyListPage';
import AgencyFormPage from '../pages/agency/AgencyFormPage';
import AgencyViewPage from '../pages/agency/AgencyViewPage';
import FaqListPage from '../pages/faq/FaqListPage';
import FaqFormPage from '../pages/faq/FaqFormPage';
import NewsLetterListPage from '../pages/newsLetter/NewsLetterListPage';
import NewsLetterFormPage from '../pages/newsLetter/NewsLetterFormPage';
import CategoryListPage from '../pages/category/CategoryListPage';
import CategoryFormPage from '../pages/category/CategoryFormPage';
import BannerPage from '../pages/banner/HomeBannerPage';
import AboutBannerPage from '../pages/banner/AboutBannerPage';
import FooterInfoListPage from '../pages/footerinfo/FooterInfoListPage';
import FooterInfoFormPage from '../pages/footerinfo/FooterInfoFormPage';
import ConfigListPage from '../pages/config/ConfigListPage';
import ConfigFormPage from '../pages/config/ConfigFormPage';
import CampaignList from '../pages/Campaign-List';
import CampaignDetails from '../pages/Campaign-Details';

// Lazy load infrequently accessed components
const ForgotPassword = lazy(() => import('../templates/auth/forgotPasswordTemplate'));
const ResetPassword = lazy(() => import('../templates/auth/resetPasswordTemplate'));
const NewsLetterTrashListPage = lazy(() => import('../pages/trash/newsLetter/NewsLetterTrashListPage'));
const FaqTrashListPage = lazy(() => import('../pages/trash/faq/FaqTrashListPage'));
const CategoryTrashListPage = lazy(() => import('../pages/trash/category/CategoryTrashListPage'));
const FooterInfoTrashListPage = lazy(() => import('../pages/trash/footerinfo/FooterInfoTrashListPage'));
const ConfigTrashListPage = lazy(() => import('../pages/trash/config/ConfigTrashListPage'));
const AgencyTrashListPage = lazy(() => import('../pages/agency/AgencyTrashListPage'));

// Lazy load settings pages as they're accessed less frequently
const GeneralSettingsPage = lazy(() => import('../pages/settings/GeneralSettingsPage'));
const ContactInfoPage = lazy(() => import('../pages/settings/ContactInfoPage'));
const EmailConfigPage = lazy(() => import('../pages/settings/EmailConfigPage'));
const SeoConfigPage = lazy(() => import('../pages/settings/SeoConfigPage'));
const OgConfigPage = lazy(() => import('../pages/settings/OgConfigPage'));
export interface RouteData {
  path: string;
  pageTitle: string;
  component: ReactNode;
}

export const routesData = (): RouteData[] => {

  const Routes: RouteData[] = [
    {
      path: '/banner/homepage',
      pageTitle: 'Banners',
    component: <BannerPage />, 
    },
    {
      path: '/banner/about',
      pageTitle: 'About Banner',
      component: <AboutBannerPage />,
    },
    {
      path: '/',
      pageTitle: 'Dashboard',
      component: <Dashboard />,
    },
    {
      path: '/listings/properties',
      pageTitle: 'Properties',
      component: <Properties />,
    },
    {
      path: '/listings/properties/add-property',
      pageTitle: 'Add-Property',
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
    // FAQ routes
    {
      path: '/faq',
      pageTitle: 'FAQ List',
      component: <FaqListPage />,
    },
    // Agency routes
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
     // NewsLetter routes
    {
      path: '/newsletter',
      pageTitle: 'NewsLetter List',
      component: <NewsLetterListPage />,
    },
    {
      path: '/newsletter/add',
      pageTitle: 'Add NewsLetter',
      component: <NewsLetterFormPage />,
    },
    {
      path: '/newsletter/edit/:id',
      pageTitle: 'Edit NewsLetter',
      component: <NewsLetterFormPage />,
    },
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
      pageTitle: 'Trash Config',
      component: <ConfigTrashListPage />,
    },
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
    {
      path: '/trash/faq',
      pageTitle: 'Trash FooterInfo',
      component: <FaqTrashListPage />,
    },

    // Category routes
    {
      path: '/category',
      pageTitle: 'Category List',
      component: <CategoryListPage />,
    },
     {
      path: '/category/add',
      pageTitle: ' Add Category ',
      component: <CategoryFormPage />,
    },
    {
      path: '/categorys/edit/:id',
      pageTitle: 'Edit Category',
      component: <CategoryFormPage />,
    },
     {
      path: '/trash/categorys',
      pageTitle: 'Trash Category',
      component: <CategoryTrashListPage />,
    },

    {
      path: '/trash/newsletter',
      pageTitle: 'Trash NewsLetterInfo',
      component: <NewsLetterTrashListPage />,
    },
     {
      path: '/trash/footerinfo',
      pageTitle: 'Trash FooterInfo',
      component: <FooterInfoTrashListPage />,
     },
    // Settings routes
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
  ];
  return Routes;
};
