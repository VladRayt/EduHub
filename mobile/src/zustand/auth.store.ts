import { MMKV } from 'react-native-mmkv';

import { create } from 'zustand';
import { StateStorage } from 'zustand/middleware';

// const initialState = {
//   refreshToken: '625cc660a2088ac50bb6da0e93f75169c9a755b77953906ef6dea73660cd4f7d',
//   accessToken:
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI3ZjRlODI4Mi0yODgzLTQ5MDctOWVjZi05ODJiNzQ0MmI2ZTAiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNzExOTE3NjUwLCJleHAiOjE3MTQ1MDk2NTB9.HGYV6Wxb5gdySl4cKYryClgy63vW-ROp_959CTnkns4',
// };

interface ITestStore {
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUserId: (id: string) => void;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  clear: () => void;
}

export const storage = new MMKV();

// storage.set('access_token', initialState.accessToken);
// storage.set('userId', '6f89d4f0-4750-4a54-ada4-c23226df53a5');
// storage.set('refresh_token', initialState.refreshToken);

// storage.delete('access_token');
// storage.delete('userId');
// storage.delete('refresh_token');

const authStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.delete(name);
  },
};

export const useAuthStore = create<ITestStore>((set) => ({
  userId: authStorage.getItem('userId') as string,
  accessToken: authStorage.getItem('access_token') as string,
  refreshToken: authStorage.getItem('refresh_token') as string,
  setAccessToken: (token: string) => {
    authStorage.setItem('access_token', token);
    set({ accessToken: token });
  },
  setRefreshToken: (token: string) => {
    authStorage.setItem('refresh_token', token);
    set({ refreshToken: token });
  },
  setUserId: (id: string) => {
    authStorage.setItem('userId', id);
    set({ userId: id });
  },
  clear: () => {
    set({ userId: undefined, refreshToken: undefined, accessToken: undefined });
    authStorage.removeItem('access_token');
    authStorage.removeItem('refresh_token');
    authStorage.removeItem('userId');
  },
}));
