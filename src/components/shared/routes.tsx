import { lazy, type ReactNode } from 'react';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Properties = lazy(() => import('../pages/Properties'));
const Login = lazy(() => import('../pages/auth/LoginPage'));
const AddProperties = lazy(() => import('../pages/Add-Properties'));
const CampaignList = lazy(() => import('../pages/Campaign-List'));
const CampaignDetails = lazy(() => import('../pages/Campaign-Details'));
const FaqListPage = lazy(() => import('../pages/faq/FaqListPage'));
const FaqFormPage = lazy(() => import('../pages/faq/FaqFormPage'));
const FaqTrashListPage = lazy(() => import('../pages/trash/faq/FaqTrashListPage'));

// Category
const CategoryListPage = lazy(() => import('../pages/category/CategoryListPage'));
const CategoryFormPage = lazy(() => import('../pages/category/CategoryFormPage'));




export interface RouteData {
  path: string;
  pageTitle: string;
  component: ReactNode;
}

export const routesData = (): RouteData[] => {
  const Routes: RouteData[] = [
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
      path: '/Login',
      pageTitle: 'Login',
      component: <Login />,
    },
    {
      path: '/trash/faq',
      pageTitle: 'Trash FAQ',
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
      component: <CategoryListPage />,
    },

  ];
  return Routes;
};
