import { get, set } from 'idb-keyval';
import { useCallback, useState, useEffect } from 'react';
import { emulator } from '../runtime/emulator/v86';

export function usePersistence() {
  const [hasSaveState, setHasSaveState] = useState(false);

  useEffect(() => {
    get('v86-save-state').then(val => {
      if (val) setHasSaveState(true);
    });
  }, []);

  const saveState = useCallback(async () => {
    const success = await emulator.saveState();
    if (success) {
      setHasSaveState(true);
      alert('State saved successfully to IndexedDB!');
    }
  }, []);

  return { hasSaveState, saveState };
}
