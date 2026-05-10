import { useState, useRef, useEffect, useCallback } from 'react';
import { emulator } from '../runtime/emulator/v86';

export function useTelemetry(isRunning: boolean) {
  const [uptime, setUptime] = useState(0);
  const uptimeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      uptimeIntervalRef.current = window.setInterval(() => setUptime(u => u + 1), 1000);
    } else {
      if (uptimeIntervalRef.current) clearInterval(uptimeIntervalRef.current);
    }
    return () => {
      if (uptimeIntervalRef.current) clearInterval(uptimeIntervalRef.current);
    };
  }, [isRunning]);

  const getEmulatorStats = useCallback(() => {
    return emulator.getInstructionStats();
  }, []);

  const resetUptime = useCallback(() => setUptime(0), []);

  return { uptime, getEmulatorStats, resetUptime };
}
