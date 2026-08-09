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

  const refreshBadges = useCallback(async (): Promise<Badge[]> => {

    if (!user) return [];

    const data = await fetchBadges();

    setBadges(data);

    return data;

  }, [user]);


  useEffect(() => {
    refreshBadges();
  }, [refreshBadges]);


  return (
    <BadgeContext.Provider
      value={{
        badges,
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