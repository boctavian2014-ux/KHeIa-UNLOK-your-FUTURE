# Icon și Splash – unde le pui și ce dimensiuni

## Unde le pui

Toate asset-urile pentru **icon** și **splash** stau în folderul **`assets`** din rădăcina proiectului.

**Configurarea actuală (app.json):**

| Rol | Fișier în `assets/` |
|-----|----------------------|
| Icon app (iOS + generic) | `kheya_icon_1024x1024.png` |
| Splash screen | `kheya_splash_1080x1920.png` |
| Android adaptive icon | `kheya_icon_1024x1024.png` (același ca icon) |

**Alte fișiere din assets (folosire):**
- `kheya_app_icon.png` – icon alternativ (poți folosi în loc de 1024x1024 dacă e același conținut).
- `kheya_splash_screen.png` – splash alternativ.
- `kheya_feature_graphic_1024x500.png` / `kheya_feature_graphic_play.png` – **nu se pun în app.json**. Se încarcă în **Google Play Console** la listing (Feature graphic 1024×500).

---

## Dimensiuni recomandate

| Asset | Dimensiuni | Notă |
|-------|------------|------|
| **Icon (iOS + generic)** | **1024 × 1024 px** | PNG, fără transparență pentru App Store. Expo îl redimensionează pentru toate rezoluțiile. |
| **Icon Android (adaptive)** | **1024 × 1024 px** | Același fișier sau unul dedicat. Zonele din colțuri pot fi tăiate pe unele device-uri (cerc sau formă rotunjită). |
| **Splash** | ex. **1284 × 2778 px** (sau 1:1) | Recomandat cel puțin ca raport similar cu ecranul (portrait). Expo poate folosi și iconul 1024×1024 cu `resizeMode: "contain"` și `backgroundColor`. |

---

## Cum actualizezi în proiect

1. **Creezi sau înlocuiești imaginile** în **`assets/`**:
   - `icon.png` – 1024×1024 (logo / simbol aplicație).
   - `splash.png` – opțional; dacă lipsește, Expo poate folosi iconul.

2. **Actualizezi app.json** ca să pointeze la ele:

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1e293b"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon.png",
        "backgroundColor": "#1e293b"
      }
    }
  }
}
```

3. Dacă folosești în continuare **BECKGROUND.png** pentru icon și splash, verifică că fișierul există în **`assets/BECKGROUND.png`** și că în app.json traseele sunt **`./assets/BECKGROUND.png`** (cum este acum).

---

## Verificare rapidă

- Icon: fișier în **assets/** (ex. `assets/icon.png` sau `assets/BECKGROUND.png`).
- app.json: `"icon": "./assets/NUME_FISIER.png"`.
- Pentru store: icon **1024×1024** asigură cea mai bună calitate pe toate device-urile.
