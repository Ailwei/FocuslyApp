# Focusly (React Native + TypeScript / Expo)

A focus-timer app rebuilt from the provided mockups: auth, dashboard, timed
focus sessions, session-complete + badge unlock, history, badges & stats,
and profile.

## Stack
- Expo SDK 51, React Native 0.74
- TypeScript (strict)
- React Navigation (native-stack + bottom-tabs)
- react-native-svg for the circular countdown timer
- @expo/vector-icons (Ionicons) for the bottom nav + icons
- App state via React Context (`src/context/FocusContext.tsx`) — in-memory only,
  swap in a real API/AsyncStorage layer for persistence

## Structure
```
App.tsx
src/
  screens/        // one file per screen
  navigation/      // Auth stack, Main tab bar, Root stack
  components/      // Screen/Card/Button primitives + custom tab bar
  context/         // FocusContext: sessions, badges, stats
  theme/           // colors, spacing, radius, font sizes
  types/           // navigation + domain model types
```

## Run it
```bash
npm install
npx expo start
```
Then press `i` (iOS simulator), `a` (Android emulator), or scan the QR code
with Expo Go on your phone.

## Flow
Welcome → Login/Register → Dashboard → New Focus Session → Active Session
(circular timer, pause/end) → Session Complete (records session + shows
unlocked badge) → back to Dashboard. History and Badges/Statistics pull from
the same shared session list in `FocusContext`.

## Next steps if you want to keep going
- Wire `FocusContext` to a backend (Firebase/Supabase) or `AsyncStorage` for persistence between app restarts
- Real auth (Firebase Auth, Clerk, etc.) instead of the local `isAuthenticated` flag
- Push notifications for session reminders
- Badge unlock logic driven by actual thresholds instead of static seed data

## Supabase production setup
1. Copy `.env.example` to `.env` and set your Supabase values.
2. Create the `profiles`, `sessions`, and `badges` tables using `supabase-schema.sql`.
3. Run `npm install` and start with `npx expo start`.
4. Use `expo start --no-dev --minify` to test a production-like local build.
