import type { ReactNode } from 'react';
import { lazy } from 'react';

const Dashboard = lazy(() => import('../pages/ExampleMultiStepForm'));
const Properties = lazy(() => import('../pages/Properties'));
const Login = lazy(() => import('../pages/auth/LoginPage'));
const AddProperties = lazy(() => import('../pages/Add-Properties'));
const CampaignList = lazy(() => import('../pages/Campaign-List'));
const CampaignDetails = lazy(() => import('../pages/Campaign-Details'));
const FaqListPage = lazy(() => import('../pages/faq/FaqListPage'));
const FaqFormPage = lazy(() => import('../pages/faq/FaqFormPage'));
const NewsLetterListPage = lazy(() => import('../pages/newsLetter/NewsLetterListPage'));
const NewsLetterFormPage = lazy(() => import('../pages/newsLetter/NewsLetterFormPage'));
const NewsLetterTrashListPage = lazy(() => import('../pages/trash/newsLetter/NewsLetterTrashListPage'));

const FaqTrashListPage = lazy(() => import('../pages/trash/faq/FaqTrashListPage'));

// Category
const CategoryListPage = lazy(() => import('../pages/category/CategoryListPage'));
const CategoryFormPage = lazy(() => import('../pages/category/CategoryFormPage'));
const CategoryTrashListPage = lazy(() => import('../pages/trash/category/CategoryTrashListPage'));

const FooterInfoListPage = lazy(() => import('../pages/footerinfo/FooterInfoListPage'));
const FooterInfoFormPage = lazy(() => import('../pages/footerinfo/FooterInfoFormPage'));
const FooterInfoTrashListPage = lazy(() => import('../pages/trash/footerinfo/FooterInfoTrashListPage'));

const ConfigListPage = lazy(() => import('../pages/config/ConfigListPage'));
const ConfigFormPage = lazy(() => import('../pages/config/ConfigFormPage'));
const ConfigTrashListPage = lazy(() => import('../pages/trash/config/ConfigTrashListPage'));
const GeneralSettingsPage = lazy(() => import('../pages/settings/GeneralSettingsPage'));
const ContactInfoPage = lazy(() => import('../pages/settings/ContactInfoPage'));
const EmailConfigPage = lazy(() => import('../pages/settings/EmailConfigPage'));
const SeoConfigPage = lazy(() => import('../pages/settings/SeoConfigPage'));
const OgConfigPage = lazy(() => import('../pages/settings/OgConfigPage'));
const BannerPage = lazy(() => import('../pages/banner/HomeBannerPage'));
const AboutBannerPage = lazy(() => import('../pages/banner/AboutBannerPage'));
  const AgencyListPage = lazy(() => import('../pages/agency/AgencyListPage'));
  const AgencyFormPage = lazy(() => import('../pages/agency/AgencyFormPage'));
  const AgencyTrashListPage = lazy(() => import('../pages/agency/AgencyTrashListPage'));
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
    component: <BannerPage />, // Ensure BannerPage uses BannerManagementTemplate, not BannerTemplate
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
      pageTitle: 'FAQ List',
      component: <FooterInfoListPage />,
    },
    {
      path: '/footerinfo/add',
      pageTitle: 'Add FAQ',
      component: <FooterInfoFormPage />,
    },
    {
      path: '/footerinfo/edit/:id',
      pageTitle: 'Edit FAQ',
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
      path: '/Login',
      pageTitle: 'Login',
      component: <Login />,
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
