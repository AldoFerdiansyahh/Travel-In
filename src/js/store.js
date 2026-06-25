import { createStore } from 'framework7';
import { auth, db } from './firebase.js';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

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
  orderBy,
  serverTimestamp
} from "firebase/firestore";

const persistedUser = localStorage.getItem('travelin-current-user');

/*
|--------------------------------------------------------------------------
| KATEGORI ARMADA
|--------------------------------------------------------------------------
| mobil_kecil = mobil kecil kapasitas sampai 7 orang
| hiace_elf   = kendaraan besar 18 sampai 21 seat
|--------------------------------------------------------------------------
*/

const ARMADA_CATEGORIES = {
  mobil_kecil: {
    category: 'mobil_kecil',
    categoryLabel: 'Mobil Kecil',
    seatMin: 1,
    seatMax: 7,
    defaultCapacity: 7,
  },
  hiace_elf: {
    category: 'hiace_elf',
    categoryLabel: 'Hiace / Elf',
    seatMin: 18,
    seatMax: 21,
    defaultCapacity: 21,
  },
};

const normalizeArmadaData = (armada = {}) => {
  const selectedCategory =
    ARMADA_CATEGORIES[armada.category] || ARMADA_CATEGORIES.mobil_kecil;

  let capacity = Number(armada.capacity || selectedCategory.defaultCapacity);

  if (!capacity || capacity < selectedCategory.seatMin || capacity > selectedCategory.seatMax) {
    capacity = selectedCategory.defaultCapacity;
  }

  return {
    ...armada,
    category: selectedCategory.category,
    categoryLabel: selectedCategory.categoryLabel,
    seatMin: selectedCategory.seatMin,
    seatMax: selectedCategory.seatMax,
    capacity: capacity,
    status: armada.status || 'Available',
  };
};

