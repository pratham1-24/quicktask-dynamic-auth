
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User, AuthState } from "@/types";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("quickTaskUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (e) {
        localStorage.removeItem("quickTaskUser");
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Mock authentication functions
  const login = async (email: string, password: string) => {
    // Simulate API call
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // For demo purposes, any credentials will work
    const user: User = {
      id: "user_" + Math.random().toString(36).substring(2, 9),
      email,
      name: email.split('@')[0],
    };
    
    localStorage.setItem("quickTaskUser", JSON.stringify(user));
    
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const signup = async (email: string, password: string, name: string) => {
    // Simulate API call
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const user: User = {
      id: "user_" + Math.random().toString(36).substring(2, 9),
      email,
      name,
    };
    
    localStorage.setItem("quickTaskUser", JSON.stringify(user));
    
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem("quickTaskUser");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
