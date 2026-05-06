import { createStore } from 'framework7';
import { auth, db } from './firebase.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const persistedUser = localStorage.getItem('travelin-current-user');

const store = createStore({
  state: {
<<<<<<< HEAD
    currentUser: null,
=======
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
>>>>>>> d766c0889af0f8ce10bea172fe79279236405300
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
<<<<<<< HEAD
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
=======
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
>>>>>>> d766c0889af0f8ce10bea172fe79279236405300
    },

    async logoutUser({ state }) {
      await signOut(auth);
      state.currentUser = null;
      localStorage.removeItem('travelin-current-user');
    },
  },
});

<<<<<<< HEAD
export default store;
=======
export default store;
>>>>>>> d766c0889af0f8ce10bea172fe79279236405300
