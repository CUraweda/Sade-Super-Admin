import create, { SetState } from "zustand";
import { LoginProps } from "./utils";

const SetCookies = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};

const GetCookies = (name: string) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const DeleteCookies = (name: string) => {
  document.cookie = name + "=; Max-Age=-99999999;";
};

const LoginStore = create<LoginProps>((set: SetState<LoginProps>) => ({
  token: GetCookies("token"),
  setToken: (token) => {
    if (token) {
      SetCookies("token", token, 2);
    } else {
      DeleteCookies("token");
    }
    set({ token });
  },
  removeToken: () => {
    DeleteCookies("token");
    set({ token: null });
  },

  role: GetCookies("role"),
  setRole: (role) => {
    if (role) {
      SetCookies("role", role, 2);
    } else {
      DeleteCookies("role");
    }
    set({ role });
  },
  id: GetCookies("id"),
  setId: (id) => {
    if (id) {
      SetCookies("id", id, 2);
    } else {
      DeleteCookies("id");
    }
    set({ id });
  },
}));

export { LoginStore };
