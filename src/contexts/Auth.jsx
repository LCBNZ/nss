import React, { useState, useEffect, createContext, useContext } from "react";

import supabase from "../api/supabase";

export const Context = createContext();

export function useAuth() {
  return useContext(Context);
}

export const Provider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    const session = await supabase.auth.session();
    setUser(session?.user ?? null);
    setLoading(false);

    const { data: listener } = supabase.auth.onAuthStateChange(async (_, currentSession) => {
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signIn(data),
    signOut: () => supabase.auth.signOut(),
    user,
  };

  return <Context.Provider value={value}>{!loading && children}</Context.Provider>;
};
