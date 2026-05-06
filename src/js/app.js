import Framework7 from "framework7/bundle";
<<<<<<< HEAD
import 'framework7/css/bundle';
import '../css/icons.css';
import '../css/app.css';
import routes from './routes.js';
import store from './store.js';
import App from '../app.f7';

var app = new Framework7({
  name: 'Travel-In',
  theme: 'auto',
  el: '#app', 
  component: App,
  store: store,
  routes: routes,
});

window.app = app;
=======
import "framework7/css/bundle";
import "../css/icons.css";
import "../css/app.css";

import routes from "./routes.js";
import store from "./store.js";
import App from "../app.f7";

const app = new Framework7({
  name: "Travel-In",
  theme: "auto",
  el: "#app",
  component: App,
  store,
  routes,
});

if (store.state.currentUser) {
  const redirectPath = store.state.currentUser.role === "admin" ? "/admin/" : "/home/";
  app.router.navigate(redirectPath);
}

window.app = app;
console.log("Framework7 initialized:", app);
>>>>>>> d766c0889af0f8ce10bea172fe79279236405300
