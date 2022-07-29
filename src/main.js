import "./app.css";
import App from "./App.svelte";
import { registerSW } from "virtual:pwa-register";

if ("serviceWorker" in navigator) {
  // && !/localhost/.test(window.location)) {
  registerSW();
}

const app = new App({
  target: document.getElementById("app"),
});

export default app;
