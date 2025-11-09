# UltimateCalc

UltimateCalc is a modern, responsive React experience that brings together calculators and converters for math, finance, science, health, and everyday tasks. The project is built with Vite, TypeScript, TailwindCSS, Chart.js, and React Query, and is ready for deployment to platforms like Vercel or Netlify. It also ships with offline support via a Progressive Web App configuration and stores recent calculations locally.

## Features

- **Dynamic calculators** for arithmetic, scientific functions, equations, graphing, loans, investments, currency, units, BMI, physics, chemistry, Ohm’s Law, GPA, and more.
- **Live integrations** for currency exchange rates (ExchangeRate.host) and time zone conversions (WorldTime API) with graceful offline fallbacks.
- **Responsive UI** with a category sidebar, global search, dark mode (with automatic system sync), and smooth micro-interactions.
- **History tracking** saved to `localStorage`, accessible via a slide-out panel.
- **PWA ready** with install prompts, offline caching for static assets, and runtime caching for live APIs.

## Getting Started

> **Prerequisites:** Node.js ≥ 18 and npm (or pnpm/yarn). Install those first if they are not already available on your machine.

1. **Install dependencies**

   ```bash
   npm install
   ```

   If you prefer pnpm or yarn:

   ```bash
   pnpm install
   # or
   yarn install
   ```

2. **Run the development server**

   ```bash
   npm run dev
   ```

   The app defaults to `http://localhost:5173/` and will open automatically. Vite supports hot module replacement, so changes appear instantly.

3. **Build for production**

   ```bash
   npm run build
   npm run preview
   ```

   `npm run preview` serves the built assets locally to confirm everything works as expected.

## Environment Notes

- Currency data comes from [ExchangeRate.host](https://exchangerate.host). The public endpoint requires no API key.
- Time zone listings use [WorldTime API](https://worldtimeapi.org/). No key required.
- If either service is unreachable, the UI alerts the user and falls back to cached data when available.

## Deployment

UltimateCalc is ready for static hosting with serverless functions or any modern CDN:

- **Vercel / Netlify:** Import the repo, set the build command to `npm run build`, and serve the `dist` directory. No extra configuration is needed for SPA routing.
- **Static hosting:** Run `npm run build` and host the `dist` output. Ensure the server redirects all routes to `index.html` for client-side routing.

## Progressive Web App

The project uses `vite-plugin-pwa`. During `npm run build`, the plugin generates a service worker and precache manifest:

- Users can install UltimateCalc on desktop or mobile.
- Offline mode keeps local calculators and history available; live data will refresh once connectivity returns.
- Replace the placeholder icons in `public/pwa-192x192.png` and `public/pwa-512x512.png` with production-ready PNG assets before distributing.

## Project Structure

```
src/
├── App.tsx
├── components/
├── contexts/
├── data/
├── features/
├── hooks/
├── pages/
├── providers/
└── store/
```

- `features/` hosts modular calculator components grouped by domain.
- `pages/` handles routing for the home dashboard, category listings, calculator details, settings, and offline fallback.
- `store/` contains persisted Zustand stores for theme, history, and user preferences.
- `hooks/` includes reusable logic for history logging and currency rate fetching.

## Testing & QA Ideas

- Run through calculators and converters to confirm instant updates.
- Toggle dark/light/system themes, refresh the page, and verify persistence.
- Switch to offline mode (simulate in DevTools) to check cached history and calculators.
- Add multiple calculations and ensure they appear in the history panel.
- Install the PWA on mobile/desktop and verify it launches standalone.

## License

This project is delivered as part of a custom build request. Please update licensing information as needed for your environment.

