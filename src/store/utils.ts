export interface LoginProps {
    token: string | null;
    setToken: (token: string | null) => void;
    removeToken: () => void;
  
    role: string | null;
    setRole: (role: string | null) => void;
  }