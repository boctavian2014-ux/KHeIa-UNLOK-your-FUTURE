export type GeneratorState = {
  isLoading: boolean;
  error: string | null;
};

export const generatorStore: GeneratorState = {
  isLoading: false,
  error: null,
};
