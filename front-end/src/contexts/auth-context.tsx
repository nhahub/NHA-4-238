// src/contexts/auth-context.tsx
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { AuthUser, LoginRequest, LoginResponseDto } from "@/types/auth";
import {
  getStoredUser,
  setSession,
  clearSession,
  updateStoredUser,
  isExpired,
} from "@/lib/auth-storage";
import { apiJson } from "@/lib/api/client";
import { memberApi } from "@/lib/api/endpoints/member";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (credentials: LoginRequest, rememberMe: boolean) => Promise<AuthUser>;
  register: (formData: FormData) => Promise<AuthUser>;
  refreshUser: (patch: Partial<AuthUser>) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (isExpired()) {
      clearSession();
      setUser(null);
    } else {
      setUser(getStoredUser());
    }
    setIsHydrated(true);
  }, []);
  const login = useCallback(async (credentials: LoginRequest, rememberMe: boolean) => {
    const dto = await apiJson<LoginResponseDto>("/api/Account/Login", "POST", credentials);
    setSession(dto, rememberMe);
    const storedUser = getStoredUser();
    if (!storedUser) throw new Error("Failed to establish session.");
    setUser(storedUser);
    return storedUser;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const register = useCallback(async (formData: FormData) => {
    const dto = await memberApi.create(formData);
    setSession(dto, true); // new registrations are remembered by default
    const storedUser = getStoredUser();
    if (!storedUser) throw new Error("Failed to establish session.");
    setUser(storedUser);
    return storedUser;
  }, []);

  const refreshUser = useCallback((patch: Partial<AuthUser>) => {
    const updated = updateStoredUser(patch);
    if (updated) setUser(updated);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isHydrated, login, register, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
