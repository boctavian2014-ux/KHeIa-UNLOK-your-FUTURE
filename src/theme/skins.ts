import type { ImageSourcePropType } from 'react-native';

export type SkinName = 'classic' | 'kheia' | 'dark-space';

export type SkinConfig = {
  name: SkinName;
  label: string;
  backgroundImage: ImageSourcePropType;
  primaryColor: string;
};

export const SKINS: Record<SkinName, SkinConfig> = {
  classic: {
    name: 'classic',
    label: 'Clasic',
    backgroundImage: require('../../assets/BECKGROUND.png'),
    primaryColor: '#4F46E5',
  },
  kheia: {
    name: 'kheia',
    label: 'KhEIa',
    backgroundImage: require('../../assets/Kheya_bg_v2.png'),
    primaryColor: '#7C3AED',
  },
  'dark-space': {
    name: 'dark-space',
    label: 'Spațiu întunecat',
    backgroundImage: require('../../assets/kheia beckground.png'),
    primaryColor: '#0F172A',
  },
};
