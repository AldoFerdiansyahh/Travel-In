import { createStore } from 'framework7';
import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  query,
  orderBy 
} from "firebase/firestore";

const persistedUser = localStorage.getItem('travelin-current-user');

const store = createStore({
  state: {
    currentUser: persistedUser ? JSON.parse(persistedUser) : null,
    users: [],
    schedules: [], // Akan diisi dari Firebase
    tickets: [],
    armadas: [],
  },
  getters: {
    currentUser: ({ state }) => state.currentUser,
    users: ({ state }) => state.users,
    schedules: ({ state }) => state.schedules,
    tickets: ({ state }) => state.tickets,
    armadas: ({ state }) => state.armadas,
  },
  actions: {
    // --- AUTH ACTIONS ---
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
        state.currentUser = payload;
        localStorage.setItem('travelin-current-user', JSON.stringify(payload));
        return payload.role || 'user';
      }

      const { email, password } = payload || {};
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        let userData = { email: user.email, uid: user.uid, role: 'user' };
        if (userDoc.exists()) {
          userData = { ...userData, ...userDoc.data() };
        }

        state.currentUser = userData;
        localStorage.setItem('travelin-current-user', JSON.stringify(userData));
        return userData.role;
      } catch (error) {
        throw error;
      }
    },

    async logoutUser({ state }) {
      await signOut(auth);
      state.currentUser = null;
      localStorage.removeItem('travelin-current-user');
    },

    // --- SCHEDULES CRUD (FIREBASE) ---
    
    // 1. Ambil Semua Jadwal dari Firebase
    async fetchSchedules({ state }) {
      try {
        const q = query(collection(db, "schedules"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        state.schedules = data;
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    },

    // 2. Tambah Jadwal ke Firebase
    async addSchedule({ dispatch }, scheduleData) {
      try {
        await addDoc(collection(db, "schedules"), {
          ...scheduleData,
          createdAt: new Date(),
          filledSeats: 0,
          passengers: []
        });
        await dispatch('fetchSchedules'); // Refresh data lokal otomatis
      } catch (error) {
        throw error;
      }
    },

    // 3. Update Jadwal di Firebase
    async updateSchedule({ dispatch }, { id, ...updatedData }) {
      try {
        const scheduleRef = doc(db, "schedules", id);
        await updateDoc(scheduleRef, updatedData);
        await dispatch('fetchSchedules');
      } catch (error) {
        throw error;
      }
    },

    // 4. Hapus Jadwal dari Firebase
    async deleteSchedule({ dispatch }, id) {
      try {
        await deleteDoc(doc(db, "schedules", id));
        await dispatch('fetchSchedules');
      } catch (error) {
        throw error;
      }
    },

    async fetchArmadas({ state }) {
      try {
        const q = query(collection(db, "armadas"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        state.armadas = data;
      } catch (error) {
        console.error("Error fetching armadas:", error);
      }
    },

    async addArmada({ dispatch }, armada) {
      try {
        await addDoc(collection(db, "armadas"), {
          ...armada,
          createdAt: new Date(),
          status: armada.status || 'Available',
        });
        await dispatch('fetchArmadas');
      } catch (error) {
        throw error;
      }
    },

    async updateArmada({ dispatch }, updatedArmada) {
      try {
        const armadaRef = doc(db, "armadas", updatedArmada.id);
        const { id, ...updatedData } = updatedArmada;
        await updateDoc(armadaRef, updatedData);
        await dispatch('fetchArmadas');
      } catch (error) {
        throw error;
      }
    },

    async deleteArmada({ dispatch }, id) {
      try {
        await deleteDoc(doc(db, "armadas", id));
        await dispatch('fetchArmadas');
      } catch (error) {
        throw error;
      }
    },

    async fetchTickets({ state }) {
      try {
        const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        state.tickets = data;
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    },

    async addTicket({ state, dispatch }, ticket) {
      try {
        const ticketId = ticket.id || `ETK-${Date.now()}`;
        const ticketData = {
          ...ticket,
          id: ticketId,
          createdAt: new Date(),
        };
        await setDoc(doc(db, "tickets", ticketId), ticketData);
        state.tickets = [...state.tickets, ticketData];
        return ticketData;
      } catch (error) {
        throw error;
      }
    },

    async payTicket({ dispatch }, { id, method }) {
      try {
        const ticketRef = doc(db, "tickets", id);
        await updateDoc(ticketRef, {
          paymentStatus: 'Paid',
          verified: true,
          paymentMethod: method,
          paidAt: new Date(),
        });
        await dispatch('fetchTickets');
      } catch (error) {
        throw error;
      }
    },
  },
});

export default store;