import { supabase } from '@/api/supabaseClient';

export interface AuthUserPayload {
  id: string;
  email: string | null;
  name?: string | null;
}

export const getSessionUser = async (): Promise<AuthUserPayload | null> => {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  return user ? mapUser(user) : null;
};

export const onAuthStateChange = (callback: (user: AuthUserPayload | null) => void) => {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ? mapUser(session.user) : null);
  });
  return () => data.subscription.unsubscribe();
};

export const signIn = async (email: string, password: string): Promise<string | null> => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error?.message ?? null;
};

export const signUp = async (name: string, email: string, password: string): Promise<string | null> => {
  const memberSince = new Date().toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) return error.message;
  if (data.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email,
      name,
      member_since: memberSince,
    });
  }

  await supabase.auth.signOut();

  return null;
};

export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
};

function mapUser(user: any): AuthUserPayload {
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name ?? null,
  };
}
