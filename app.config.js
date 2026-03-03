/**
 * Încarcă .env și pune EXPO_PUBLIC_NODE_BACKEND_URL în expo.extra (citit în app via Constants).
 * Unde pui variabila:
 * 1) Fișier .env în rădăcina proiectului (același folder cu app.json):
 *    EXPO_PUBLIC_NODE_BACKEND_URL=https://kheia-unlok-your-future-production.up.railway.app
 * 2) Dacă nu există .env sau e gol, se folosește URL-ul implicit de mai jos.
 * După modificare la .env: repornește cu "npx expo start -c".
 */
const path = require('path');
try {
  require('dotenv').config({ path: path.resolve(__dirname, '.env') });
} catch {
  // dotenv opțional
}

const DEFAULT_NODE_BACKEND_URL = 'https://kheia-unlok-your-future-production.up.railway.app';

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    EXPO_PUBLIC_NODE_BACKEND_URL:
      process.env.EXPO_PUBLIC_NODE_BACKEND_URL?.trim() || DEFAULT_NODE_BACKEND_URL,
  },
});
