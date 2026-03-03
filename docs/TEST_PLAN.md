# KHEYA – Unlock Your Future – Test Plan

## Context (filled from codebase)

| Item | Value |
|------|--------|
| **Platform(s)** | React Native (Expo SDK 54), iOS & Android native builds |
| **Payment provider(s)** | RevenueCat (in-app purchases: Google Play / App Store). Fallback: simulated purchase when RevenueCat not configured (dev). |
| **Tech stack** | Frontend: Expo, React Native, expo-router. Backend: Node.js (Express) on Railway. DB/Auth: Supabase. AI: OpenAI via node-backend. |
| **How the user pays** | Subscriptions only: **monthly** (29 RON/lună), **yearly** (249 RON/an). Free tier: 2 chapters per subject + 1 test; rest requires Premium. No one-time, trials, or promo codes in app logic. |

---

## Step 1 – Architecture summary

### Entry points and routing

- **Entry**: `app/index.tsx` – checks legal consent, onboarding, then redirects to `/(tabs)/home` or auth.
- **Router**: `expo-router` (file-based). Root: `app/_layout.tsx` (Stack; ErrorBoundary, SkinProvider, CatalogProvider).
- **Main groups**:
  - `(auth)`: prezentare, onboarding, select-exam, select-level, login.
  - `(tabs)`: home, kheia (chat), tests, progress, profile.
  - Subject/chapter: `subject/[subjectId]`, `chapter/[chapterId]/*` (theory, quiz, quiz-result, generate-theory).
  - Generator: `generator/*`, `select-chapter`, `subject/.../generate-chapter`, `subject/generate-chapters`.
  - Test: `test/[testId]`, `test/result/[testId]`.
  - Other: `subjects`, `rewards`, `referral`, **subscription**, **subscription-success**.

### Backend and APIs

- **Node backend** (`node-backend/`): Express, health + generate routes.
  - `POST /api/generate/chapter`, `/api/generate/summary`, `/api/generate/quiz`, `/api/generate/test`, `/api/generate/chat`.
- **Supabase**: Auth (email/password, Google OAuth), DB (profiles, subscriptions, tests, etc.). Edge Functions: `generate-chapter-content`, `generate-chapter-summary`, `generate-test`.
- **Payment**: No server-side webhooks in this repo. RevenueCat runs on device; after purchase the app calls `updateSubscriptionAfterPurchase(userId, planType, expiration)` to write to Supabase `subscriptions` + `profiles.subscription_type`.

### Main user flows

| Flow | Description |
|------|-------------|
| **Onboarding** | Legal consent (glass slide) → Prezentare → Onboarding → Select exam → Select level → Login/Sign up (email or Google) → Home. |
| **Login** | Email/password or Google OAuth; redirect handled via `Linking.createURL('auth/callback')`. |
| **Core feature** | Home → Materii Disponibile → EN/Bac → Subjects list → Subject → Chapters → Theory / Quiz. Or: Tests tab → KHEYA quizzes / Official tests. KHEYA tab: chat with AI. |
| **Pay / Subscribe** | From paywall (chapter lock, quiz lock, test limit) or Profile → Subscription screen → Choose monthly/yearly → RevenueCat purchase (or simulated) → `updateSubscriptionAfterPurchase` → subscription-success. |
| **Cancellation** | Via RevenueCat Customer Center (presentCustomerCenter); no in-repo cancellation API. |
| **Refunds** | Handled by store (Google/Apple); app sees updated entitlement from RevenueCat. No custom refund flow in repo. |

### External integrations

- **RevenueCat**: IAP, offerings, entitlements (`pro`), purchase, restore, paywall UI, customer center.
- **Supabase**: Auth, DB, Edge Functions (generate content).
- **Node backend**: AI generation and chat (OpenAI).
- **Analytics / Push**: Not present in scanned code.

### Critical features (and test gaps)

