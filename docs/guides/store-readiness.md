# Checklist – Până la Store (App Store / Play Store)

## Status actual

| Categorie | Status | Detalii |
|-----------|--------|---------|
| Funcționalitate core | OK | Home, materii, capitole, teorie, quiz, teste |
| Generare AI | OK | Capitol, teorie, fallback la backend |
| Legal (GDPR, Privacy, Terms) | OK | În Profil → Legal |
| Gamification | OK | XP, monede, streak, recompense |
| Skin / teme | OK | 3 fundaluri în Profil |
| Progres / statistici | OK | Profil cu evoluție, plan studiu |

---

## De făcut înainte de Store

### 1. Configurare app (app.json / app.config.js)

- [ ] **Icon** – `icon` și `adaptiveIcon` (Android) – lipsesc din app.json
- [ ] **Splash screen** – `splash` (imagine, backgroundColor) – lipsește
- [ ] **Bundle ID** – `ios.bundleIdentifier`, `android.package` – pentru build production
- [ ] **Versiune** – `version` (0.1.0) și `ios.buildNumber` / `android.versionCode` pentru fiecare release

### 2. EAS Build (eas.json)

- [ ] **Production build** – `eas build --platform android` și `--platform ios`
- [ ] **Credentials** – cont Apple Developer (iOS), cont Google Play (Android)
- [ ] **Environment** – variabile `EXPO_PUBLIC_*` setate în EAS Secrets pentru build

### 3. Autentificare

- [ ] **Login** – ecranul `(auth)/login.tsx` e placeholder (doar titlu)
- [ ] **Flux auth** – Google / Apple Sign-In sau email (Supabase Auth)
- [ ] **Onboarding** – `(auth)/onboarding`, `select-exam`, `select-level` – UI minim, fără logică completă
- [ ] **Protecție rute** – decizie: app funcțional fără login sau redirect la login pentru progres

### 4. Store listing

- [ ] **Titlu** – KhEIa / KhEla (consistent)
- [ ] **Descriere** – scurtă + lungă (EN/RO)
- [ ] **Screenshot-uri** – 2–8 pe device (phone/tablet)
- [ ] **Feature graphic** – 1024x500 (Play Store)
- [ ] **App icon** – 512x512 (Play Store)

### 5. Politici și conformitate

- [ ] **Privacy Policy URL** – link public (hostat undeva sau în app)
- [ ] **Terms of Service URL** – idem
- [ ] **Data safety** (Play Store) – ce date colectezi, cum le folosești
- [ ] **App Privacy** (App Store) – label-uri de confidențialitate

### 6. Backend și servicii

- [ ] **Railway** – backend deployat, `OPENAI_API_KEY` / `GEMINI_API_KEY` setate
- [ ] **Supabase** – Edge Functions deployate, `NODE_BACKEND_URL` configurat
- [ ] **App .env** – `EXPO_PUBLIC_NODE_BACKEND_URL` setat pentru build production (sau EAS Secrets)

### 7. Testare pre-release

- [ ] **Internal testing** – build instalat pe device real
- [ ] **Generează capitol** – flow complet, conținut salvat
- [ ] **Generează teorie** – flow complet
- [ ] **Chat KhEla** – funcțional cu backend
- [ ] **Quiz** – răspunsuri, scor, navigare
- [ ] **Teste EN/BAC** – dacă sunt folosite

---

## Prioritate recomandată

1. **Icon + Splash** – necesare pentru orice build
2. **Bundle ID / package** – necesare pentru store
3. **Login** – dacă vrei progres salvat în cloud; altfel poți lansa fără
4. **Store assets** – screenshot-uri, descrieri
5. **Privacy URLs** – obligatorii pentru ambele store-uri

---

## Comenzi utile

```powershell
# Verificare generare
npm run verify:generate

# Teste
npm test

# Build Android (EAS)
eas build --platform android --profile production

# Build iOS (EAS)
eas build --platform ios --profile production
```
