import $ from "dom7";
import Framework7 from "framework7/bundle";

// Import F7 Styles
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

// Inisialisasi App
var app = new Framework7({
  name: 'Travel-In',
  theme: 'auto',
  el: '#app', 
  component: App,
  store: store,
  routes: routes,
});

// Simpan ke window biar gampang di-debug di console
window.app = app;

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