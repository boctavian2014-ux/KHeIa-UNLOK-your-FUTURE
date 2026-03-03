# Configurare Supabase – Kheia – Unlock Your Future

## Precondiții

- Cont [Supabase](https://supabase.com)
- Node.js 18+
- [Supabase CLI](https://supabase.com/docs/guides/cli) (opțional, pentru local)

## 1. Creare proiect Supabase

1. Mergi la [supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project** → alege organizația și regiunea
3. Notează **Project URL** și **anon key** (Settings → API)

## 2. Variabile de mediu

Copiază `.env.example` în `.env` și completează:

```env
# Client (app React Native)
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Seed (script) – folosește service role pentru insert
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- **EXPO_PUBLIC_*** – pentru app (anon key e sigur în client)
- **SUPABASE_SERVICE_ROLE_KEY** – doar pentru scripturi (seed), nu în client

## 3. Rulare migrații

### A) Supabase remote (proiect cloud)

1. Instalează CLI: `npm install -g supabase`
2. Autentificare: `supabase login`
3. Link proiect: `supabase link --project-ref YOUR_PROJECT_REF` (înlocuiește cu ID-ul proiectului din dashboard)
4. Push migrații: `supabase db push`

### B) Supabase local

```bash
supabase start
supabase db reset   # aplică migrații + seed
```

## 4. Seed date

După migrații, rulează:

```bash
npm run seed
```

Scriptul citește `assets/offline-data/*.json` și inserează în Supabase:
- subjects  
- chapters  
- chapterdetails  
- chapterpracticeitems  
- chapterpracticeoptions  

## 5. Verificare

1. Supabase Dashboard → Table Editor
2. Verifică tabelele: `subjects`, `chapters`, `chapterdetails`, `chapterpracticeitems`, `chapterpracticeoptions`
3. Pentru date de utilizator: `userchapterprogress`, `userquizitems`, `tests`, `testitems` (goale până la utilizare)

## Schema (migrații 009+)

| Tabel | ID | Notă |
|-------|-----|-----|
| subjects | text | subj-en-romana, subj-bac-romana |
| chapters | text | chap-en-ro-comunicare, chap-bac-ro-genuri |
| chapterdetails | text | detail-chap-en-ro-comunicare |
| chapterpracticeitems | text | item-en-ro-comunicare-1 |
| chapterpracticeoptions | text | opt-item-en-ro-comunicare-1-a |
| userchapterprogress | uuid | user_id = auth.uid() |
| userquizitems | uuid | RLS per user |
| tests, testitems | uuid | RLS per user |
| ai_cache | uuid | cache generare AI |

## 6. Autentificare cu Google (opțional)

Pentru **Înregistrare / Log in cu Google** în app:

1. **Google Cloud Console**
   - Creează un proiect (sau folosește unul existent) → [APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials).
   - **Create Credentials → OAuth client ID** → Application type: **Web application**.
   - Notează **Client ID** (Web client). Pentru production, adaugă în **Authorized redirect URIs**:
     - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`  
     (înlocuiește `YOUR_PROJECT_REF` cu ID-ul proiectului Supabase din URL-ul dashboard-ului).

2. **Supabase Dashboard**
   - **Authentication → Providers** → activează **Google** și lipește **Client ID** și **Client Secret** de la Google.
   - **Authentication → URL Configuration** → **Redirect URLs**: adaugă:
     - `kheia://auth/callback`  
     (acest URL este folosit de app la revenirea din browser după log in cu Google).

3. **Migrații**
   - Migrația `015_auto_create_profile_on_signup.sql` creează automat un rând în `profiles` la primul sign-up (email sau Google).

Testare: folosește un **development build** (`npx expo run:android` / `npx expo run:ios`), nu Expo Go, ca scheme-ul `kheia://` să funcționeze corect la redirect.

## Resurse

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase – Login with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
