import $ from "dom7";
import Framework7 from "framework7/bundle";

// Import F7 Styles
<<<<<<< HEAD
import 'framework7/css/bundle';
import '../css/icons.css';
import '../css/app.css';

// Import Routes, Store, & App Component
import routes from './routes.js';
import store from './store.js';
import App from '../app.f7';

// Import Firebase
import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

var app = new Framework7({
  name: 'Travel-In',
  theme: 'auto',
  el: '#app', // Pastikan ini ada dan sama dengan ID di app.f7
  component: App,
  store: store,
  routes: routes,
});

// --- LOGIKA AUTHENTICATION ---

// Handle Login
$(document).on('page:init', '.page[data-name="login"]', function (e) {
  $('#login-form').on('submit', async function (e) {
    e.preventDefault();
    const formData = app.form.convertToData('#login-form');
    
    app.preloader.show();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      app.preloader.hide();
      app.toast.create({ text: 'Selamat Datang!', closeTimeout: 2000, position: 'center' }).open();
      app.views.main.router.navigate('/home/'); 
    } catch (error) {
      app.preloader.hide();
      app.dialog.alert('Email atau Password salah!', 'Login Gagal');
    }
  });
});

// Handle Registrasi
$(document).on('page:init', '.page[data-name="registrasi"]', function (e) {
  $('#registrasi-form').on('submit', async function (e) {
    e.preventDefault();
    const formData = app.form.convertToData('#registrasi-form');

    if (formData.password !== formData.password_confirm) {
      app.dialog.alert('Password tidak cocok!', 'Error');
      return;
    }

    app.preloader.show();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        nama_lengkap: formData.nama,
        whatsapp: formData.whatsapp,
        createdAt: new Date()
      });

      app.preloader.hide();
      app.dialog.alert('Akun berhasil dibuat!', 'Sukses', () => {
        app.views.main.router.back();
      });
    } catch (error) {
      app.preloader.hide();
      app.dialog.alert(error.message, 'Registrasi Gagal');
    }
  });
});
=======
import "framework7/css/bundle";

// Import Icons and App Custom Styles
import "../css/icons.css";
import "../css/app.css";

// Import Routes
import routes from "./routes.js";
// Import Store
import store from "./store.js";

console.log("App.js loading...");

try {
  var app = new Framework7({
    name: "Travel-In", // App name
    theme: "auto", // Automatic theme detection
    el: "#app", // App root element
    // App store
    store: store,
    // App routes
    routes: routes,
  });
  console.log("Framework7 initialized successfully", app);
  window.app = app;
} catch (error) {
  console.error("Error initializing Framework7:", error);
  console.error(error.stack);
}
>>>>>>> 611c4b53ff6c5cc22817587f125a78a8a47e9ad3
