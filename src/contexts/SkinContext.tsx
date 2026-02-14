import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SKINS, type SkinName } from '@/theme/skins';

const STORAGE_KEY = 'app-skin';

type SkinContextValue = {
  skin: SkinName;
  setSkin: (name: SkinName) => Promise<void>;
  skinSource: (typeof SKINS)[SkinName]['backgroundImage'];
};

const SkinContext = createContext<SkinContextValue | null>(null);

const VALID_SKINS: SkinName[] = ['classic', 'kheia', 'dark-space'];

function isValidSkin(s: string): s is SkinName {
  return VALID_SKINS.includes(s as SkinName);
}

export function SkinProvider({ children }: { children: React.ReactNode }) {
  const [skin, setSkinState] = useState<SkinName>('kheia');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (!stored) return;
      if (isValidSkin(stored)) {
        setSkinState(stored);
        return;
      }
      // Migrare de la vechile id-uri
      const migrated: Record<string, SkinName> = {
        beckground: 'classic',
        kheya_v2: 'kheia',
        kheia: 'dark-space',
      };
      const mapped = migrated[stored];
      if (mapped) {
        setSkinState(mapped);
        AsyncStorage.setItem(STORAGE_KEY, mapped);
      }
    });
  }, []);

  const setSkin = useCallback(async (name: SkinName) => {
    setSkinState(name);
    await AsyncStorage.setItem(STORAGE_KEY, name);
  }, []);

  const skinSource = SKINS[skin].backgroundImage;

  return (
    <SkinContext.Provider value={{ skin, setSkin, skinSource }}>
      {children}
    </SkinContext.Provider>
  );
}

export function useSkin() {
  const ctx = useContext(SkinContext);
  if (!ctx) throw new Error('useSkin must be used within SkinProvider');
  return ctx;
}
