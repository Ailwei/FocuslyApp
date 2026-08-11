import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Badge, FocusSession, Stats, UserProfile } from '@/types/models';
import { useAuth } from '@/context/AuthContext';
import { useBadges } from '@/context/BadgeContext';
import { fetchProfile, fetchSessions, insertSession } from '@/api/focusService';
import { DistractionEvent } from '@/hooks/useDistractionDetector';
import {
  startFocusForegroundService,
  startFocusTickTask,
  stopFocusTickTask,
  stopFocusForegroundService,
} from '@/utils/foregroundService';

interface ActiveSession {
  task: string;
  durationMinutes: number;
  totalSeconds: number;
  remainingSeconds: number;
  isPaused: boolean;
  startedAt: string;
  status: 'running' | 'completed';
}

interface FocusContextValue {
  profile: UserProfile | null;
  sessions: FocusSession[];
  stats: Stats;
  isLoading: boolean;
  activeSession: ActiveSession | null;
  clearCompletedSession: () => void;
  
  addSession: (
    task: string,
    durationMinutes: number,
    distractions?: DistractionEvent[]
  ) => Promise<Badge[]>;
startSession: (task: string, durationMinutes: number) => Promise<string>;  pauseSession: () => void;
  resumeSession: () => void;
  cancelSession: () => Promise<{ task: string; elapsedMinutes: number; startedAt: string } | null>;
  recordDistraction: (event: DistractionEvent) => void;
}

const FocusContext = createContext<FocusContextValue | undefined>(undefined);

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { badges, refreshBadges } = useBadges();
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);

  const endTimestampRef = useRef<number | null>(null);
  const distractionsRef = useRef<DistractionEvent[]>([]);
  
  const sessionMetaRef = useRef<{ task: string; durationMinutes: number; startedAt: string } | null>(null);
const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    const loadBackendData = async () => {
      if (!user) {
        setProfile(null);
        setSessions([]);
        return;
      }

      setIsLoading(true);
      try {
        const profileData = await fetchProfile(user.id);

        setProfile({
          id: user.id,
          name: profileData?.name ?? user?.name ?? user.email,
          email: profileData?.email ?? user.email,
          memberSince: profileData?.member_since,
        });

        const sessionRows = await fetchSessions(user.id);
        setSessions(
          Array.isArray(sessionRows)
            ? sessionRows.map((row: any) => ({
                id: row.id,
                task: row.task,
                durationMinutes: row.duration_minutes,
                completedAt: row.completed_at,
              }))
            : [],
        );
      } catch (error) {
        console.warn('Unable to load focus data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBackendData();
  }, [user]);

  const addSession = useCallback(
    async (
      task: string,
      durationMinutes: number,
      distractions: DistractionEvent[] = []
    ): Promise<Badge[]> => {
      const newSession: FocusSession = {
        id: Date.now().toString(),
        task,
        durationMinutes,
        completedAt: new Date().toISOString(),
      };

      setSessions((prev) => [newSession, ...prev]);

      if (!user) {
        return [];
      }

      try {
        const session = await insertSession(
          user.id,
          task,
          durationMinutes,
          newSession.completedAt,
          distractions,
        );

        if (session?.id) {
          setSessions((prev) =>
            prev.map((s) => (s.id === newSession.id ? { ...s, id: session.id } : s))
          );
        }

        const previouslyUnlockedIds = new Set(
          badges.filter((b: Badge) => b.unlocked).map((b: Badge) => b.id)
        );

        const refreshedBadges: Badge[] = await refreshBadges();

        return refreshedBadges.filter(
          (badge) => badge.unlocked && !previouslyUnlockedIds.has(badge.id)
        );
      } catch (error) {
        console.error('insertSession failed', error);
        return [];
      }
    },
    [user, badges, refreshBadges]
  );

  const completeSession = useCallback(async () => {
  console.log('[Focus] SESSION COMPLETED');

  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }

  stopFocusTickTask();

  await stopFocusForegroundService().catch(() => {});

  endTimestampRef.current = null;

  setActiveSession((prev) =>
    prev
      ? {
          ...prev,
          remainingSeconds: 0,
          status: 'completed',
        }
      : prev
  );
}, []);