const store = createStore({
  state: {
    currentUser: persistedUser ? JSON.parse(persistedUser) : null,

    users: [],
    schedules: [],
    tickets: [],
    armadas: [],
    payments: [],
    reports: [],
  },

  getters: {
    currentUser: ({ state }) => state.currentUser,

    users: ({ state }) => state.users,
    schedules: ({ state }) => state.schedules,
    tickets: ({ state }) => state.tickets,
    armadas: ({ state }) => state.armadas,
    payments: ({ state }) => state.payments,
    reports: ({ state }) => state.reports,
  },

  actions: {
    /*
    |--------------------------------------------------------------------------
    | AUTH ACTIONS
    |--------------------------------------------------------------------------
    */

    async fetchMyTickets({ state }, userId) {
      try {
        if (!userId) return [];
        // Mengambil tiket berdasarkan userId
        const q = query(
          collection(db, "tickets"), 
          where("userId", "==", userId), // Filter khusus user ini
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((document) => {
          data.push({ id: document.id, ...document.data() });
        });
        state.tickets = data;
        return data;
      } catch (error) {
        console.error("Error fetching my tickets:", error);
        throw error;
      }
    },

    async registerUser({ state }, { nama, email, whatsapp, password }) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          nama: nama,
          email: email,
          whatsapp: whatsapp,
          role: 'user',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        return true;
      } catch (error) {
        console.error("Error register user:", error);
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

        let userData = {
          email: user.email,
          uid: user.uid,
          role: 'user',
        };

        if (userDoc.exists()) {
          userData = {
            ...userData,
            ...userDoc.data(),
          };
        }

        state.currentUser = userData;
        localStorage.setItem('travelin-current-user', JSON.stringify(userData));

        return userData.role;
      } catch (error) {
        console.error("Error login user:", error);
        throw error;
      }
    },

    async logoutUser({ state }) {
      try {
        await signOut(auth);
        state.currentUser = null;
        localStorage.removeItem('travelin-current-user');
      } catch (error) {
        console.error("Error logout user:", error);
        throw error;
      }
    },

    /*
    |--------------------------------------------------------------------------
    | USERS CRUD
    |--------------------------------------------------------------------------
    */

    async fetchUsers({ state }) {
      try {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const data = [];
        querySnapshot.forEach((document) => {
          data.push({
            id: document.id,
            ...document.data(),
          });
        });

        state.users = data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },

    /*
    |--------------------------------------------------------------------------
    | SCHEDULES CRUD
    |--------------------------------------------------------------------------
    */

    async fetchSchedules({ state }) {
      try {
        const q = query(collection(db, "schedules"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const data = [];
        querySnapshot.forEach((document) => {
          data.push({
            id: document.id,
            ...document.data(),
          });
        });

        state.schedules = data;
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    },

    async addSchedule({ dispatch }, scheduleData) {
      try {
        await addDoc(collection(db, "schedules"), {
          ...scheduleData,
          filledSeats: Number(scheduleData.filledSeats || 0),
          passengers: scheduleData.passengers || [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        await dispatch('fetchSchedules');
      } catch (error) {
        console.error("Error add schedule:", error);
        throw error;
      }
    },

    async updateSchedule({ dispatch }, { id, ...updatedData }) {
      try {
        const scheduleRef = doc(db, "schedules", id);

        await updateDoc(scheduleRef, {
          ...updatedData,
          updatedAt: serverTimestamp(),
        });

        await dispatch('fetchSchedules');
      } catch (error) {
        console.error("Error update schedule:", error);
        throw error;
      }
    },

    async deleteSchedule({ dispatch }, id) {
      try {
        await deleteDoc(doc(db, "schedules", id));
        await dispatch('fetchSchedules');
      } catch (error) {
        console.error("Error delete schedule:", error);
        throw error;
      }
    },

    /*
    |--------------------------------------------------------------------------
    | ARMADAS CRUD
    |--------------------------------------------------------------------------
    */

    async fetchArmadas({ state }) {
      try {
        const q = query(collection(db, "armadas"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const data = [];
        querySnapshot.forEach((document) => {
          data.push({
            id: document.id,
            ...document.data(),
          });
        });

        state.armadas = data;
      } catch (error) {
        console.error("Error fetching armadas:", error);
      }
    },

    async addArmada({ dispatch }, armada) {
      try {
        const normalizedArmada = normalizeArmadaData(armada);

        await addDoc(collection(db, "armadas"), {
          ...normalizedArmada,
          armadaCode: normalizedArmada.armadaCode || `ARM-${Date.now()}`,
          name: normalizedArmada.name || '',
          plate: normalizedArmada.plate || '',
          year: normalizedArmada.year || '',
          facilities: normalizedArmada.facilities || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        await dispatch('fetchArmadas');
      } catch (error) {
        console.error("Error add armada:", error);
        throw error;
      }
    },

    async updateArmada({ dispatch }, updatedArmada) {
      try {
        const armadaRef = doc(db, "armadas", updatedArmada.id);
        const { id, createdAt, ...updatedData } = updatedArmada;

        const normalizedArmada = normalizeArmadaData(updatedData);

        await updateDoc(armadaRef, {
          ...normalizedArmada,
          updatedAt: serverTimestamp(),
        });

        await dispatch('fetchArmadas');
      } catch (error) {
        console.error("Error update armada:", error);
        throw error;
      }
    },

    async deleteArmada({ dispatch }, id) {
      try {
        await deleteDoc(doc(db, "armadas", id));
        await dispatch('fetchArmadas');
      } catch (error) {
        console.error("Error delete armada:", error);
        throw error;
      }
    },

    /*
    |--------------------------------------------------------------------------
    | TICKETS CRUD
    |--------------------------------------------------------------------------
    */

    async fetchTickets({ state }) {
      try {
        const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const data = [];
        querySnapshot.forEach((document) => {
          data.push({
            id: document.id,
            ...document.data(),
          });
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
          paymentStatus: ticket.paymentStatus || 'Pending',
          verified: ticket.verified || false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(doc(db, "tickets", ticketId), ticketData);

        await dispatch('fetchTickets');

        return ticketData;
      } catch (error) {
        console.error("Error add ticket:", error);
        throw error;
      }
    },

    async payTicket({ dispatch }, { id, method }) {
      try {
        const ticketRef = doc(db, "tickets", id);
        const ticketSnapshot = await getDoc(ticketRef);

        const ticketData = ticketSnapshot.exists() ? ticketSnapshot.data() : {};

        await updateDoc(ticketRef, {
          paymentStatus: 'Paid',
          verified: true,
          paymentMethod: method,
          paidAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        await setDoc(
          doc(db, "payments", id),
          {
            paymentCode: `PAY-${id}`,
            ticketId: id,
            scheduleId: ticketData.scheduleId || '',
            userId: ticketData.userId || '',
            customerName:
              ticketData.customerName ||
              ticketData.passengerName ||
              ticketData.nama ||
              ticketData.name ||
              '',

            amount: Number(
              ticketData.amount ||
              ticketData.totalPrice ||
              ticketData.total ||
              ticketData.price ||
              0
            ),

            paymentMethod: method || 'Transfer Bank',
            paymentStatus: 'Paid',
            proofImageUrl: ticketData.proofImageUrl || '',
            paidAt: serverTimestamp(),
            createdAt: ticketData.createdAt || serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        await dispatch('fetchTickets');
        await dispatch('fetchPayments');
      } catch (error) {
        console.error("Error pay ticket:", error);
        throw error;
      }
    },

    /*
    |--------------------------------------------------------------------------
    | PAYMENTS CRUD
    |--------------------------------------------------------------------------
    */

    async fetchPayments({ state }) {
      try {
        const q = query(collection(db, "payments"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const data = [];
        querySnapshot.forEach((document) => {
          data.push({
            id: document.id,
            ...document.data(),
          });
        });

        state.payments = data;
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    },

    async addPayment({ dispatch }, paymentData) {
      try {
        await addDoc(collection(db, "payments"), {
          paymentCode: paymentData.paymentCode || `PAY-${Date.now()}`,
          ticketId: paymentData.ticketId || '',
          scheduleId: paymentData.scheduleId || '',
          userId: paymentData.userId || '',
          customerName: paymentData.customerName || '',
          amount: Number(paymentData.amount || 0),
          paymentMethod: paymentData.paymentMethod || '',
          paymentStatus: paymentData.paymentStatus || 'Pending',
          proofImageUrl: paymentData.proofImageUrl || '',
          paidAt: paymentData.paymentStatus === 'Paid' ? serverTimestamp() : null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        await dispatch('fetchPayments');
      } catch (error) {
        console.error("Error add payment:", error);
        throw error;
      }
    },

    async updatePayment({ dispatch }, updatedPayment) {
      try {
        const paymentRef = doc(db, "payments", updatedPayment.id);
        const { id, createdAt, ...updatedData } = updatedPayment;

        const dataToUpdate = {
          ...updatedData,
          amount: Number(updatedData.amount || 0),
          updatedAt: serverTimestamp(),
        };

        if (updatedData.paymentStatus === 'Paid') {
          dataToUpdate.paidAt = updatedData.paidAt || serverTimestamp();
        }

        if (updatedData.paymentStatus !== 'Paid') {
          dataToUpdate.paidAt = null;
        }

        await updateDoc(paymentRef, dataToUpdate);

        await dispatch('fetchPayments');
      } catch (error) {
        console.error("Error update payment:", error);
        throw error;
      }
    },

    async deletePayment({ dispatch }, id) {
      try {
        await deleteDoc(doc(db, "payments", id));
        await dispatch('fetchPayments');
      } catch (error) {
        console.error("Error delete payment:", error);
        throw error;
      }
    },

    /*
    |--------------------------------------------------------------------------
    | REPORTS CRUD
    |--------------------------------------------------------------------------
    */

    async fetchReports({ state }) {
      try {
        const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const data = [];
        querySnapshot.forEach((document) => {
          data.push({
            id: document.id,
            ...document.data(),
          });
        });

        state.reports = data;
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    },

    async addReport({ dispatch }, reportData) {
      try {
        await addDoc(collection(db, "reports"), {
          reportCode: reportData.reportCode || `RPT-${Date.now()}`,
          reportType: reportData.reportType || 'monthly',
          period: reportData.period || '',
          totalArmada: Number(reportData.totalArmada || 0),
          totalSchedules: Number(reportData.totalSchedules || 0),
          totalTickets: Number(reportData.totalTickets || 0),
          totalPayments: Number(reportData.totalPayments || 0),
          totalRevenue: Number(reportData.totalRevenue || 0),
          note: reportData.note || '',
          createdBy: reportData.createdBy || 'Admin',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        await dispatch('fetchReports');
      } catch (error) {
        console.error("Error add report:", error);
        throw error;
      }
    },

    async generateReport({ state, dispatch }, reportData = {}) {
      try {
        await dispatch('fetchArmadas');
        await dispatch('fetchSchedules');
        await dispatch('fetchTickets');
        await dispatch('fetchPayments');

        const totalArmada = state.armadas.length;
        const totalSchedules = state.schedules.length;
        const totalTickets = state.tickets.length;
        const totalPayments = state.payments.length;

        const paidPayments = state.payments.filter((payment) => {
          return payment.paymentStatus === 'Paid';
        });

        const pendingPayments = state.payments.filter((payment) => {
          return payment.paymentStatus === 'Pending';
        });

        const rejectedPayments = state.payments.filter((payment) => {
          return payment.paymentStatus === 'Rejected';
        });

        const totalRevenue = paidPayments.reduce((total, payment) => {
          return total + Number(payment.amount || 0);
        }, 0);

        await addDoc(collection(db, "reports"), {
          reportCode: `RPT-${Date.now()}`,
          reportType: reportData.reportType || 'summary',
          period: reportData.period || '',
          totalArmada: totalArmada,
          totalSchedules: totalSchedules,
          totalTickets: totalTickets,
          totalPayments: totalPayments,
          totalPaidPayments: paidPayments.length,
          totalPendingPayments: pendingPayments.length,
          totalRejectedPayments: rejectedPayments.length,
          totalRevenue: totalRevenue,
          note: reportData.note || 'Laporan otomatis dari sistem Travel-In',
          createdBy:
            state.currentUser?.nama ||
            state.currentUser?.email ||
            'Admin',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        await dispatch('fetchReports');
      } catch (error) {
        console.error("Error generate report:", error);
        throw error;
      }
    },

    async deleteReport({ dispatch }, id) {
      try {
        await deleteDoc(doc(db, "reports", id));
        await dispatch('fetchReports');
      } catch (error) {
        console.error("Error delete report:", error);
        throw error;
      }
    },
  },
});

export default store;