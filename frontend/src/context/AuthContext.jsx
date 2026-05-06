import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  fetchMe,
  loginRequest,
  registerRequest,
} from "../services/authService.js";
import { clearToken, getToken, setToken } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  const bootstrap = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setStatus("unauthenticated");
      return;
    }
    try {
      const me = await fetchMe();
      setUser(me);
      setStatus("authenticated");
    } catch {
      clearToken();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const persistAuth = useCallback(({ user: nextUser, token }) => {
    setToken(token);
    setUser(nextUser);
    setStatus("authenticated");
  }, []);

  const login = useCallback(
    async (credentials) => {
      const result = await loginRequest(credentials);
      persistAuth(result);
      return result.user;
    },
    [persistAuth]
  );

  const register = useCallback(
    async (payload) => {
      const result = await registerRequest(payload);
      persistAuth(result);
      return result.user;
    },
    [persistAuth]
  );



  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
      login,
      register,
      logout,
      refresh: bootstrap,
    }),
    [user, status, login, register, logout, bootstrap]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}
