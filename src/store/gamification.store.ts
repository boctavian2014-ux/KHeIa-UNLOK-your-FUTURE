export type GamificationState = {
  xp: number;
  streak: number;
  level: number;
};

export const gamificationStore: GamificationState = {
  xp: 0,
  streak: 0,
  level: 1,
};
