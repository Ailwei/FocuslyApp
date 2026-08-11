import ReactNativeForegroundService from '@supersami/rn-foreground-service';

const NOTIFICATION_ID = 1001;
const TICK_TASK_ID = 'focus-session-timer';

export const formatRemainingTime = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const secondsRemaining = safeSeconds % 60;
  return `${minutes}:${secondsRemaining.toString().padStart(2, '0')} remaining`;
};

export const startFocusForegroundService = async (remainingSeconds: number) => {
  await ReactNativeForegroundService.start({
    id: NOTIFICATION_ID,
    title: 'Focusly',
    message: formatRemainingTime(remainingSeconds),
    ServiceType: 'dataSync',
    importance: 'high',
    visibility: 'public',
    vibration: false,
    setOnlyAlertOnce: 'true',
  } as any);
};

export const updateFocusNotification = async (remainingSeconds: number) => {
  await ReactNativeForegroundService.update({
    id: NOTIFICATION_ID,
    title: 'Focusly',
    message: formatRemainingTime(remainingSeconds),
    importance: 'high',
    visibility: 'public',
    setOnlyAlertOnce: 'true',
  });
};

export const stopFocusForegroundService = async () => {
  ReactNativeForegroundService.remove_task(TICK_TASK_ID);
  await ReactNativeForegroundService.stop();
};

/**
 * Starts the native tick loop that drives the countdown while backgrounded.
 * onTick fires every second with seconds remaining; onComplete fires once, at 0.
 * endTimestamp is an absolute epoch-ms target (not a duration) to avoid drift.
 */
export const startFocusTickTask = (
  endTimestamp: number,
  onTick: (remainingSeconds: number) => void,
  onComplete: () => void,
) => {
  ReactNativeForegroundService.add_task(
    async () => {
      const remainingMs = endTimestamp - Date.now();
      const remaining = Math.max(0, Math.ceil(remainingMs / 1000));

      await updateFocusNotification(remaining);
      onTick(remaining);

      if (remaining <= 0) {
        ReactNativeForegroundService.remove_task(TICK_TASK_ID);
        onComplete();
      }
    },
    {
      delay: 1000,
      onLoop: true,
      taskId: TICK_TASK_ID,
      onError: (e: any) => console.warn('focus tick task error', e),
    },
  );
};

export const stopFocusTickTask = () => {
  ReactNativeForegroundService.remove_task(TICK_TASK_ID);
};