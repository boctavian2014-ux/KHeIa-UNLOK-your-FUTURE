# RevenueCat SDK – Android nativ (Kotlin + Gradle)

**Notă:** Aplicația KheIA este **Expo / React Native**. Integrarea RevenueCat este deja făcută în **TypeScript** (`src/services/purchases.service.ts`). Acest ghid este pentru:
- proiecte Android **nativ** (doar Kotlin/Java), sau
- customizări în folderul `android/` după `expo prebuild` (ex: log level, configurare în `MainApplication`).

Dacă folosești doar Expo/React Native, configurezi din **RevenueCat dashboard** + **`.env`** și folosești `purchases.service.ts`; nu e nevoie de pașii Kotlin de mai jos.

---

## 1. Instalare SDK cu Gradle

În proiectul Android (în `android/app/build.gradle` sau la nivel de app):

```gradle
dependencies {
    // ... alte dependențe
    implementation "com.revenuecat.purchases:purchases:9.22.2"
}
```

Pentru **Paywall UI** (ecran predefinit RevenueCat):

```gradle
dependencies {
    implementation "com.revenuecat.purchases:purchases:9.22.2"
    implementation "com.revenuecat.purchases:purchases-ui:5.3.0"  // versiune compatibilă cu purchases
}
```

Sincronizează Gradle (Sync Now în Android Studio).

