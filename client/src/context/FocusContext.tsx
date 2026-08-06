import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Badge, FocusSession, Stats, UserProfile } from '@/types/models';
import { useAuth } from '@/context/AuthContext';
import { fetchBadges, fetchProfile, fetchSessions, insertSession } from '@/api/focusService';

interface FocusContextValue {
  profile: UserProfile | null;
  sessions: FocusSession[];
  stats: Stats;
  isLoading: boolean;
  addSession: (task: string, durationMinutes: number) => Promise<Badge[]>;
}

const FocusContext = createContext<FocusContextValue | undefined>(undefined);

export const FocusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadBackendData = async () => {
      if (!user) {
        setProfile(null);
        setSessions([]);
        setBadges([]);
        return;
      }

      setIsLoading(true);
      try {
        const profileData = await fetchProfile(user.id);

        setProfile({
          id: user.id,
          name: profileData?.name ?? user.email,
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

        const badgeRows = await fetchBadges(user.id);
        setBadges(
          Array.isArray(badgeRows)
            ? badgeRows.map((row: any) => ({
                id: row.id,
                title: row.title,
                category: row.category,
                unlocked: row.unlocked,
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
  async (task: string, durationMinutes: number): Promise<Badge[]> => {
    console.log("1. addSession started", { task, durationMinutes });

    const newSession: FocusSession = {
      id: Date.now().toString(),
      task,
      durationMinutes,
      completedAt: new Date().toISOString(),
    };

    setSessions((prev) => [newSession, ...prev]);

    if (!user) {
      console.log("No user found");
      return [];
    }

    try {
      console.log("Calling insertSession");

      const data = await insertSession(
        user.id,
        task,
        durationMinutes,
        newSession.completedAt
      );

      console.log("insertSession returned", data);

      if (data?.session) {
        setSessions((prev) =>
          prev.map((session) =>
            session.id === newSession.id
              ? { ...session, id: data.session.id }
              : session
          )
        );
      }

      // Reload badges after backend checkBadges()
      const badgeRows = await fetchBadges(user.id);

      const refreshedBadges: Badge[] = Array.isArray(badgeRows)
        ? badgeRows.map((row: any) => ({
            id: row.id,
            title: row.title,
            category: row.category,
            unlocked: row.unlocked,
          }))
        : [];

      setBadges(refreshedBadges);

      const newlyUnlocked = refreshedBadges.filter(
        (badge) => badge.unlocked
      );

      console.log("Unlocked badges:", newlyUnlocked);

      return newlyUnlocked;

    } catch (error) {
      console.error("insertSession failed", error);
      return [];
    }
  },
  [user]
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