import { ComponentType } from 'react';
import { dAppName } from 'config';
import withPageTitle from './components/PageTitle';

import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Delegators from './pages/Delegators';

export interface RouteType {
  path: string;
  title: string;
  authenticatedRoute?: boolean;
  component: ComponentType;
}

export const routeNames = {
  home: '/',
  dashboard: '/dashboard',
  transaction: '/transaction',
  unlock: '/unlock',
  ledger: '/ledger',
  walletconnect: '/walletconnect',
  admin: '/admin',
  delegators: '/delegators'
};

const routes: Array<RouteType> = [
  {
    path: routeNames.home,
    title: 'Home',
    component: Home
  },
  {
    path: routeNames.dashboard,
    title: 'Dashboard',
    component: Dashboard,
    authenticatedRoute: true
  },
  {
    path: routeNames.admin,
    title: 'Admin',
    component: Admin
  },
  {
    path: routeNames.delegators,
    title: 'Delegators',
    component: Delegators
  }
];

const mappedRoutes = routes.map((route) => {
  const title = route.title
    ? `${route.title} • MultiversX ${dAppName}`
    : `MultiversX ${dAppName}`;

  const requiresAuth = Boolean(route.authenticatedRoute);
  const wrappedComponent = withPageTitle(title, route.component);

  return {
    path: route.path,
    component: wrappedComponent,
    authenticatedRoute: requiresAuth
  };
});

export default mappedRoutes;
