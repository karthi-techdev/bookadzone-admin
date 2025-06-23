import { lazy } from 'react';
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Listings = lazy(() => import('../pages/Listings'));
const Login = lazy(() => import('../pages/Login'));

export const routesData = () => {
    const Routes = [
        {
            path: "/",
            pageTitle: "Dashboard",
            component: <Dashboard />
        },
        {
            path: "/Listings",
            pageTitle: "Listings",
            component: <Listings />
        },
        {
            path: "/Login",
            pageTitle: "Login",
            component: <Login />
        },
    ];

    return Routes;
}