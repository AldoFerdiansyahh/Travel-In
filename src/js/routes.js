<<<<<<< HEAD
// 1. Import Halaman Baru (Login & Registrasi)
import LoginPage from '../pages/login.f7';
import RegistrasiPage from '../pages/registrasi.f7';

// 2. Import Halaman yang sudah ada
import HomePage from '../pages/home.f7';
import AboutPage from '../pages/about.f7';
import FormPage from '../pages/form.f7';
import CatalogPage from '../pages/catalog.f7';
import ProductPage from '../pages/product.f7';
import SettingsPage from '../pages/settings.f7';
import DynamicRoutePage from '../pages/dynamic-route.f7';
import RequestAndLoad from '../pages/request-and-load.f7';
=======
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
import AdminSchedulePage from '../pages/admin/schedule-management.f7';
import AdminScheduleDetailPage from '../pages/admin/schedule-detail.f7';
import AdminTicketMonitoringPage from '../pages/admin/ticket-monitoring.f7';
>>>>>>> 611c4b53ff6c5cc22817587f125a78a8a47e9ad3
import NotFoundPage from '../pages/404.f7';

var routes = [
  // --- HALAMAN AUTH (UTAMA) ---
  {
    path: '/',
    component: LoginPage, // Sekarang halaman pertama adalah Login
  },
  {
    path: '/registrasi/',
    component: RegistrasiPage, // Halaman Daftar Akun
  },

  // --- HALAMAN APLIKASI ---
  {
    path: '/home/', // Home dipindah ke path ini
    component: HomePage,
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
<<<<<<< HEAD

  // --- ROUTE BAWAAN (DYNAMIC & REQUEST) ---
=======
>>>>>>> 611c4b53ff6c5cc22817587f125a78a8a47e9ad3
  {
    path: '/admin/',
    component: AdminDashboardPage,
  },
  {
<<<<<<< HEAD
    path: '/request-and-load/user/:userId/',
    async: function ({ router, to, resolve }) {
      var app = router.app;
      app.preloader.show();
      var userId = to.params.userId;

      setTimeout(function () {
        var user = {
          firstName: 'Vladimir',
          lastName: 'Kharlampidi',
          about: 'Hello, i am creator of Framework7! Hope you like it!',
          links: [
            { title: 'Framework7 Website', url: 'http://framework7.io' },
            { title: 'Framework7 Forum', url: 'http://forum.framework7.io' },
          ]
        };
        app.preloader.hide();
        resolve(
          { component: RequestAndLoad },
          { props: { user: user } }
        );
      }, 1000);
    },
=======
    path: '/admin/schedules/',
    component: AdminSchedulePage,
  },
  {
    path: '/admin/schedules/:id/',
    component: AdminScheduleDetailPage,
  },
  {
    path: '/admin/tickets/',
    component: AdminTicketMonitoringPage,
>>>>>>> 611c4b53ff6c5cc22817587f125a78a8a47e9ad3
  },

  // --- 404 NOT FOUND ---
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;