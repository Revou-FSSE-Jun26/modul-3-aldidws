"use client";


import { useCallback, useEffect, useState } from "react";
import { AuthError, getMe } from "./auth";
import type { User } from "./types";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthState {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  logout: () => void;
}

function readStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "role" in parsed &&
      "email" in parsed
    ) {
      return parsed as User;
    }
    return null;
  } catch {
    return null;
  }
}

function readStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function useAuth(verify = false): AuthState {
  const [token, setToken] = useState<string | null>(readStoredToken);
  const [user, setUser] = useState<User | null>(readStoredUser);
  const [status, setStatus] = useState<AuthStatus>(() => {
    if (typeof window === "undefined") return "loading";
    const storedToken = readStoredToken();
    if (!storedToken) return "unauthenticated";
    // When verification is requested, stay "loading" until the effect
    // confirms the token with the server.
    if (verify) return "loading";
    return readStoredUser() ? "authenticated" : "unauthenticated";
  });

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore storage errors
    }
    setUser(null);
    setToken(null);
    setStatus("unauthenticated");
  }, []);

  useEffect(() => {
    if (!verify) return;

    const storedToken = readStoredToken();
    if (!storedToken) return;

    const storedUser = readStoredUser();

    let cancelled = false;
    getMe(storedToken)
      .then((fresh) => {
        if (cancelled) return;
        setUser(fresh);
        try {
          localStorage.setItem(USER_KEY, JSON.stringify(fresh));
        } catch {
        }
        setStatus("authenticated");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof AuthError && err.status === 401) {
          logout();
        } else {
          setStatus(storedUser ? "authenticated" : "unauthenticated");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [verify, logout]);

  return {
    status,
    user,
    token,
    isAdmin: user?.role === "admin",
    logout,
  };
}
