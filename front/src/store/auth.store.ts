import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { StateCreator, create } from 'zustand';
import { PersistOptions, StateStorage, createJSONStorage, persist } from 'zustand/middleware';

interface IAuthStore {
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUserId: (id: string) => void;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  clear: () => void;
}

interface IAuthDataStore {
  name: string | null;
  code: string | null;
  email: string | null;
  password: string | null;
  setEmail: (email: string) => void;
  setName: (name: string) => void;
  setCode: (code: string) => void;
  setPassword: (password: string) => void;
  clear: () => void;
}

const authStorage: StateStorage = {
  setItem: (name, value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(name, value);
    }
    setCookie(name, value);
  },
  getItem: (name) => {
    if (typeof window !== 'undefined') {
      const value = localStorage.getItem(name);
      return value;
    }
    return getCookie(name) ?? null;
  },
  removeItem: (name) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(name);
    }
    deleteCookie(name);
  },
};

type MyPersist = (
  config: StateCreator<IAuthStore>,
  options: PersistOptions<IAuthStore>
) => StateCreator<IAuthStore>;

export const useAuthStore = create<IAuthStore>(
  (persist as MyPersist)(
    (set) => ({
      userId: null,
      accessToken: null,
      refreshToken: null,
      setAccessToken: (token: string) => set({ accessToken: token }),
      setRefreshToken: (token: string) => set({ refreshToken: token }),
      setUserId: (id: string) => set({ userId: id }),
      clear: () => {
        authStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => authStorage),
      skipHydration: true,
    }
  )
);
const initialState = {
  name: null,
  code: null,
  email: null,
  password: null,
};

export const useAuthDataStore = create<IAuthDataStore>((set) => ({
  ...initialState,
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setName: (name) => set({ name }),
  setCode: (code) => set({ code }),
  clear: () => set({ ...initialState }),
}));
