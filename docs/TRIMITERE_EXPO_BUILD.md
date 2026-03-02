# Trimitere build în Expo (EAS)

**Linkuri directe:**

| Pagină | URL |
|--------|-----|
| Proiect | https://expo.dev/accounts/devaieoodltd1/projects/kheia |
| **Build-uri (AAB aici)** | https://expo.dev/accounts/devaieoodltd1/projects/kheia/builds |

## Pași

### 1. Autentificare

În terminal, autentifică-te cu contul **devaieoodltd1**:

```bash
npx eas login
```

Introdu email-ul și parola contului Expo asociat cu devaieoodltd1.

### 2. Legare proiect (doar dacă build-urile nu apar la proiectul kheia)

Dacă proiectul local nu e deja legat de [kheia](https://expo.dev/accounts/devaieoodltd1/projects/kheia):

```bash
npx eas project:link
```

Alege account-ul **devaieoodltd1** și proiectul **kheia**. Comanda va actualiza `app.json` cu `projectId` corect.

### 3. Build Android (AAB) și trimitere pe Expo

Build pentru **preview** (AAB, distribuție internă):

```bash
npx eas build --platform android --profile preview
```

sau folosește scriptul:

```bash
npm run build:android:aab
```

După ce build-ul se termină pe serverele EAS, va apărea în dashboard la:
**Builds** → [expo.dev/accounts/devaieoodltd1/projects/kheia](https://expo.dev/accounts/devaieoodltd1/projects/kheia)

De acolo poți descărca AAB-ul sau distribui linkul de instalare (dacă ai distribution: internal).

### 4. Build pentru producție (Google Play)

Pentru AAB de încărcat în Play Console:

```bash
npx eas build --platform android --profile production
```

sau:

```bash
npm run build:android:prod
```

---

**Notă:** La primul build, EAS poate întreba să configurezi credențiale Android (keystore). Poți alege „Let EAS handle it” pentru a genera un keystore gestionat de Expo.
