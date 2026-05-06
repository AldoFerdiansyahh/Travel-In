import { createStore } from 'framework7';
import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

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
        passengers: [],
      }
    ],
    tickets: [],
    armadas: [
      {
        id: 'a1',
        name: 'Armada Travel-In 1',
        plate: 'B 2345 YZX',
        capacity: 45,
        year: 2024,
        facilities: 'AC, Reclining Seat, Audio',
        status: 'Available',
      },
    ],
  },
  getters: {
    currentUser: ({ state }) => state.currentUser,
    users: ({ state }) => state.users,
    schedules: ({ state }) => state.schedules,
    tickets: ({ state }) => state.tickets,
    armadas: ({ state }) => state.armadas,
  },
  actions: {
    async registerUser({ state }, { nama, email, whatsapp, password }) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          nama: nama,
          email: email,
          whatsapp: whatsapp,
          role: 'user',
          createdAt: new Date(),
        });
        return true;
      } catch (error) {
        throw error;
      }
    },

    async loginUser({ state }, payload) {
      if (payload && payload.uid && payload.email) {
        const role = payload.role || 'user';
        state.currentUser = payload;
        localStorage.setItem('travelin-current-user', JSON.stringify(payload));
        return role;
      }

      const { email, password } = payload || {};
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        let role = 'user';
        let userData = { email: user.email, uid: user.uid };

        if (userDoc.exists()) {
          const data = userDoc.data();
          role = data.role;
          userData = { ...userData, ...data };
        }

        state.currentUser = userData;
        localStorage.setItem('travelin-current-user', JSON.stringify(userData));
        return role;
      } catch (error) {
        throw error;
      }
    },

    async logoutUser({ state }) {
      await signOut(auth);
      state.currentUser = null;
      localStorage.removeItem('travelin-current-user');
    },

    addTicket({ state }, ticket) {
      state.tickets = [...state.tickets, ticket];
      return ticket;
    },

    updateScheduleSeats({ state }, { id, seats }) {
      state.schedules = state.schedules.map((schedule) => {
        if (schedule.id !== id) return schedule;
        return {
          ...schedule,
          filledSeats: (schedule.filledSeats || 0) + seats,
          seatsLeft: Math.max((schedule.seatsLeft || schedule.capacity || 0) - seats, 0),
        };
      });
    },

    payTicket({ state }, { id, method }) {
      state.tickets = state.tickets.map((ticket) => {
        if (ticket.id !== id) return ticket;
        return {
          ...ticket,
          paymentStatus: 'Paid',
          paymentMethod: method,
        };
      });
    },

    addSchedule({ state }, schedule) {
      state.schedules = [...state.schedules, schedule];
    },

    updateSchedule({ state }, updatedSchedule) {
      state.schedules = state.schedules.map((schedule) => (schedule.id === updatedSchedule.id ? updatedSchedule : schedule));
    },

    deleteSchedule({ state }, id) {
      state.schedules = state.schedules.filter((schedule) => schedule.id !== id);
    },

    addArmada({ state }, armada) {
      state.armadas = [...state.armadas, armada];
    },

    updateArmada({ state }, updatedArmada) {
      state.armadas = state.armadas.map((armada) => (armada.id === updatedArmada.id ? updatedArmada : armada));
    },
  },
});

export default store;

