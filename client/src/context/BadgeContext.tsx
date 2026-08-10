import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from "react";
import { Badge } from "@/types/models";
import { useAuth } from "./AuthContext";
import { fetchBadges } from "@/api/badgeService";

interface BadgeContextValue {
  badges: Badge[];
  loading: boolean;
  error: string | null;
  refreshBadges: () => Promise<Badge[]>;
}

const BadgeContext = createContext<BadgeContextValue | null>(null);

export const BadgeProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {

  const { user } = useAuth();

  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBadges = useCallback(async (): Promise<Badge[]> => {

    if (!user) {
      setBadges([]);
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchBadges();
      setBadges(data);
      return data;
    } catch (err) {
      console.error('Unable to load badges:', err);
      setError(err instanceof Error ? err.message : 'Unable to load badges');
      return [];
    } finally {
      setLoading(false);
    }

  }, [user]);


  useEffect(() => {
    refreshBadges();
  }, [refreshBadges]);


  return (
    <BadgeContext.Provider
      value={{
        badges,
        loading,
        error,
        refreshBadges
      }}
    >
      {children}
    </BadgeContext.Provider>
  );
};


export const useBadges = (): BadgeContextValue => {
  const ctx = useContext(BadgeContext);

  if (!ctx)
    throw new Error(
      "useBadges must be inside BadgeProvider"
    );

  return ctx;
};