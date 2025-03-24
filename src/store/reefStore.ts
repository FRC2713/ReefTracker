import { create } from 'zustand';
import { ReefAddress } from '../App';
import { Nt4Manager } from '../util/nt4-manager';

interface ReefState {
  currentTarget: ReefAddress | null;
  lastGotoPublished: string;
  connected: boolean;
  address: string;

  // Actions
  setCurrentTarget: (target: ReefAddress | null) => void;
  setLevel: (level: number) => void;
  updateTarget: (target: Partial<ReefAddress>) => void;
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

    setCurrentTarget: (target: ReefAddress | null) => {
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

    updateTarget: (target: Partial<ReefAddress>) => {
      const currentTarget = get().currentTarget;
      const setCurrentTarget = get().setCurrentTarget;

      if (!currentTarget) {
        setCurrentTarget({ type: 0, index: 0, level: 0 });
      } else {
        setCurrentTarget({ ...currentTarget, ...target });
      }
    },

    setLevel: (level: number) => {
      const currentTarget = get().currentTarget;
      const setCurrentTarget = get().setCurrentTarget;

      if (!currentTarget) {
        setCurrentTarget({ type: 0, index: 0, level });
      } else {
        setCurrentTarget({ ...currentTarget, level });
      }
    },

    setConnected: (connected: boolean) => set({ connected }),
    setAddress: (address: string) => set({ address }),
  }));
