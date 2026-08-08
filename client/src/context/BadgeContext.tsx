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

const BadgeContext = createContext<any>(null);

export const BadgeProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {

  const { user } = useAuth();

  const [badges, setBadges] = useState<Badge[]>([]);

  const refreshBadges = useCallback(async () => {

    if (!user) return;

    const data = await fetchBadges();

    setBadges(data);

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


export const useBadges = () => {
  const ctx = useContext(BadgeContext);

  if (!ctx)
    throw new Error(
      "useBadges must be inside BadgeProvider"
    );

  return ctx;
};