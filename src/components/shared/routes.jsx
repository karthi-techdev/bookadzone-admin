import { lazy } from 'react';
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Properties = lazy(() => import('../pages/Properties'));
const Login = lazy(() => import('../pages/Login'));
const AddProperties = lazy(() => import('../pages/Add-Properties'));
const CampaignList = lazy(() => import('../pages/Campaign-List'));
const CampaignDetails = lazy(() => import('../pages/Campaign-Details'));

export const routesData = () => {
    const Routes = [
        {
            path: "/",
            pageTitle: "Dashboard",
            component: <Dashboard />
        },
        {
            path: "/listings/properties",
            pageTitle: "Properties",
            component: <Properties />
        },
        {
            path: "/listings/properties/add-property",
            pageTitle: "Add-Property",
            component: <AddProperties />
        },
        {
            path: "/bookings/campaigns-list",
            pageTitle: "Campaigns List",
            component: <CampaignList />
        },
        {
            path: "/bookings/campaigns-list/campaign-details",
            pageTitle: "Campaign Details",
            component: <CampaignDetails />
        },
        {
            path: "/Login",
            pageTitle: "Login",
            component: <Login />
        },
    ];

    return Routes;
}