// 1. Import Halaman Utama User
import LoginPage from "../pages/user/login.f7";
import RegisterPage from "../pages/user/register.f7";
import HomePage from "../pages/user/home.f7";

// 2. Import Halaman Fitur User
import SearchResultsPage from "../pages/user/search-results.f7";
import TravelDetailPage from "../pages/user/travel-detail.f7";
import BookingPage from "../pages/user/booking.f7";
import PaymentPage from "../pages/user/payment.f7";
import ETicketPage from "../pages/user/e-ticket.f7";

// 3. Import Halaman Admin
import AdminDashboardPage from "../pages/admin/dashboard.f7";
import AdminLaporan from "../pages/admin/laporan.f7";
import AdminArmadaPage from "../pages/admin/armada-management.f7";
import AdminSchedulePage from "../pages/admin/schedule-management.f7";
import AdminScheduleDetailPage from "../pages/admin/schedule-detail.f7";
import AdminTicketMonitoringPage from "../pages/admin/ticket-monitoring.f7";

// --- IMPORT HALAMAN CRUD BARU ---
import AdminAddSchedulePage from "../pages/admin/add-schedule.f7";
import AdminEditSchedulePage from "../pages/admin/edit-schedule.f7";
import ArmadaEditPage from "../pages/admin/edit.f7";

// 4. Import Halaman Global
import SettingsPage from "../pages/settings.f7";
import NotFoundPage from "../pages/404.f7";

var routes = [
  // --- AUTH & USER ROUTES ---
  {
    path: "/",
    component: LoginPage,
  },
  {
    path: "/login/",
    component: LoginPage,
  },
  {
    path: "/register/",
    component: RegisterPage,
  },
  {
    path: "/home/",
    component: HomePage,
  },
  {
    path: "/search-results/",
    component: SearchResultsPage,
  },
  {
    path: "/travel/:id/",
    component: TravelDetailPage,
  },
  {
    path: "/booking/:id/",
    component: BookingPage,
  },
  {
    path: "/payment/:ticketId/",
    component: PaymentPage,
  },
  {
    path: "/e-ticket/:ticketId/",
    component: ETicketPage,
  },

  // --- ADMIN ROUTES ---
  {
    path: "/admin/",
    component: AdminDashboardPage,
  },
  {
    path: "/admin/armadas/",
    component: AdminArmadaPage,
  },
  {
    path: "/admin/armada-edit/",
    component: ArmadaEditPage,
  },
  
  // --- SCHEDULES CRUD ROUTES ---
  {
    path: "/admin/schedules/",
    component: AdminSchedulePage,
  },
  {
    path: "/admin/schedules/add/",
    component: AdminAddSchedulePage,
  },
  {
    path: "/admin/schedules/edit/:id/",
    component: AdminEditSchedulePage,
  },
  {
    path: "/admin/schedules/:id/",
    component: AdminScheduleDetailPage,
  },

  {
    path: "/admin/tickets/",
    component: AdminTicketMonitoringPage,
  },
  {
    path: "/admin/laporan/",
    component: AdminLaporan,
  },

  // --- GLOBAL ROUTES ---
  {
    path: "/settings/",
    component: SettingsPage,
  },

  // Default 404 (Harus diletakkan paling bawah)
  {
    path: "(.*)",
    component: NotFoundPage,
  },
];

export default routes;