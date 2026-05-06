<<<<<<< HEAD
// 1. Import Halaman Utama & Auth (Dari folder user)
=======
import LandingPage from '../pages/landing.f7';
import HomePage from '../pages/user/home.f7';
>>>>>>> d766c0889af0f8ce10bea172fe79279236405300
import LoginPage from '../pages/user/login.f7';
import RegisterPage from '../pages/user/register.f7';
import HomePage from '../pages/user/home.f7';

// 2. Import Halaman Fitur User
import SearchResultsPage from '../pages/user/search-results.f7';
import TravelDetailPage from '../pages/user/travel-detail.f7';
import BookingPage from '../pages/user/booking.f7';
import PaymentPage from '../pages/user/payment.f7';
import ETicketPage from '../pages/user/e-ticket.f7';

// 3. Import Halaman Admin
import AdminDashboardPage from '../pages/admin/dashboard.f7';
<<<<<<< HEAD

// 4. Import Halaman Global
import SettingsPage from '../pages/settings.f7';
import NotFoundPage from '../pages/404.f7';

var routes = [
  // --- HALAMAN AWAL (LOGIN) ---
  {
    path: '/',
=======
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
>>>>>>> d766c0889af0f8ce10bea172fe79279236405300
    component: LoginPage,
  },
  {
    path: '/register/',
    component: RegisterPage,
  },

  // --- HALAMAN APLIKASI USER ---
  {
    path: '/home/',
    component: HomePage,
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
<<<<<<< HEAD

  // --- HALAMAN ADMIN ---
=======
>>>>>>> d766c0889af0f8ce10bea172fe79279236405300
  {
    path: '/admin/',
    async: requireAdmin(AdminDashboardPage),
  },
  {
    path: '/admin/armadas/',
    async: requireAdmin(AdminArmadaPage),
  },
<<<<<<< HEAD

  // --- 404 NOT FOUND ---
=======
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
>>>>>>> d766c0889af0f8ce10bea172fe79279236405300
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;