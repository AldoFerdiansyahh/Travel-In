import LandingPage from '../pages/landing.f7';
import HomePage from '../pages/user/home.f7';
import LoginPage from '../pages/user/login.f7';
import RegisterPage from '../pages/user/register.f7';
import SearchResultsPage from '../pages/user/search-results.f7';
import TravelDetailPage from '../pages/user/travel-detail.f7';
import BookingPage from '../pages/user/booking.f7';
import PaymentPage from '../pages/user/payment.f7';
import ETicketPage from '../pages/user/e-ticket.f7';
import SettingsPage from '../pages/settings.f7';

import AdminDashboardPage from '../pages/admin/dashboard.f7';
import AdminArmadaPage from '../pages/admin/armada-management.f7';
import AdminSchedulePage from '../pages/admin/schedule-management.f7';
import AdminScheduleDetailPage from '../pages/admin/schedule-detail.f7';
import AdminTicketMonitoringPage from '../pages/admin/ticket-monitoring.f7';

import NotFoundPage from '../pages/404.f7';
import store from './store.js';

const requireAuth = (component) => async ({ router, resolve, reject }) => {
  if (store.state.currentUser) {
    resolve({ component });
  } else {
    router.navigate('/login/');
    reject();
  }
};

const requireAdmin = (component) => async ({ router, resolve, reject }) => {
  const currentUser = store.state.currentUser;
  if (currentUser && currentUser.role === 'admin') {
    resolve({ component });
  } else {
    router.navigate('/login/');
    reject();
  }
};

const routes = [
  {
    path: '/',
    async: ({ router, resolve }) => {
      const currentUser = store.state.currentUser;
      if (currentUser) {
        const redirectTo = currentUser.role === 'admin' ? '/admin/' : '/home/';
        router.navigate(redirectTo);
      } else {
        resolve({ component: LandingPage });
      }
    },
  },
  {
    path: '/login/',
    component: LoginPage,
  },
  {
    path: '/register/',
    component: RegisterPage,
  },
  {
    path: '/home/',
    async: requireAuth(HomePage),
  },
  {
    path: '/search-results/',
    async: requireAuth(SearchResultsPage),
  },
  {
    path: '/travel/:id/',
    async: requireAuth(TravelDetailPage),
  },
  {
    path: '/booking/:id/',
    async: requireAuth(BookingPage),
  },
  {
    path: '/payment/:ticketId/',
    async: requireAuth(PaymentPage),
  },
  {
    path: '/e-ticket/:ticketId/',
    async: requireAuth(ETicketPage),
  },
  {
    path: '/settings/',
    async: requireAuth(SettingsPage),
  },
  {
    path: '/admin/',
    async: requireAdmin(AdminDashboardPage),
  },
  {
    path: '/admin/armadas/',
    async: requireAdmin(AdminArmadaPage),
  },
  {
    path: '/admin/schedules/',
    async: requireAdmin(AdminSchedulePage),
  },
  {
    path: '/admin/schedules/:id/',
    async: requireAdmin(AdminScheduleDetailPage),
  },
  {
    path: '/admin/tickets/',
    async: requireAdmin(AdminTicketMonitoringPage),
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;