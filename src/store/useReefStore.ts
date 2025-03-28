import { useFrame } from '@react-three/fiber';
import { useContext, useEffect, useState } from 'react';
import { NT4Context } from '../util/nt4-manager';
import { createReefStore } from './reefStore';

// Singleton store instance for global state
let storeInstance: ReturnType<typeof createReefStore> | null = null;

export const useReefStore = () => {
  const nt4manager = useContext(NT4Context);

  // Create store if it doesn't exist yet
  if (!storeInstance) {
    storeInstance = createReefStore(nt4manager);
  }

  const store = storeInstance;

  // Subscribe to NT4 connection changes
  useEffect(() => {
    const unsubscribe = nt4manager.onConnectionChange((connected) => {
      store.getState().setConnected(connected);
      store.getState().setAddress(nt4manager.address);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [nt4manager, store]);

  return store;
};

// Create a shared animation factor to avoid redundant calculations
export const useAnimationFactor = () => {
  const [factor, setFactor] = useState(1);

  // Only run one animation frame handler for all branches
  useFrame(() => {
    const pulseFactor = Math.sin(Date.now() * 0.01) * 0.2 + 1.2;
    setFactor(pulseFactor);
  });

  return factor;
};