| Feature | Related files / modules | User journey | Current tests | Gaps |
|--------|--------------------------|--------------|---------------|------|
| Legal consent | `LegalConsentOverlay`, `app/index`, `legalConsentStorage` | First launch → accept → continue | None | E2E first launch, reject/accept. |
| Auth (email + Google) | `auth.service`, `(auth)/login`, Supabase | Login, sign up, OAuth redirect | None | Unit: token/URL parsing. Integration: auth (mocked Supabase). |
| Subscription status & paywall | `subscription.service`, `useSubscription`, `subscription.tsx`, `purchases.service` | Free limits → paywall → subscribe → success | `getSubscriptionStatus(null)` in sync.test | Unit: canAccessChapter, canStartTest, getQuizQuestionLimit, expiration. Integration: updateSubscriptionAfterPurchase (mocked). |
| Purchase (RevenueCat + simulated) | `purchases.service`, `subscription.tsx` | Select plan → purchase → DB update → success screen | None | Unit: isRevenueCatConfigured, date logic. Integration: purchase flow with mocks. |
| Chapters / theory / quiz | `chapters.service`, `quiz.service`, chapter screens, generator | Open chapter → theory / generate / quiz | quiz.service placeholder; generator placeholder | Unit: quiz selection, limits. Integration: chapter/quiz APIs (mocked). |
| Tests (quiz + official) | `test.service`, `official-tests.service`, `test/[testId]`, tests tab | Start test → answer → result | E2E placeholder | Integration: test start/finish (mocked). |
| KHEYA chat | `kheia.tsx`, node-backend `/api/generate/chat` | Type message → send → stream/response | api.test placeholder | Integration: chat endpoint (mock OpenAI). |
| Progress / gamification | `progress.service`, `gamification.store`, progress tab | XP, streak, missions | gamification.service.test (minimal) | Unit: XP/streak logic. |
| Referral | `referral.service`, `grantReferralPremium` in subscription.service | Invite → credits → premium | None | Unit: grantReferralPremium (mocked). |

---

## Step 2 – Test strategy

### Scope and goals

- **Scope**: All critical paths (auth, subscription, paywall, purchase, chapter/quiz/test access, chat, progress) and payment-related logic.
- **Goals**: Catch regressions, validate business rules (free limits, premium, expiration), safe refactors, confidence before store submission.

### Test types and tools

| Type | Tool | Where |
|------|------|--------|
| **Unit** | Jest | `src/` utils, services (subscription, purchases, auth helpers), validators, price/date logic. |
| **Integration** | Jest + mocks (Supabase, fetch, RevenueCat) | API routes (node-backend), subscription DB updates, auth flows. |
| **E2E** | Jest + (optional) Detox / Maestro later | Main flows in app; currently placeholders; can be expanded with E2E runner. |

**Chosen**: Jest for unit + integration (same runner, fast). E2E kept as Jest describe blocks with clear scenarios until a mobile E2E runner is added.

### Environments, test data, and commands

- **Env**: Local; use `process.env` or `.env.test` for test keys (e.g. Supabase anon key for integration). No real RevenueCat in CI; use mocks.
- **Test data**: Fixtures in `tests/fixtures/` (subjects, chapters, quiz). For payments: mock Supabase `profiles`/`subscriptions` and RevenueCat responses.
- **Commands** (see Step 3):
  - `npm test` – all tests.
  - `npm run test:unit` – unit only.
  - `npm run test:integration` – integration only.
  - `npm run test:coverage` – coverage report.

### Risk areas and priorities

| Priority | Area | Risk |
|----------|------|------|
| **P0** | Subscription status, paywall, purchase → DB | Wrong premium state, no access after pay, or free access when paid. |
| **P0** | Auth (login, OAuth redirect) | Users locked out or session broken. |
| **P1** | Free limits (chapters, tests) | Over/under restriction. |
| **P1** | RevenueCat vs simulated purchase | Simulated path not updating DB; wrong expiration. |
| **P2** | Chat, generator APIs | Errors not handled, bad UX. |
| **P2** | Progress / gamification | Wrong XP/streak. |

---

## Test cases table

### Auth

| ID | Title | Type | Preconditions | Steps | Expected result |
|----|--------|------|----------------|-------|-----------------|
| A1 | getSubscriptionStatus returns free for null user | Unit | - | Call getSubscriptionStatus(null) | isPremium false, planType 'free' |
| A2 | OAuth redirect URL is created (no throw) | Unit | - | getGoogleOAuthUrl or getOAuthRedirectUrl (mocked) | URL contains callback path |
| A3 | setSessionFromOAuthRedirectUrl with missing fragment returns error | Unit | - | setSessionFromOAuthRedirectUrl('http://x') | error, no session set |
| A4 | Sign-in with valid email/password (mocked Supabase) | Integration | Mock Supabase signIn | signInWithEmail('a@b.c','pass') | success response |
| A5 | Sign-up then sign-in flow (mocked) | Integration | Mock Supabase | signUp then signIn | both succeed |

