import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    publicDir: "/public/",
    base: "/frctl/",
    plugins: [svelte(), VitePWA({
        workbox: {
            globPatterns: ['**/*.{js,html,css,svg,ico}']
        }
    })],
});
