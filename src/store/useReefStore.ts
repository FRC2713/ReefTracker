import { useContext, useEffect } from 'react';
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