### Subscription and paywall

| ID | Title | Type | Preconditions | Steps | Expected result |
|----|--------|------|----------------|-------|-----------------|
| S1 | getSubscriptionStatus null user | Unit | - | getSubscriptionStatus(null) | free, not premium |
| S2 | canAccessChapter: premium can access any | Unit | status.isPremium true | canAccessChapter(_, 5, status) | true |
| S3 | canAccessChapter: free, chapter 1–2 allowed | Unit | status.isPremium false | canAccessChapter(_, 1), canAccessChapter(_, 2) | true |
| S4 | canAccessChapter: free, chapter 3 blocked | Unit | status.isPremium false | canAccessChapter(_, 3, status) | false |
| S5 | getQuizQuestionLimit: free vs premium | Unit | - | getQuizQuestionLimit(false), getQuizQuestionLimit(true) | 5, 10 |
| S6 | canStartTest: premium can always start | Unit | status.isPremium true | canStartTest(userId, status) | true |
| S7 | canStartTest: free under limit (mocked count) | Integration | Mock Supabase count 0 | canStartTest(id, freeStatus) | true |
| S8 | canStartTest: free at limit (mocked count 1) | Integration | Mock Supabase count 1 | canStartTest(id, freeStatus) | false |
| S9 | updateSubscriptionAfterPurchase inserts and updates (mocked) | Integration | Mock Supabase | updateSubscriptionAfterPurchase(id,'monthly', date) | success, insert + profile update called |
| S10 | Monthly expiration: Jan 31 → next month last day | Unit | - | Logic that sets expiration to last day of next month | Feb 28/29 |
| S11 | Yearly expiration: one year later | Unit | - | Expiration logic yearly | +1 year same day |

### Purchases (RevenueCat + simulated)

| ID | Title | Type | Preconditions | Steps | Expected result |
|----|--------|------|----------------|-------|-----------------|
| P1 | isRevenueCatConfigured: web/native and keys | Unit | Mock Platform.OS, env | isRevenueCatConfigured() | false on web; depends on key on native |
| P2 | purchasePackage without init returns error | Unit | init not called, mock Purchases | purchasePackage('monthly') | success: false, error |
| P3 | Simulated purchase: no user id shows alert, no navigate | Integration | Mock getUser → null | handlePurchase (simulated path) | Alert, no replace |
| P4 | Simulated purchase: with user id calls updateSubscriptionAfterPurchase | Integration | Mock getUser, Supabase | handlePurchase('monthly') | updateSubscriptionAfterPurchase called, navigate to success |
| P5 | RevenueCat purchase success path (mocked Purchases) | Integration | Mock Purchases.purchasePackage success | purchasePackage('monthly') | success true, expirationDate set |
| P6 | RevenueCat purchase cancelled: no alert, no navigate | Integration | Mock purchase throws cancelled | handlePurchase | purchasing cleared, no success screen |
| P7 | RevenueCat purchase failure: alert shown | Integration | Mock purchase throws | handlePurchase | Alert, purchasing cleared |

### Chapter / quiz / test

| ID | Title | Type | Preconditions | Steps | Expected result |
|----|--------|------|----------------|-------|-----------------|
| C1 | Quiz limit applied (free 5, premium 10) | Unit | - | getQuizQuestionLimit | 5 or 10 |
| C2 | Chapter access: free user chapter order 1 | Unit | Free status | canAccessChapter(subjectId, 1, status) | true |
| C3 | Chapter access: free user chapter order 3 | Unit | Free status | canAccessChapter(subjectId, 3, status) | false |
| T1 | getFreeTestsUsedCount (mocked) | Integration | Mock Supabase count | getFreeTestsUsedCount(userId) | count returned |
| T2 | Chat API non-2xx returns error message | Integration | Mock fetch 500 | kheia chat send | Assistant message with error, no crash |

### Edge cases (examples)

| ID | Area | Scenario | Covered by |
|----|------|----------|------------|
| E1 | Subscription | Expiration in past | getSubscriptionStatus uses current_period_end > now |
| E2 | Purchase | User id null after simulated purchase | P3 |
| E3 | Purchase | Monthly expiration last day (Jan 31) | S10 |
| E4 | Paywall | Cancel purchase: no DB change | P6 |
| E5 | Auth | OAuth URL without fragment | A3 |