const runTickTask = useCallback(
  (endTimestamp: number) => {
    endTimestampRef.current = endTimestamp;

    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil((endTimestamp - Date.now()) / 1000)
      );

      setActiveSession((prev) =>
        prev
          ? {
              ...prev,
              remainingSeconds: remaining,
            }
          : prev
      );

      if (remaining <= 0) {
        completeSession();
      }
    };

    tick();

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(tick, 1000);

    startFocusTickTask(
      endTimestamp,
      (remaining) => {
        setActiveSession((prev) =>
          prev
            ? {
                ...prev,
                remainingSeconds: remaining,
              }
            : prev
        );
      },
      () => {
        completeSession();
      }
    );
  },
  [completeSession]
);

const startSession = useCallback(
  async (task: string, durationMinutes: number): Promise<string> => {
    const totalSeconds = durationMinutes * 60;
    const endTimestamp = Date.now() + totalSeconds * 1000;
    const startedAt = new Date().toISOString();

    distractionsRef.current = [];
    sessionMetaRef.current = {
      task,
      durationMinutes,
      startedAt,
    };
    endTimestampRef.current = endTimestamp;

    setActiveSession({
      task,
      durationMinutes,
      totalSeconds,
      remainingSeconds: totalSeconds,
      isPaused: false,
      startedAt,
      status: 'running',
    });

    await startFocusForegroundService(totalSeconds);
    runTickTask(endTimestamp);

    return startedAt;
  },
  [runTickTask]
);
  const pauseSession = useCallback(() => {
  setActiveSession((prev) => {
    if (!prev || prev.isPaused) return prev;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    stopFocusTickTask();

    return {
      ...prev,
      isPaused: true,
    };
  });
}, []);

  const resumeSession = useCallback(() => {
    setActiveSession((prev) => {
      if (!prev || !prev.isPaused) return prev;
      const endTimestamp = Date.now() + prev.remainingSeconds * 1000;
      endTimestampRef.current = endTimestamp;
      runTickTask(endTimestamp);
      return { ...prev, isPaused: false };
    });
  }, [runTickTask]);

  const clearCompletedSession = useCallback(() => {
  setActiveSession(null);
  sessionMetaRef.current = null;
  distractionsRef.current = [];
}, []);

  const cancelSession = useCallback(async () => {
    const meta = sessionMetaRef.current;
    const current = activeSession;

    stopFocusTickTask();
    await stopFocusForegroundService();
    setActiveSession(null);
    endTimestampRef.current = null;
    sessionMetaRef.current = null;
    distractionsRef.current = [];

    if (timerRef.current) {
  clearInterval(timerRef.current);
  timerRef.current = null;
}
    if (!meta || !current) return null;

    const elapsedSeconds = current.totalSeconds - current.remainingSeconds;
    return {
      task: meta.task,
      elapsedMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      startedAt: meta.startedAt,
    };
  }, [activeSession]);

  const recordDistraction = useCallback((event: DistractionEvent) => {
    distractionsRef.current = [...distractionsRef.current, event];
  }, []);

  useEffect(() => {
    if (!activeSession) {
      stopFocusForegroundService().catch(() => {});
    }
  }, []);

  useEffect(() => {
  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    stopFocusTickTask();
  };
}, []);
  const stats: Stats = useMemo(() => {
    const totalSessions = sessions.length;
    const totalFocusMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const averageSessionMinutes = totalSessions > 0 ? Math.round(totalFocusMinutes / totalSessions) : 0;
    const longestSessionMinutes = sessions.reduce((max, s) => Math.max(max, s.durationMinutes), 0);
    return { totalSessions, totalFocusMinutes, averageSessionMinutes, longestSessionMinutes };
  }, [sessions]);

  return (
    <FocusContext.Provider
      value={{
        profile,
        sessions,
        stats,
        isLoading,
        activeSession,
        addSession,
        startSession,
        pauseSession,
        resumeSession,
        cancelSession,
        recordDistraction,
        clearCompletedSession,
      }}
    >
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = (): FocusContextValue => {
  const ctx = useContext(FocusContext);
  if (!ctx) throw new Error('useFocus must be used within a FocusProvider');
  return ctx;
};