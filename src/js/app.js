import Framework7 from "framework7/bundle";
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

