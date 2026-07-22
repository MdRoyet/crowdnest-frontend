"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import api from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  photoURL: string;
  role: string;
  credits: number;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  photoURL?: string;
  role?: string;
}

interface AuthResponse {
  token: string;
  _id: string;
  name: string;
  email: string;
  photoURL: string;
  role: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (userData: RegisterData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user from cookie on mount
  useEffect(() => {
    api
      .getSilent<User>("/auth/me")
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const register = useCallback(async (userData: RegisterData) => {
    await api.post<AuthResponse>("/auth/register", userData);
    setUser(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      photoURL: data.photoURL,
      role: data.role,
      credits: data.credits,
    });
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    const data = await api.post<AuthResponse>("/auth/google", { idToken });
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      photoURL: data.photoURL,
      role: data.role,
      credits: data.credits,
    });
  }, []);

  const logout = useCallback(async () => {
    await api.post("/auth/logout", {});
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
