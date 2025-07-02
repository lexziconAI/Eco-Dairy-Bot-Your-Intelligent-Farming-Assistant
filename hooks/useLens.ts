import { create } from 'zustand';

export type Lens = 'SES' | 'Chaos' | 'Boje';

interface LensState {
  lens: Lens;
  setLens: (lens: Lens) => void;
}

export const useLens = create<LensState>((set) => ({
  lens: 'SES',
  setLens: (lens) => set({ lens }),
}));