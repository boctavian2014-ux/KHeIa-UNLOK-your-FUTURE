# R8 / ProGuard – cod obfuscat pentru Android

Fișierul **`android-proguard-rules.pro`** din rădăcina proiectului conține regulile ProGuard. Îl poți încărca unde ai nevoie sau copia conținutul.

---

## 1. Instalare plugin (o dată)

În rădăcina proiectului:

```bash
npx expo install expo-build-properties
```

---

## 2. Activare R8/ProGuard în `app.json`

Adaugă în `app.json` la `expo.plugins`:

```json
[
  "expo-build-properties",
  {
    "android": {
      "enableProguardInReleaseBuilds": true
    }
  }
]
```

Dacă vrei și reguli custom, poți folosi conținutul din `android-proguard-rules.pro` ca string în `extraProguardRules` (vezi mai jos).

---

## 3. Reguli ProGuard (fișier separat)

Conținutul din **`android-proguard-rules.pro`** îl poți:

- **Varianta A:** Copia în clipboard și în config (ex. `extraProguardRules` ca string, linii separate cu `\n`).
- **Varianta B:** Păstra ca fișier în proiect; cu un config plugin care citește fișierul, aceste reguli se aplică la build.

---

## 4. mapping.txt (ReTrace) – unde îl obții și cum îl încarci

**mapping.txt nu se poate crea manual.** Îl generează R8 la build-ul Android (release). Fără el, Play Console nu poate „de-obfusca” stack trace-urile pentru versiunea 0.2.0.

### Cum obții mapping.txt

1. **După un build EAS** (preview sau production):
   - Mergi la [expo.dev](https://expo.dev) → proiectul **kheia** → **Builds**.
   - Deschide build-ul Android (AAB) pentru versiunea **0.2.0**.
   - La **Artifacts** (sau **Build artifacts**) ar trebui să apară **mapping.txt** (dacă R8 a rulat și calea din `buildArtifactPaths` există).
   - Descarcă **mapping.txt** și păstrează-l pentru versiunea respectivă.

2. **Dacă nu apare mapping.txt** la artifacte:
   - Asigură-te că ai rulat `npx expo install expo-build-properties` și că în `app.json` este activat `enableProguardInReleaseBuilds: true`.
   - Fă un **nou** build Android (production sau preview); la release R8 generează `android/app/build/outputs/mapping/release/mapping.txt`, iar EAS îl pune la artifacte dacă în `eas.json` ai `buildArtifactPaths` cu această cale.

### Unde încarci mapping.txt în Play Console (ReTrace pentru App bundle 0.2.0)

1. **Play Console** → aplicația KHEYA.
2. **Release** → **App bundle explorer** (sau **Production** / **Testing** → versiunea 0.2.0).
3. Selectează **App bundle 0.2.0** (versiunea care corespunde build-ului din care ai descărcat mapping.txt).
4. Caută **„Upload mapping file”** / **„ReTrace mapping file”** / **„Deobfuscation file”**.
5. Încarcă fișierul **mapping.txt** descărcat de la EAS.

Fiecare versiune (0.2.0, 0.2.1, etc.) trebuie să aibă mapping-ul generat la build-ul respectiv; nu poți folosi mapping de la altă versiune.

---

## Rezumat

| Ce | Unde |
|----|------|
| Reguli ProGuard | Fișier **`android-proguard-rules.pro`** (rădăcină proiect) |
| Config Expo | `app.json` → `plugins` + `expo-build-properties` |
| Mapping R8 (upload Play) | După build: artifact / `mapping.txt` → Play Console |
