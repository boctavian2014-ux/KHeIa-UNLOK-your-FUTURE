# Fluxuri utilizator și emailuri – KHEYA

Detalii despre ce se întâmplă la login, înregistrare, resetare parolă și abonament: de la cine primesc utilizatorii emailuri și unde ajung în app după fiecare acțiune.

---

## 1. Log in (conectare) – email + parolă

| Ce face userul | Ce primește | Unde ajunge în app |
|----------------|-------------|---------------------|
| Completează email + parolă, apasă **Conectare** | **Niciun email.** Doar se verifică datele. | După succes → **Acasă** (`/(tabs)/home`). |

**De la cine ar veni eventual un email:** Nu se trimite niciun email la log in. Autentificarea e instant.

---

## 2. Înregistrare (sign up) – email + parolă

| Ce face userul | Ce primește | Unde ajunge în app |
|----------------|-------------|---------------------|
| Completează email + parolă, apasă **Înregistrare** | **Email de confirmare** trimis de **Supabase** (nu de KHEYA). Conține un link pe care userul trebuie să-l apese pentru a-și confirma contul. | App-ul afișează un **Alert**: „Verifică email-ul – Am trimis un link de confirmare. Verifică inbox-ul și apasă linkul.” La **OK** → **Acasă** (`/(tabs)/home`). Nu există o pagină separată „Mulțumire după înregistrare” – doar acest mesaj. |

**De la cine vine emailul:** **Supabase Auth**. Expeditorul, subiectul și textul se configurează în **Supabase Dashboard → Authentication → Email Templates** (Confirm signup). Dacă nu configurezi nimic, Supabase folosește șablonul implicit (expeditor: noreply de la proiectul tău Supabase).

**Notă:** Dacă în Supabase este dezactivată „Confirm email” (Authentication → Providers → Email), userul poate folosi contul imediat fără să confirme emailul; atunci nu primește niciun email la înregistrare.

---

## 3. Log in cu Google

| Ce face userul | Ce primește | Unde ajunge în app |
|----------------|-------------|---------------------|
| Apasă **Continua cu Google** și completează fluxul în browser | **Niciun email** de confirmare. Contul e creat/folosit direct prin Google. | După succes → **Acasă** (`/(tabs)/home`). |

**De la cine ar veni email:** Nu se trimite email. OAuth cu Google nu necesită confirmare prin email în app.

---

## 4. Ai uitat parola (reset parolă)

| Ce face userul | Ce primește | Unde ajunge în app |
|----------------|-------------|---------------------|
| Introduce email-ul și apasă **Trimite link** (în modul „Ai uitat parola?”) | **Email de resetare parolă** trimis de **Supabase**. Conține link pentru setarea unei parole noi. | App-ul afișează **Alert**: „Email trimis – Verifică inbox-ul pentru linkul de resetare parolă.” Rămâne pe ecranul de login (modul „Ai uitat parola” se poate schimba înapoi la „Conectare”). Nu există pagină dedicată „Mulțumire”. |

**De la cine vine emailul:** **Supabase Auth**. Șablon în **Supabase Dashboard → Authentication → Email Templates** (Reset password).

---

## 5. Abonament (cumpărare Premium)

| Ce face userul | Ce primește | Unde ajunge în app |
|----------------|-------------|---------------------|
| Ajunge pe ecranul **KHEYA Premium** (`/subscription`), alege planul (Lunar/Anual) și finalizează plata | **Chitanță / confirmare de la magazin:** Google Play sau App Store trimit email/chitanță (în funcție de setările utilizatorului la contul Google/Apple). **Aplicația KHEYA nu trimite un email separat** de confirmare abonament. | După plată reușită → **Pagina de succes** (`/subscription-success`): mesaj „Felicitări!”, confetti, text de tip „Ai activat KHEYA [Lunar/Anual]. Accesul complet este deblocat!”. După ~2,5 secunde → **Tab-urile principale** (`/(tabs)`), de obicei Acasă. |

**Unde se face plata:** În app – ecranul `/subscription` (lista de planuri). La apăsarea pe un plan, se deschide **fluxul nativ** de plată (Google Play sau App Store), apoi revenire în app. Nu există redirect către un site extern de plată; totul rămâne în aplicație prin RevenueCat + magazin.

**Email de confirmare abonament:** Nu este trimis din KHEYA. Utilizatorul poate primi chitanță/email de la **Google Play** sau **Apple** (în funcție de preferințele contului lor). RevenueCat nu trimite emailuri către utilizatori.

---

## Rezumat rapid

| Acțiune | Email trimis? | De la cine? | Pagină „mulțumire” / destinație în app |
|---------|----------------|-------------|----------------------------------------|
| **Log in** (email) | Nu | – | Acasă |
| **Înregistrare** (email) | Da – confirmare cont | Supabase | Alert + Acasă (fără pagină dedicată) |
| **Log in Google** | Nu | – | Acasă |
| **Reset parolă** | Da – link resetare | Supabase | Alert, rămâne pe login |
| **Abonament** | Nu din app; eventual chitanță de la magazin | Google / Apple | Pagină succes → apoi Acasă (tabs) |

---

## Configurare emailuri Supabase (opțional)

- **Supabase Dashboard** → **Authentication** → **Email Templates**  
  Aici poți schimba textul și subiectul pentru:
  - Confirm signup
  - Reset password
- **Authentication** → **Providers** → **Email**  
  Aici poți activa/dezactiva **Confirm email** (obligativitatea confirmării prin email la înregistrare).
- **Project Settings** → **Auth** → **SMTP** (opțional)  
  Poți seta un SMTP propriu ca să trimiți emailurile de auth de la un domeniu al tău (ex: `noreply@kheia.ro`) în loc de adresa implicită Supabase.