**Documentație:** [RevenueCat – Installation Android](https://www.revenuecat.com/docs/getting-started/installation/android#installation)

---

## 2. Configurare cu API key

În clasa ta `Application` (ex: `MainApplication.kt`), de obicei în `android/app/src/main/java/.../MainApplication.kt`:

```kotlin
import android.app.Application
import com.revenuecat.purchases.Purchases
import com.revenuecat.purchases.PurchasesConfiguration
import com.revenuecat.purchases.LogLevel

class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        Purchases.logLevel = LogLevel.DEBUG  // opțional, pentru debug
        Purchases.configure(
            PurchasesConfiguration.Builder(this, "test_tsOPIPkEXmehYYOehZCJQrCIYiy")
                .build()
        )
    }
}
```

**Important:** Pentru producție înlocuiești cu **Production API key** din RevenueCat (Project → API Keys). Nu comite cheia în repo; folosește BuildConfig sau variabile de mediu la build.

---

## 3. Funcționalitate de bază – inițializare și identificare user

După `Purchases.configure`, SDK-ul e gata. Pentru a asocia cumpărăturile cu user-ul tău (ex: Supabase):

```kotlin
import com.revenuecat.purchases.Purchases

// După ce user-ul e logat (ex: ai userId din Supabase)
fun setRevenueCatUserId(userId: String) {
    Purchases.sharedInstance.logIn(
        userId,
        object : Purchases.LogInCallback {
            override fun onReceived(customerInfo: CustomerInfo) {
                // User identificat; poți verifica entitlement aici
            }
            override fun onError(error: PurchasesError) {
                // Tratează eroare
            }
        }
    )
}
```

---

## 4. Verificare entitlement: KheIA Pro

În RevenueCat, entitlement-ul trebuie să aibă **exact** același identifier ca în cod (ex: `pro` sau `KheIA Pro`). În `purchases.service.ts` folosești `KHEIA_PRO_ENTITLEMENT_ID = 'pro'`, deci în dashboard ar trebui să fie `pro`. Dacă în dashboard e „KheIA Pro” (cu spațiu), atunci folosești acel string.

**Kotlin – verificare entitlement:**

```kotlin
import com.revenuecat.purchases.Purchases
import com.revenuecat.purchases.CustomerInfo
import com.revenuecat.purchases.PurchasesError

const val ENTITLEMENT_KHEIA_PRO = "pro"  // sau "KheIA Pro" dacă așa e în dashboard

fun checkProAccess(
    onResult: (Boolean) -> Unit
) {
    Purchases.sharedInstance.getCustomerInfo(
        object : Purchases.CustomerInfoCallback {
            override fun onReceived(customerInfo: CustomerInfo) {
                val hasPro = customerInfo.entitlements[ENTITLEMENT_KHEIA_PRO]?.isActive == true
                onResult(hasPro)
            }
            override fun onError(error: PurchasesError) {
                onResult(false)
            }
        }
    )
}
```

---

## 5. Customer info și achiziții

**Obținere CustomerInfo (info client + abonamente active):**

```kotlin
Purchases.sharedInstance.getCustomerInfo(
    object : Purchases.CustomerInfoCallback {
        override fun onReceived(customerInfo: CustomerInfo) {
            val activeEntitlements = customerInfo.entitlements.active
            val expirationDate = customerInfo.entitlements[ENTITLEMENT_KHEIA_PRO]?.expirationDate
            // Folosește datele pentru UI sau logică
        }
        override fun onError(error: PurchasesError) {
            // Error handling
            Log.e("RevenueCat", error.message)
        }
    }
)
```

**Cumpărare pachet (monthly / yearly / lifetime):**

În RevenueCat, la Offering-ul tău (ex: `default`), package-urile au **identifier**: `monthly`, `yearly`, `lifetime`. Obții oferta, alegi pachetul, apelezi `purchase`:

```kotlin
Purchases.sharedInstance.getOfferings(
    object : Purchases.OfferingsCallback {
        override fun onReceived(offerings: Offerings) {
            val current = offerings.current ?: return
            val monthlyPackage = current.monthly  // sau getPackage("monthly")
            val yearlyPackage = current.annual    // sau getPackage("yearly")
            val lifetimePackage = current.lifetime // sau getPackage("lifetime")
            // Afișezi prețuri și la tap apelezi purchase(package)
        }
        override fun onError(error: PurchasesError) { }
    }
)

// Când user alege un plan (ex: monthly)
fun purchasePackage(pkg: Package) {
    Purchases.sharedInstance.purchase(
        this,  // Activity
        pkg,
        object : MakePurchaseListener {
            override fun onCompleted(
                transaction: StoreTransaction,
                customerInfo: CustomerInfo
            ) {
                val hasPro = customerInfo.entitlements[ENTITLEMENT_KHEIA_PRO]?.isActive == true
                if (hasPro) {
                    // Succes – navighezi la ecran de succes sau actualizezi UI
                }
            }
            override fun onError(error: PurchasesError, userCancelled: Boolean) {
                if (!userCancelled) {
                    // Afișezi mesaj de eroare
                }
            }
        }
    )
}
```

**Best practice:** Păstrează o referință la `CustomerInfo` după fiecare `getCustomerInfo` / `purchase` și actualizează UI-ul; poți și asculta schimbări prin `Purchases.sharedInstance.updatedCustomerInfoListener`.

---

## 6. Produse și Offering în RevenueCat

- **Dashboard → Products:** asociază Product ID-urile din Google Play (`monthly`, `yearly`, `lifetime`) cu entitlement-ul `pro` (sau „KheIA Pro”).
- **Offerings → default:** adaugă packages cu identifier-ele `monthly`, `yearly`, `lifetime` (sau `$rc_monthly`, `$rc_annual`, `$rc_lifetime` dacă folosești convenția RevenueCat). În cod folosești același identifier la `getPackage("monthly")` etc.

---

## 7. Paywall RevenueCat (UI predefinit)

Dacă folosești **purchases-ui** (Paywall UI):

**Compose:**

```kotlin
import com.revenuecat.purchases.ui.revenuecatui.Paywall
import com.revenuecat.purchases.ui.revenuecatui.PaywallOptions

@Composable
fun PaywallScreen(onDismiss: () -> Unit) {
    Paywall(
        options = PaywallOptions(
            dismissRequest = onDismiss
        ).toBuilder()
            .setDisplayCloseButton(true)
            .build()
    )
}
```

**Fragment (XML):** poți folosi `PaywallFragment` din SDK-ul UI; vezi [RevenueCat Paywalls](https://www.revenuecat.com/docs/tools/paywalls).

---

## 8. Customer Center (gestionare abonament)

Pentru „Manage subscription” / Restore purchases:

```kotlin
import com.revenuecat.purchases.ui.revenuecatui.CustomerCenter

// Într-un Activity sau Fragment
CustomerCenter.show(this)  // this = Activity
```

Utilizatorul poate restaura cumpărăturile sau deschide setările de abonament din Customer Center. Afișezi un buton în Setări/Profil care apelează `CustomerCenter.show(activity)`.

Documentație: [Customer Center](https://www.revenuecat.com/docs/tools/customer-center).

---

## 9. Rezumat și error handling

- **Erori:** toate callback-urile au `onError(error: PurchasesError)`. Verifică `error.code` (ex: `PurchaseCancelledError`, `NetworkError`) și `userCancelled` la purchase pentru a nu afișa „Eroare” când user-ul a dat înapoi.
- **Best practice:** configure o singură dată în `Application.onCreate`; identifică user-ul cu `logIn(userId)` după login; verifică entitlement înainte de a afișa conținut premium; oferă Customer Center pentru restaurare și gestionare abonament.
- **Produse:** monthly, yearly, lifetime în Google Play + RevenueCat Products + Offering packages cu aceleași ID-uri; entitlement `pro` (sau „KheIA Pro”) legat de toate cele trei.

Pentru **aplicația ta KheIA (Expo)**, toate acestea sunt deja acoperite în **TypeScript** în `src/services/purchases.service.ts` și în ecranele de abonament; trebuie doar configurate dashboard-ul RevenueCat, Google Play și `.env` cu API key-ul Google.
