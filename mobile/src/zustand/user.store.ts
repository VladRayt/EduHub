import { create } from 'zustand';

import { OrganizationUser, User } from '../mobile-types/front-types';

interface IUserStore {
  user: User | null;
  organizationUser: OrganizationUser | null;
  error: string | null;
  setUser: (user: User) => void;
  setOrganizationUser: (organizationUser: OrganizationUser) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

//sign in -> set user
//open workspace -> load details -> set organization user

export const useUserStore = create<IUserStore>((set) => ({
  user: null,
  error: null,
  organizationUser: null,
  setUser: (user) => set({ user, error: null }),
  setOrganizationUser: (organizationUser) => set({ organizationUser, error: null }),
  setError: (error) => set({ error }),
  clear: () => set({ user: null, organizationUser: null, error: null }),
}));
