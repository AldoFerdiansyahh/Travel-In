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
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/form/',
    component: FormPage,
  },
  {
    path: '/catalog/',
    component: CatalogPage,
  },
  {
    path: '/product/:id/',
    component: ProductPage,
  },
  {
    path: '/settings/',
    component: SettingsPage,
  },

  // --- ROUTE BAWAAN (DYNAMIC & REQUEST) ---
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
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
  },

  // --- 404 NOT FOUND ---
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;