---

## Payments testing (Step 6)

### Payment-related code paths

1. **Checkout / subscribe**
   - `app/subscription.tsx`: `handlePurchase(planId)`.
   - RevenueCat: `purchasePackage(packageId)` in `purchases.service.ts`.
   - After success: `updateSubscriptionAfterPurchase(user.id, planId, expiration)`.

2. **Webhooks**
   - None in repo. RevenueCat and store handle receipts; app relies on client-side `getCustomerInfo` and on `updateSubscriptionAfterPurchase` after purchase.

3. **Billing portal**
   - RevenueCat Customer Center: `presentCustomerCenter()` (manage subscription, restore). No custom billing portal in backend.

4. **Internal billing logic**
   - `subscription.service`: `FREE_CHAPTERS_PER_SUBJECT`, `FREE_TESTS_LIMIT`, `getQuizQuestionLimit`, `canAccessChapter`, `canStartTest`, `getFreeTestsUsedCount`, `getSubscriptionStatus`, `updateSubscriptionAfterPurchase`.
   - Expiration: monthly = last day of next month when needed; yearly = +1 year.
   - Referral: `grantReferralPremium` (1 month premium).

### Dedicated payment test suites

- **Unit**: `subscription.service` (limits, canAccessChapter, canStartTest, getQuizQuestionLimit, expiration helpers if extracted), `purchases.service` (isRevenueCatConfigured, getApiKey behavior with mocks). Price display: `SUBSCRIPTION_PRICES_RON` (constant).
- **Integration**: `updateSubscriptionAfterPurchase` with mocked Supabase; `handlePurchase` with mocked Supabase + optional mocked Purchases; `getSubscriptionStatus` with mocked profiles/subscriptions.
- **E2E** (when runner available): Open app → login → go to subscription → choose plan → complete (simulated or test account) → see success and premium access.

### Test data and reproduction

- **Test cards**: Use RevenueCat sandbox / test accounts (Google Play test tracks, Apple Sandbox). No test card numbers in repo.
- **Env**: `EXPO_PUBLIC_REVENUECAT_API_KEY_GOOGLE` / `_APPLE` for real IAP tests; in CI leave unset and use mocks.
- **Inspecting subscriptions**: Supabase `profiles.subscription_type`, `subscriptions` table; RevenueCat dashboard for entitlements.

---

## Step 7 – Coverage and maintenance

- **Coverage**: Run `npm run test:coverage`. Current critical-module coverage: `subscription.service.ts` ~72% statements / ~85% functions; `validators.ts` 100%. Aim over time for >80% on subscription and purchases, >70% on auth and core services.
- **Gaps**: E2E with real device/simulator (Detox/Maestro) not set up; add when needed. Node-backend API is now covered by integration tests in `node-backend/` (run `npm run test:backend` or `cd node-backend && npm test`).
- **CI**: Add `npm test` and `npm run test:coverage` to CI; fail on coverage drop below threshold if desired.
- **Pre-push**: Optional `npm test` in husky pre-push.
- **Reviews**: When changing subscription/payment logic, run payment test suite and update TEST_PLAN.md if new flows are added.

---

## How to run tests (Step 3 – verification commands)

From repo root:

| Command | Description |
|--------|-------------|
| `npm test` | Run all tests (unit + integration + e2e) |
| `npm run test:unit` | Run only `tests/unit/**/*.test.ts` |
| `npm run test:integration` | Run only `tests/integration/**/*.test.ts` |
| `npm run test:e2e` | Run only `tests/e2e/**/*.test.ts` (placeholders) |
| `npm run test:coverage` | Run all tests with coverage report (text + lcov) |
| `npm run test:backend` | Run **node-backend** API tests (from `node-backend/`: Jest + Supertest) |

**Config**: `jest.config.js` at repo root (testEnvironment: node, moduleNameMapper for `@/` → `src/`, transform via babel-jest). Unit/integration tests mock Supabase and React Native where needed so they run in Node without Expo.

**Node-backend API tests**: In `node-backend/`, run `npm test`. Uses `jest.config.js` and `src/__tests__/api.test.ts` with Supertest; mocks `ai.service` and `chat.service` so no real OpenAI calls are made. Covers GET `/`, GET `/api/health`, POST `/api/generate/chapter`, `/api/generate/summary`, `/api/generate/quiz`, `/api/generate/test`, `/api/generate/chat` (validation and success paths).
