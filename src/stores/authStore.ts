import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Listen to Supabase auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth state change:", event, session?.user?.email);
    set({ session, user: session?.user ?? null, loading: false });
  });

  // Initial session check
  supabase.auth.getSession().then(({ data: { session }, error }) => {
    console.log("Initial session check:", session?.user?.email, error);
    set({ session, user: session?.user ?? null, loading: false });
  }).catch((error) => {
    console.error("Error getting session:", error);
    set({ loading: false });
  });

  // Timeout fallback in case loading hangs
  setTimeout(() => {
    if (get().loading) {
      console.log("Auth loading timeout - forcing loading to false");
      set({ loading: false });
    }
  }, 5000);

  return {
    user: null,
    session: null,
    loading: true,
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null });
    },
    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    setLoading: (loading) => set({ loading }),
  };
});
