import { create } from 'zustand';
import { Nt4Manager } from '../util/nt4-manager';

export enum ScoreAssistGoalType {
  CORAL = 1,
  ALGAE = 2,
  CAGE = 3,
  PROCESSOR = 4,
  BARGE = 5,
}

export type ScoreAssistAddress = {
  type: ScoreAssistGoalType;
  level: number;
  index: number;
};

interface ReefState {
  currentTarget: ScoreAssistAddress | null;
  lastGotoPublished: string;
  connected: boolean;
  address: string;

  // Actions
  setCurrentTarget: (target: ScoreAssistAddress | null) => void;
  setLevel: (level: number) => void;
  updateTarget: (target: Partial<ScoreAssistAddress>) => void;
  setConnected: (connected: boolean) => void;
  setAddress: (address: string) => void;
}

// This lets us accept an NT4 manager during store initialization for testing/mocking
export const createReefStore = (nt4manager: Nt4Manager) =>
  create<ReefState>((set, get) => ({
    currentTarget: null,
    lastGotoPublished: 'none',
    connected: nt4manager.connected,
    address: nt4manager.address,

    setCurrentTarget: (target: ScoreAssistAddress | null) => {
      console.log('setCurrentTarget', target);
      if (!target) {
        nt4manager.publishNewGoTo('none');
        set({ currentTarget: null, lastGotoPublished: 'none' });
        return;
      }

      const gotoString = `${target.type},${target.index},${target.level}`;
      nt4manager.publishNewGoTo(gotoString);
      set({
        currentTarget: target,
        lastGotoPublished: gotoString,
      });
    },

    updateTarget: (target: Partial<ScoreAssistAddress>) => {
      const currentTarget = get().currentTarget;
      const setCurrentTarget = get().setCurrentTarget;

      if (!currentTarget) {
        setCurrentTarget(null);
      } else {
        setCurrentTarget({ ...currentTarget, ...target });
      }
    },

    setLevel: (level: number) => {
      const currentTarget = get().currentTarget;
      const setCurrentTarget = get().setCurrentTarget;

      if (!currentTarget) {
        setCurrentTarget(null);
      } else {
        setCurrentTarget({ ...currentTarget, level });
      }
    },

    setConnected: (connected: boolean) => set({ connected }),
    setAddress: (address: string) => set({ address }),
  }));
