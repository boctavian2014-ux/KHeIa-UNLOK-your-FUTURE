import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_LEGAL_ACCEPTED = 'legal_consent_accepted';

export async function getLegalConsentAccepted(): Promise<boolean> {
  try {
    const v = await AsyncStorage.getItem(KEY_LEGAL_ACCEPTED);
    return v === 'true';
  } catch {
    return false;
  }
}

export async function setLegalConsentAccepted(): Promise<void> {
  await AsyncStorage.setItem(KEY_LEGAL_ACCEPTED, 'true');
}
