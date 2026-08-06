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
  SessionComplete: { task: string; durationMinutes: number };
};

export type MainTabParamList = {
  Home: undefined;
  History: undefined;
  NewFocus: undefined;
  Statistics: undefined;
  Badges: undefined;
  Profile: undefined;
};
