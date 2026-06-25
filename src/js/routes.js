// 1. Import Halaman Utama User
import LoginPage from "../pages/user/login.f7";
import RegisterPage from "../pages/user/register.f7";
import HomePage from "../pages/user/home.f7";
import ProfilePage from "../pages/user/profile.f7";

// 2. Import Halaman Fitur User
import SearchResultsPage from "../pages/user/search-results.f7";
import TravelDetailPage from "../pages/user/travel-detail.f7";
import BookingPage from "../pages/user/booking.f7";
import PaymentPage from "../pages/user/payment.f7";
import ETicketPage from "../pages/user/e-ticket.f7";
import MyTicketsPage from "../pages/user/my-tickets.f7";

// 3. Import Halaman Admin
import AdminDashboardPage from "../pages/admin/dashboard.f7";
import AdminLaporanPage from "../pages/admin/laporan.f7";
import AdminArmadaPage from "../pages/admin/armada-management.f7";
import AdminArmadaEditPage from "../pages/admin/armada-edit.f7";
import AdminSchedulePage from "../pages/admin/schedule-management.f7";
import AdminScheduleDetailPage from "../pages/admin/schedule-detail.f7";
import AdminTicketMonitoringPage from "../pages/admin/ticket-monitoring.f7";
import AdminPaymentPage from "../pages/admin/payment-management.f7";

// 4. Import Halaman CRUD Admin
import AdminAddSchedulePage from "../pages/admin/add-schedule.f7";
import AdminEditSchedulePage from "../pages/admin/edit-schedule.f7";

// 5. Import Halaman Global
import SettingsPage from "../pages/settings.f7";
import NotFoundPage from "../pages/404.f7";

const routes = [
  // --- AUTH ---
  { path: "/", component: LoginPage },
  { path: "/login/", component: LoginPage },
  { path: "/register/", component: RegisterPage },

  // --- USER ---
  { path: "/home/", component: HomePage },
  { path: "/profile/", component: ProfilePage },
  { path: "/search-results/", component: SearchResultsPage },
  { path: "/travel/:id/", component: TravelDetailPage },
  { path: "/booking/:id/", component: BookingPage },
  { path: "/payment/:ticketId/", component: PaymentPage },
  { path: "/e-ticket/:ticketId/", component: ETicketPage },
  {
  path: "/my-tickets/",
  component: MyTicketsPage,
},

  // --- ADMIN ---
  { path: "/admin/", component: AdminDashboardPage },
  { path: "/admin/armadas/", component: AdminArmadaPage },
  { path: "/admin/armada-edit/", component: AdminArmadaEditPage },
  
  // RUTE PEMBAYARAN - Pastikan path ini konsisten
  { path: "/admin/payments/", component: AdminPaymentPage },

  { path: "/admin/schedules/", component: AdminSchedulePage },
  { path: "/admin/schedules/add/", component: AdminAddSchedulePage },
  { path: "/admin/schedules/edit/:id/", component: AdminEditSchedulePage },
  { path: "/admin/schedules/:id/", component: AdminScheduleDetailPage },
  { path: "/admin/tickets/", component: AdminTicketMonitoringPage },
  { path: "/admin/laporan/", component: AdminLaporanPage },

  // --- SETTINGS & 404 ---
  { path: "/settings/", component: SettingsPage },
  { path: "(.*)", component: NotFoundPage },
];

export default routes;