# Android 15 / 16 – Edge-to-edge și orientare (Google Play)

Google Play poate afișa avertismente legate de:
1. **API-uri depreciate pentru edge-to-edge** (Android 15)
2. **Restricții de orientare / resizability** (Android 16, tablete și foldable)

---

## 1. Ce am făcut în proiect

### Orientare (MainActivity)

- În **`app.json`**: `"orientation": "portrait"` a fost schimbat în **`"orientation": "default"`**.
- Efect: aplicația nu mai impune doar portrait; pe Android 16, pe dispozitive mari (tablete, foldable), sistemul poate ignora restricțiile de orientare – acum nu mai există o restricție de eliminat.
- **Recomandare:** Testează layout-ul în landscape și pe ecran mare; dacă vrei să limitezi la portrait doar pe telefoane, poți trata din cod (ex. dimensiuni ecran) fără a seta `screenOrientation` în manifest.

### Edge-to-edge (Android 15)

- În **`app.json`** la `expo.android` s-a adăugat **`"edgeToEdgeEnabled": true`**.
- Expo SDK 54 folosește deja mecanisme moderne pentru edge-to-edge; această setare explică că aplicația este pregătită pentru modul edge-to-edge.

### API-uri depreciate (setStatusBarColor, setNavigationBarColor, LAYOUT_IN_DISPLAY_CUTOUT_MODE_*)

- Aceste apeluri provin din **React Native**, **react-native-screens** și **Material components** (BottomSheet etc.) din `node_modules`.
- **Nu se pot elimina direct** din proiectul tău; fix-urile vin cu actualizări Expo / React Native / react-native-screens.
- **Ce poți face:**
  - Păstrează **Expo** și **react-native-screens** la ultimele versiuni compatibile (ex. `npx expo install --fix`).
  - La fiecare upgrade major Expo (ex. 55, 56), verifică changelog-ul pentru „Android 15”, „edge-to-edge”, „WindowInsetsController”.
- Google afișează avertismentul, dar aplicația continuă să funcționeze; pe Android 16 unele API-uri vor fi pur și simplu ignorate de sistem.

---

## 2. Rezumat pentru Google Play

| Problemă | Măsură în proiect |
|----------|--------------------|
| `android:screenOrientation="PORTRAIT"` pe MainActivity | `app.json` → `orientation: "default"` (nu mai forțăm portrait în manifest). |
| Edge-to-edge / API-uri depreciate | `app.json` → `android.edgeToEdgeEnabled: true`; actualizări viitoare Expo/RN vor reduce avertismentele. |

---

## 3. Resurse

- [Expo – Edge-to-Edge display (Android)](https://expo.dev/blog/edge-to-edge-display-now-streamlined-for-android)
- [Expo – System bars](https://docs.expo.dev/develop/user-interface/system-bars/)
- [Android – Edge-to-edge](https://developer.android.com/develop/ui/views/layout/edge-to-edge)
