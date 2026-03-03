# Google OAuth – redirect în Expo Go (fix „localhost”)

După ce alegi contul Google, dacă Safari încearcă să deschidă **localhost** și dă eroare „couldn't connect to the server”, aplicația folosește acum un redirect URL generat din **Linking.createURL**, astfel încât revine în app (Expo Go sau build), nu la localhost.

## Ce s-a schimbat în cod

- **`src/services/auth.service.ts`**: redirect URL-ul este `Linking.createURL('auth/callback')`.
  - **Expo Go:** `exp://IP_TAU:8081/--/auth/callback` (revine în Expo Go).
  - **Build (AAB/IPA):** `kheia://auth/callback`.

## Ce trebuie setat în Supabase

1. Mergi la **Supabase Dashboard** → **Authentication** → **URL Configuration**.
2. La **Redirect URLs** adaugă:
   - `kheia://auth/callback` (pentru build-ul de producție).
   - Pentru testare în **Expo Go**, adaugă și URL-ul Expo (îl vezi în terminal când rulezi `expo start`, de forma `exp://192.168.x.x:8081`). Poți adăuga:
     - `exp://192.168.1.1:8081/--/auth/callback` (înlocuiește cu IP-ul tău),
     - sau, dacă Supabase acceptă, un pattern de tip `exp://*` (verifică în UI).
3. **Site URL** nu trebuie să fie `http://localhost:...` ca singură opțiune; păstrează un URL de producție (ex. `https://domeniul-tau.ro`) sau cel folosit de app. Redirect-ul după Google vine la URL-urile din Redirect URLs, nu neapărat la Site URL.

## Verificare

- În Expo Go: „Continua cu Google” → alegi contul → ar trebui să revii în app, nu la ecranul de eroare Safari cu localhost.
- Dacă tot vezi localhost, verifică că ai adăugat în Redirect URLs exact URL-ul pe care îl folosește app-ul (poți loga temporar `getOAuthRedirectUrl()` sau `Linking.createURL('auth/callback')` și să îl adaugi în Supabase).
