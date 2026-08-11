import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { NativeModules } from 'react-native';
const { UsageStatsModule } = NativeModules;

export interface DistractionEvent {
  id: string;
  leftAt: string;
  returnedAt: string | null;
  durationSeconds: number | null;
  appName: string | null;
  packageName: string | null;
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
  const isActiveRef = useRef(isActive);
  const onDistractionRef = useRef(onDistraction);

  const pendingLeave = useRef<{
    id: string;
    leftAt: string;
  } | null>(null);

  useEffect(() => {
    isActiveRef.current = isActive;

    console.log(
      '[Distraction] isActive =',
      isActive
    );
  }, [isActive]);

  useEffect(() => {
    onDistractionRef.current = onDistraction;
  }, [onDistraction]);

  const reset = useCallback(() => {
    setDistractions([]);
    pendingLeave.current = null;
  }, []);

  useEffect(() => {
    console.log(
      '[Distraction] Listener registered. Current state:',
      AppState.currentState
    );

    const subscription = AppState.addEventListener(
      'change',
      async (nextState) => {
        const previousState = appState.current;

        console.log(
          '[Distraction] STATE:',
          previousState,
          '→',
          nextState,
          '| active:',
          isActiveRef.current
        );

        appState.current = nextState;

        if (!isActiveRef.current) {
          console.log(
            '[Distraction] Ignored — no active session'
          );
          return;
        }

        const leftFocusly =
          previousState === 'active' &&
          (nextState === 'background' ||
            nextState === 'inactive');

        const returnedToFocusly =
          (previousState === 'background' ||
            previousState === 'inactive') &&
          nextState === 'active';

        if (leftFocusly) {
          const leftAt = new Date().toISOString();

          pendingLeave.current = {
            id: `${Date.now()}`,
            leftAt,
          };

          console.log(
            '[Distraction] LEFT FOCUSLY:',
            leftAt
          );
        }

        if (returnedToFocusly) {
          const pending = pendingLeave.current;

          if (!pending) {
            console.log(
              '[Distraction] Returned, but no pending leave!'
            );
            return;
          }

          const returnedAt = new Date().toISOString();

          const durationSeconds = Math.max(
            0,
            Math.round(
              (Date.parse(returnedAt) -
                Date.parse(pending.leftAt)) /
                1000
            )
          );
let apps: any[] = [];

try {
  if (UsageStatsModule?.getAppsUsedBetween) {
    const result = await UsageStatsModule.getAppsUsedBetween(
      pending.leftAt,
      returnedAt
    );

    console.log('[Distraction] APPS USED:', result);

    if (Array.isArray(result)) {
      apps = result;
    }
  }
} catch (error) {
  console.warn(
    '[Distraction] Failed to identify apps:',
    error
  );
}

const filteredApps = apps.filter(
  (app: any) =>
    app?.packageName &&
    app.packageName !== 'com.focusly.app' &&
    app.packageName !== 'com.google.android.apps.nexuslauncher'
);

console.log(
  '[Distraction] FILTERED APPS:',
  filteredApps
);

if (filteredApps.length === 0) {
  const event: DistractionEvent = {
    id: pending.id,
    leftAt: pending.leftAt,
    returnedAt,
    durationSeconds,
    appName: null,
    packageName: null,
  };

  setDistractions((previous) => [
    ...previous,
    event,
  ]);

  onDistractionRef.current?.(event);
} else {
  const events: DistractionEvent[] = filteredApps.map(
    (app: any, index: number) => ({
      id: `${pending.id}-${index}`,
      leftAt: pending.leftAt,
      returnedAt,
      durationSeconds,
      appName: app.appName ?? null,
      packageName: app.packageName ?? null,
    })
  );

  console.log(
    '[Distraction] EVENTS CREATED:',
    events
  );

  setDistractions((previous) => [
    ...previous,
    ...events,
  ]);

   events.forEach((event) => {
    onDistractionRef.current?.(event);
  });
}

pendingLeave.current = null;
        }
      }
    );

    return () => {
      console.log(
        '[Distraction] Listener removed'
      );

      subscription.remove();
    };
  }, []);

  return {
    distractions,
    distractionCount: distractions.length,
    reset,
  };
}