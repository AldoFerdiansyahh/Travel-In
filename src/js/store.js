import { createStore } from 'framework7';
import { auth, db } from './firebase.js'; // Pastikan path-nya benar
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const store = createStore({
  state: {
    currentUser: null,
    // Data dummy untuk tampilan UI tetap saya biarkan
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
      },
      // ... data lainnya
    ],
    armadas: [],
    tickets: [],
  },
  getters: {
    currentUser: ({ state }) => state.currentUser,
    schedules: ({ state }) => state.schedules,
    armadas: ({ state }) => state.armadas,
    tickets: ({ state }) => state.tickets,
  },
  actions: {
    // 1. REGISTER USER KE FIREBASE
    async registerUser({ state }, { nama, email, whatsapp, password }) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // SIMPAN DATA TAMBAHAN KE FIRESTORE
        await setDoc(doc(db, "users", user.uid), {
          nama: nama,
          email: email,
          whatsapp: whatsapp,
          role: 'user', // Default role saat daftar
          createdAt: new Date()
        });
        return true;
      } catch (error) {
        // Lempar error agar bisa ditangkap oleh dialog.alert di UI
        throw error;
      }
    },

    // 2. LOGIN USER DENGAN CEK ROLE
    async loginUser({ state }, { email, password }) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // AMBIL DATA ROLE DARI FIRESTORE
        const userDoc = await getDoc(doc(db, "users", user.uid));
        let userData = { email: user.email, uid: user.uid, role: 'user' };

        if (userDoc.exists()) {
          userData = { ...userData, ...userDoc.data() };
        }

        state.currentUser = userData;
        return userData.role; // Kembalikan role (admin/user) untuk navigasi
      } catch (error) {
        throw error;
      }
    },

    // 3. LOGOUT
    async logoutUser({ state }) {
      await signOut(auth);
      state.currentUser = null;
    },

    // Action lainnya seperti addSchedule dsb bisa tetap di sini
    addSchedule({ state }, schedule) {
      state.schedules = [schedule, ...state.schedules];
    },
  },
});

export default store;