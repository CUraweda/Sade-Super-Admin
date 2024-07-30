export interface LoginProps {
  token: string | null;
  setToken: (token: string | null) => void;
  setId: (token: string | null) => void;
  removeToken: () => void;

  id: string | null;
  role: string | null;
  setRole: (role: string | null) => void;
}
