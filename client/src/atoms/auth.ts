import { AuthUserInfo } from "../api";

export type Credentials = { email: string; password: string };

type AuthHook = {
  user: AuthUserInfo | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
};

export const useAuth = () => {
  // TODO add client-side session management logic here

  return {
    user: null,
    login: async () => {},
    logout: async () => {},
  } as AuthHook;
};
