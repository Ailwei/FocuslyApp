import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export interface DistractionEvent {
  id: string;
  leftAt: string;     
  returnedAt: string | null;
  durationSeconds: number | null;
}

interface UseDistractionDetectorOptions {
  isActive: boolean;
  onDistraction?: (event: DistractionEvent) => void;
}

export function useDistractionDetector({
  isActive,
  onDistraction,
}: UseDistractionDetectorOptions) {
  const [distractions, setDistractions] = useState<DistractionEvent[]>([]);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const pendingLeave = useRef<{ id: string; leftAt: string } | null>(null);

  const reset = useCallback(() => {
    setDistractions([]);
    pendingLeave.current = null;
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      const prevState = appState.current;
      appState.current = nextState;

      if (!isActive) return;

      const wasForeground = prevState === 'active';
      const nowBackground = nextState === 'background' || nextState === 'inactive';
      const wasBackground = prevState === 'background' || prevState === 'inactive';
      const nowForeground = nextState === 'active';

      if (wasForeground && nowBackground) {
        const id = Date.now().toString();
        pendingLeave.current = { id, leftAt: new Date().toISOString() };
      }

      if (wasBackground && nowForeground && pendingLeave.current) {
        const { id, leftAt } = pendingLeave.current;
        const returnedAt = new Date().toISOString();
        const durationSeconds = Math.round(
          (new Date(returnedAt).getTime() - new Date(leftAt).getTime()) / 1000
        );

        const event: DistractionEvent = { id, leftAt, returnedAt, durationSeconds };

        setDistractions((prev) => [...prev, event]);
        onDistraction?.(event);

        pendingLeave.current = null;
      }
    });

    return () => subscription.remove();
  }, [isActive, onDistraction]);

  return { distractions, distractionCount: distractions.length, reset };
}