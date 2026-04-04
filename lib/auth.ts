import { supabase } from "@/lib/supabase";
import type { UserRole } from "@/lib/database.types";

export type SignUpParams = {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
};

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

/** Registers the user; `user_metadata` is read by `handle_new_user` → `profiles`. */
export async function signUp({
  email,
  password,
  fullName,
  role,
}: SignUpParams) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}
