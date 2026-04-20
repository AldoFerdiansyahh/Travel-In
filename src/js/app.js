import $ from "dom7";
import Framework7 from "framework7/bundle";

// Import F7 Styles
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
