# Fix: „Error sending confirmation email” la înregistrare

Când Supabase nu poate trimite emailul de confirmare (SMTP neconfigurat sau limită), înregistrarea dă eroare. Pentru a putea crea contul pentru reviewers și pentru development, poți **dezactiva confirmarea pe email**.

## Pași în Supabase

1. Deschide **Supabase Dashboard** → proiectul tău.
2. În meniul din stânga: **Authentication** → **Providers**.
3. Apasă pe **Email**.
4. Dezactivează **„Confirm email”** (toggle off).
5. Salvează (Save).

După aceasta, la **Înregistrare** (email + parolă):
- Contul este creat și **activ imediat** (fără link de confirmare).
- Nu se mai trimite niciun email la signup, deci nu mai apare „Error sending confirmation email”.
- Utilizatorul poate folosi contul imediat după înregistrare.

Poți crea acum contul **google.play.review@kheia.ro** (și orice alt cont de test) fără eroare.

---

## Opțional: confirmare email în viitor

Dacă mai târziu vrei din nou confirmare pe email (pentru producție):
- Configurează **SMTP** în **Project Settings** → **Auth** → **SMTP** (server, user, parolă, expeditor).
- Reactivează **Confirm email** la **Authentication** → **Providers** → **Email**.
