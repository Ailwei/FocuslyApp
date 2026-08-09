import { DistractionEvent } from '@/hooks/useDistractionDetector';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  MainTabs: undefined;
  NewSession: undefined;
  ActiveSession: { task: string; durationMinutes: number };
  SessionComplete: {
    task: string;
    durationMinutes: number;
    distractions?: DistractionEvent[];
    sessionStartedAt?: string;
  };
};

export type MainTabParamList = {
  Home: undefined;
  History: undefined;
  NewFocus: undefined;
  Statistics: undefined;
  Badges: undefined;
  Profile: undefined;
};