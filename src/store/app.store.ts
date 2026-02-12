export type AppState = {
  isOnline: boolean;
  theme: 'light' | 'dark';
};

export const appStore: AppState = {
  isOnline: true,
  theme: 'light',
};
