# Instrucțiuni pentru Google Play – App access (reviewers)

În **Play Console** la secțiunea unde Google întreabă dacă app-ul are acces restricționat:

1. Bifează: **„All or some functionality in my app is restricted”**.
2. Adaugă instrucțiuni (poți folosi până la **5**). Mai jos ai text gata de copiat; înlocuiește `[EMAIL]` și `[PAROLA]` cu contul de test pe care îl creezi pentru reviewers.

---

## Cont pentru reviewers (obligatoriu)

**Google spune că reviewerii NU pot crea conturi.** Trebuie să le dai un cont care **există deja** și cu care pot accesa tot app-ul.

- Creează **un cont dedicat** în app (înregistrare email + parolă), de ex. `google.play.review@domeniul-tau.ro` (sau un Gmail dedicat).
- Fă acest cont **Premium** (fie cumperi o dată cu el în sandbox și lași abonamentul activ, fie îl marchezi manual ca Premium în backend/RevenueCat dacă ai cum). Astfel reviewerul se loghează și vede deja tot conținutul, fără pași suplimentari.
- Folosește același email și parolă în instrucțiunile de mai jos.

---

## Instrucțiuni de copiat în Play Console (până la 5)

**Instrucțiune 1 (obligatoriu):**  
`To access the app, open it and tap "Autentificare" (or "Login") on the profile tab. Then sign in with the test account.`

**Instrucțiune 2:**  
`Email: [EMAIL]`  
(înlocuiești [EMAIL] cu adresa reală, ex. google.play.review@domeniul-tau.ro)

**Instrucțiune 3:**  
`Password: [PAROLA]`  
(înlocuiești [PAROLA] cu parola reală a contului de test)

**Instrucțiune 4:**  
`This test account has full (Premium) access. You can browse all subjects, chapters, theory, quizzes, and tests without any paywall.`

**Instrucțiune 5 (opțional):**  
`If you see a subscription screen, you are not logged in. Use the credentials above to sign in first; the account already has Premium access.`

---

## Exemplu complet (după ce înlocuiești email și parolă)

| # | Instrucțiune |
|---|--------------|
| 1 | To access the app, open it and tap "Autentificare" (or "Login") on the profile tab. Then sign in with the test account. |
| 2 | Email: google.play.review@example.com |
| 3 | Password: YourSecureReviewPassword123! |
| 4 | This test account has full (Premium) access. You can browse all subjects, chapters, theory, quizzes, and tests without any paywall. |
| 5 | If you see a subscription screen, you are not logged in. Use the credentials above to sign in first; the account already has Premium access. |

---

## „Allow Android to use the credentials...”

Dacă apare opțiunea **„Allow Android to use the credentials you provide for performance and app compatibility testing”**:  
O poți bifa. Google folosește credențialele doar pentru teste automate de compatibilitate pe dispozitive; nu le folosesc reviewerii umani pentru „login manual”. E opțional, dar nu strica.

---

## Rezumat

1. Creezi **un cont** în app (email + parolă) dedicat reviewerilor.
2. Îl faci **Premium** (test purchase sau setare manuală), ca după login să aibă acces la tot.
3. În Play Console alegi **„All or some functionality is restricted”** și adaugi cele 5 instrucțiuni de mai sus, cu email și parola reale.
4. Salvezi. După trimitere, reviewerii vor folosi acel cont pentru a verifica app-ul.
