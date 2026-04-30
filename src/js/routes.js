// 1. Import Halaman Utama & Auth (Dari folder user)
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

// 4. Import Halaman Global
import SettingsPage from '../pages/settings.f7';
import NotFoundPage from '../pages/404.f7';

var routes = [
  // --- HALAMAN AWAL (LOGIN) ---
  {
    path: '/',
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
    path: '/search-results/',
    component: SearchResultsPage,
  },
  {
    path: '/travel/:id/',
    component: TravelDetailPage,
  },
  {
    path: '/booking/:id/',
    component: BookingPage,
  },
  {
    path: '/payment/:ticketId/',
    component: PaymentPage,
  },
  {
    path: '/e-ticket/:ticketId/',
    component: ETicketPage,
  },
  {
    path: '/settings/',
    component: SettingsPage,
  },

  // --- HALAMAN ADMIN ---
  {
    path: '/admin/',
    component: AdminDashboardPage,
  },

  // --- 404 NOT FOUND ---
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;