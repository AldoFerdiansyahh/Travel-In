import { createStore } from 'framework7';

const persistedUser = localStorage.getItem('travelin-current-user');

const store = createStore({
  state: {
    currentUser: persistedUser ? JSON.parse(persistedUser) : null,
    users: [
      {
        id: 'u1',
        name: 'Admin Travel',
        email: 'admin@travel-in.com',
        password: 'admin123',
        role: 'admin',
      },
      {
        id: 'u2',
        name: 'Anton Wisata',
        email: 'user@travel-in.com',
        password: 'user123',
        role: 'user',
      },
    ],
    schedules: [
      {
        id: '1',
        origin: 'Jakarta',
        destination: 'Bandung',
        date: '2026-05-12',
        time: '08:00',
        price: 185000,
        vehicle: 'Bus',
        capacity: 45,
        filledSeats: 12,
        seatsLeft: 33,
        status: 'Available',
        plate: 'B 1234 XYZ',
        description: 'Bus eksekutif dengan AC dingin, reclining seat, dan fasilitas bagasi luas.',
        passengers: [
          { name: 'Andi', ticketId: 'T-2101', seat: '03A', paymentStatus: 'Paid', verified: true },
          { name: 'Dewi', ticketId: 'T-2102', seat: '05B', paymentStatus: 'Paid', verified: true },
        ],
      },
      {
        id: '2',
        origin: 'Bandung',
        destination: 'Yogyakarta',
        date: '2026-05-14',
        time: '16:30',
        price: 435000,
        vehicle: 'Minibus',
        capacity: 18,
        filledSeats: 9,
        seatsLeft: 9,
        status: 'Boarding',
        plate: 'D 5678 EFG',
        description: 'Minibus nyaman untuk perjalanan ringkas dengan kapasitas kecil dan layanan premium.',
        passengers: [
          { name: 'Rina', ticketId: 'T-3405', seat: '01A', paymentStatus: 'Paid', verified: true },
          { name: 'Budi', ticketId: 'T-3406', seat: '02B', paymentStatus: 'Pending', verified: false },
        ],
      },
    ],
    armadas: [
      {
        id: 'a1',
        name: 'Bus Eksekutif',
        plate: 'B 1234 XYZ',
        type: 'Bus',
        capacity: 45,
        status: 'Available',
      },
      {
        id: 'a2',
        name: 'Minibus Premium',
        plate: 'D 5678 EFG',
        type: 'Minibus',
        capacity: 18,
        status: 'In Service',
      },
    ],
    tickets: [
      {
        id: 'ETK-2101',
        passenger: 'Joko Santoso',
        route: 'Jakarta → Bandung',
        scheduleId: '1',
        seats: 1,
        price: 185000,
        paymentStatus: 'Paid',
        verified: true,
      },
      {
        id: 'ETK-2102',
        passenger: 'Maya Putri',
        route: 'Bandung → Yogyakarta',
        scheduleId: '2',
        seats: 1,
        price: 435000,
        paymentStatus: 'Pending',
        verified: false,
      },
    ],
  },
  getters: {
    users({ state }) {
      return state.users;
    },
    currentUser({ state }) {
      return state.currentUser;
    },
    schedules({ state }) {
      return state.schedules;
    },
    armadas({ state }) {
      return state.armadas;
    },
    tickets({ state }) {
      return state.tickets;
    },
  },
  actions: {
    registerUser({ state }, user) {
      const exists = state.users.find((item) => item.email.toLowerCase() === user.email.toLowerCase());
      if (exists) return false;
      const newUser = {
        id: String(Date.now()),
        name: user.name,
        email: user.email,
        password: user.password,
        role: 'user',
      };
      state.users = [...state.users, newUser];
      return true;
    },
    loginUser({ state }, user) {
      if (!user || !user.uid) return null;
      state.currentUser = user;
      localStorage.setItem('travelin-current-user', JSON.stringify(user));
      return user;
    },
    logoutUser({ state }) {
      state.currentUser = null;
      localStorage.removeItem('travelin-current-user');
    },
    addSchedule({ state }, schedule) {
      state.schedules = [schedule, ...state.schedules];
    },
    updateSchedule({ state }, schedule) {
      state.schedules = state.schedules.map((item) => (item.id === schedule.id ? schedule : item));
    },
    deleteSchedule({ state }, id) {
      state.schedules = state.schedules.filter((item) => item.id !== id);
    },
    updateScheduleSeats({ state }, payload) {
      state.schedules = state.schedules.map((item) => {
        if (item.id !== payload.id) return item;
        return {
          ...item,
          filledSeats: item.filledSeats + payload.seats,
          seatsLeft: Math.max(item.seatsLeft - payload.seats, 0),
        };
      });
    },
    addArmada({ state }, armada) {
      state.armadas = [armada, ...state.armadas];
    },
    updateArmada({ state }, armada) {
      state.armadas = state.armadas.map((item) => (item.id === armada.id ? armada : item));
    },
    deleteArmada({ state }, id) {
      state.armadas = state.armadas.filter((item) => item.id !== id);
    },
    addTicket({ state }, ticket) {
      state.tickets = [ticket, ...state.tickets];
    },
    payTicket({ state }, payload) {
      state.tickets = state.tickets.map((item) => {
        if (item.id !== payload.id) return item;
        return {
          ...item,
          paymentStatus: 'Paid',
          verified: true,
          paymentMethod: payload.method,
        };
      });
    },
  },
});

export default store;
