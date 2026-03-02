import { Platform } from 'react-native';

const APPLE_KEY = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_REVENUECAT_API_KEY_APPLE) ?? '';
const GOOGLE_KEY = (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_REVENUECAT_API_KEY_GOOGLE) ?? '';

/** Entitlement identifier in RevenueCat dashboard for KheIA Pro access. */
export const KHEIA_PRO_ENTITLEMENT_ID = 'pro';

/** RevenueCat nu rulează pe web. */
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

export function isRevenueCatConfigured(): boolean {
  if (!isNative) return false;
  return !!(Platform.OS === 'ios' ? APPLE_KEY : GOOGLE_KEY);
}

function getApiKey(): string {
  const key = Platform.OS === 'ios' ? APPLE_KEY : GOOGLE_KEY;
  return key?.trim() ?? '';
}

let initialized = false;

export async function initPurchases(userId: string | null): Promise<void> {
  const apiKey = getApiKey();
  if (!apiKey) return;
  try {
    const Purchases = (await import('react-native-purchases')).default;
    await Purchases.configure({ apiKey });
    initialized = true;
    if (userId) await Purchases.logIn(userId);
  } catch (e) {
    console.warn('[Purchases] init failed', e);
  }
}

export function isPurchasesInitialized(): boolean {
  return initialized;
}

/** Customer info from RevenueCat (entitlements, active subscriptions). */
export type CustomerInfo = {
  entitlements: { active: Record<string, { expirationDate?: string }> };
};

export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!isNative) return null;
  const apiKey = getApiKey();
  if (!apiKey || !initialized) return null;
  try {
    const Purchases = (await import('react-native-purchases')).default;
    const info = await Purchases.getCustomerInfo();
    return info as unknown as CustomerInfo;
  } catch (e) {
    console.warn('[Purchases] getCustomerInfo failed', e);
    return null;
  }
}

/** Returns true if the user has the KheIA Pro entitlement. */
export async function hasProEntitlement(): Promise<boolean> {
  const info = await getCustomerInfo();
  if (!info?.entitlements?.active) return false;
  return KHEIA_PRO_ENTITLEMENT_ID in info.entitlements.active;
}

export async function getOfferings(): Promise<{
  current: { availablePackages: Array<{ identifier: string; package: unknown }> };
} | null> {
  if (!isNative) return null;
  const apiKey = getApiKey();
  if (!apiKey || !initialized) return null;
  try {
    const Purchases = (await import('react-native-purchases')).default;
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    return current ? { current } : null;
  } catch (e) {
    console.warn('[Purchases] getOfferings failed', e);
    return null;
  }
}

/** Package identifiers in RevenueCat: monthly, yearly, lifetime. */
export const PLAN_TO_PACKAGE_ID: Record<string, string> = {
  monthly: 'monthly',
  yearly: 'yearly',
  lifetime: 'lifetime',
  full_edumat: 'lifetime',
};

export type PurchaseResult =
  | { success: true; customerInfo: { expirationDate: string | null } }
  | { success: false; error: unknown };

export async function purchasePackage(packageIdentifier: string): Promise<PurchaseResult> {
  if (!isNative) return { success: false, error: new Error('Purchases only on native') };
  const apiKey = getApiKey();
  if (!apiKey || !initialized) {
    return { success: false, error: new Error('RevenueCat not configured or not initialized') };
  }
  try {
    const Purchases = (await import('react-native-purchases')).default;
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    if (!current) return { success: false, error: new Error('No offering available') };
    const pkg = current.availablePackages.find(
      (p: { identifier: string }) => p.identifier === packageIdentifier
    );
    if (!pkg) {
      return {
        success: false,
        error: new Error(`Package "${packageIdentifier}" not found. Check RevenueCat dashboard.`),
      };
    }
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const active = (customerInfo as CustomerInfo)?.entitlements?.active;
    const expirationDate =
      active?.[KHEIA_PRO_ENTITLEMENT_ID]?.expirationDate ??
      (active && Object.values(active)[0]?.expirationDate) ??
      null;
    return { success: true, customerInfo: { expirationDate } };
  } catch (e: unknown) {
    return { success: false, error: e };
  }
}

/** Present RevenueCat Paywall (requires react-native-purchases-ui). */
export type PaywallResult = 'NOT_PRESENTED' | 'CANCELLED' | 'PURCHASED' | 'RESTORED' | 'ERROR';

export async function presentPaywall(): Promise<PaywallResult> {
  if (!isNative || !isRevenueCatConfigured()) return 'ERROR';
  try {
    const RevenueCatUI = (await import('react-native-purchases-ui')).default;
    const result = await RevenueCatUI.presentPaywall();
    return (result?.toString?.() ?? result) as PaywallResult;
  } catch (e) {
    console.warn('[Purchases] presentPaywall failed', e);
    return 'ERROR';
  }
}

/** Present paywall only if user does not have KheIA Pro. Returns whether paywall was shown and result. */
export async function presentPaywallIfNeeded(): Promise<{ presented: boolean; result: PaywallResult }> {
  if (!isNative || !isRevenueCatConfigured()) return { presented: false, result: 'ERROR' };
  try {
    const RevenueCatUI = (await import('react-native-purchases-ui')).default;
    const result = await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: KHEIA_PRO_ENTITLEMENT_ID,
    });
    const presented = result?.toString?.() !== 'NOT_PRESENTED';
    return { presented, result: (result?.toString?.() ?? result) as PaywallResult };
  } catch (e) {
    console.warn('[Purchases] presentPaywallIfNeeded failed', e);
    return { presented: false, result: 'ERROR' };
  }
}

/** Present RevenueCat Customer Center (manage subscription, restore). */
export async function presentCustomerCenter(): Promise<void> {
  if (!isNative || !isRevenueCatConfigured()) return;
  try {
    const RevenueCatUI = (await import('react-native-purchases-ui')).default;
    await RevenueCatUI.presentCustomerCenter();
  } catch (e) {
    console.warn('[Purchases] presentCustomerCenter failed', e);
  }
}
