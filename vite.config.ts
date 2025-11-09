import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/UltimateCalculator/" : "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "UltimateCalc",
        short_name: "UltimateCalc",
        description: "The ultimate online calculator and converter hub.",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/(api\.exchangerate\.host|openexchangerates\.org|v6\.exchangerate-api\.com)\/.*$/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "currency-api",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60
              },
              networkTimeoutSeconds: 3
            }
          },
          {
            urlPattern: /^https:\/\/worldtimeapi\.org\/api\/timezone\/.*$/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "timezone-api",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60
              },
              networkTimeoutSeconds: 3
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    open: true
  },
  preview: {
    port: 4173
  }
}));

