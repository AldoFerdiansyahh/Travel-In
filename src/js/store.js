import { createStore } from 'framework7';
import { auth, db } from './firebase.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const store = createStore({
  state: {
    currentUser: null,
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
      }
    ],
  },
  getters: {
    currentUser: ({ state }) => state.currentUser,
  },
  actions: {
    // --- FUNGSI REGISTRASI (YANG TADI HILANG) ---
    async registerUser({ state }, { nama, email, whatsapp, password }) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Simpan data tambahan ke Firestore
        await setDoc(doc(db, "users", user.uid), {
          nama: nama,
          email: email,
          whatsapp: whatsapp,
          role: 'user', // Otomatis jadi user biasa dulu
          createdAt: new Date()
        });
        return true;
      } catch (error) {
        throw error;
      }
    },

    // --- FUNGSI LOGIN ---
    async loginUser({ state }, { email, password }) {
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
        return role; 
      } catch (error) {
        throw error;
      }
    },

    async logoutUser({ state }) {
      await signOut(auth);
      state.currentUser = null;
    },
  },
});

export default store;