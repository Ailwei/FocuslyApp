import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Badge, FocusSession, Stats, UserProfile } from '@/types/models';
import { useAuth } from '@/context/AuthContext';
import { useBadges } from '@/context/BadgeContext';
import { fetchProfile, fetchSessions, insertSession } from '@/api/focusService';
import { DistractionEvent } from '@/hooks/useDistractionDetector';

interface FocusContextValue {
  profile: UserProfile | null;
  sessions: FocusSession[];
  stats: Stats;
  isLoading: boolean;
  addSession: (
    task: string,
    durationMinutes: number,
    distractions?: DistractionEvent[]
  ) => Promise<Badge[]>;
}

const FocusContext = createContext<FocusContextValue | undefined>(undefined);

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { badges, refreshBadges } = useBadges();
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
console.log('PROFILE DATA:', profileData);
console.log('MEMBER SINCE:', profileData?.member_since);
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
            prev.map((s) =>
              s.id === newSession.id
                ? { ...s, id: session.id }
                : s
            )
          );
        }

        const previouslyUnlockedIds = new Set(
          badges.filter((b: Badge) => b.unlocked).map((b: Badge) => b.id)
        );

        const refreshedBadges: Badge[] = await refreshBadges();

        const newlyUnlocked = refreshedBadges.filter(
          (badge) => badge.unlocked && !previouslyUnlockedIds.has(badge.id)
        );

        return newlyUnlocked;
      } catch (error) {
        console.error('insertSession failed', error);
        return [];
      }
    },
    [user, badges, refreshBadges]
  );

  const stats: Stats = useMemo(() => {
    const totalSessions = sessions.length;
    const totalFocusMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const averageSessionMinutes = totalSessions > 0 ? Math.round(totalFocusMinutes / totalSessions) : 0;
    const longestSessionMinutes = sessions.reduce((max, s) => Math.max(max, s.durationMinutes), 0);
    return { totalSessions, totalFocusMinutes, averageSessionMinutes, longestSessionMinutes };
  }, [sessions]);

  return (
    <FocusContext.Provider value={{ profile, sessions, stats, isLoading, addSession }}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = (): FocusContextValue => {
  const ctx = useContext(FocusContext);
  if (!ctx) throw new Error('useFocus must be used within a FocusProvider');
  return ctx;
};