# Unde pui EXPO_PUBLIC_NODE_BACKEND_URL (Chat KhEla)

URL-ul backend-ului pentru chat se citește din **expo.extra**, populat în `app.config.js`. Poți seta variabila în unul din locurile de mai jos.

## 1. Fișier `.env` (recomandat pentru development)

- **Locație:** în **rădăcina proiectului** (același folder unde este `app.json` și `app.config.js`).
- **Nume fișier:** `.env` (nu `.env.example`).
- **Conținut (o singură linie, fără spații în jurul `=`):**
  ```env
  EXPO_PUBLIC_NODE_BACKEND_URL=https://kheia-unlok-your-future-production.up.railway.app
  ```

Dacă nu ai fișier `.env`:

1. Copiază `.env.example` și redenumește copia în `.env`.
2. Deschide `.env` și setează `EXPO_PUBLIC_NODE_BACKEND_URL` la URL-ul tău (cu `https://`).
3. Repornește dev server-ul **cu cache curat:**  
   `npx expo start -c`

## 2. URL implicit (fără .env)

Dacă **nu** pui variabila nicăieri, aplicația folosește URL-ul implicit din `app.config.js` (backend-ul de producție de pe Railway). Chat-ul ar trebui să funcționeze și fără `.env`, dacă acel backend e live.

## 3. EAS Build (production / preview)

Pentru build-uri EAS, variabila e setată în **eas.json** la profile-ul `production` (secțiunea `env`). Pentru alte profile (ex. `preview`), adaugă acolo:

```json
"env": {
  "EXPO_PUBLIC_NODE_BACKEND_URL": "https://kheia-unlok-your-future-production.up.railway.app"
}
```

## Rezumat

| Unde              | Când folosești        |
|-------------------|------------------------|
| **.env** (rădăcină) | Development local      |
| **app.config.js** | Implicit dacă .env lipsește |
| **eas.json** → env | Build-uri EAS (production etc.) |

După orice modificare la `.env`, rulează `npx expo start -c`.
