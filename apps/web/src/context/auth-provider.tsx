"use client";

import type { User } from "@/types";
import React from "react";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = React.createContext<AuthState>(initialState);

const AuthProvider = ({
  children,
  isAuthenticated,
  user,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
  user: User;
}) => {
  return (
    <AuthContext.Provider
      value={{ ...initialState, isAuthenticated, user, isLoading: false }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
