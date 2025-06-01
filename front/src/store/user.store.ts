import { create } from 'zustand';

import { OrganizationUser, User } from '@/@types/front';

interface IUserStore {
  user: User | null;
  organizationUser: OrganizationUser | null;
  error: string | null;
  setUser: (user: User) => void;
  setOrganizationUser: (organizationUser: OrganizationUser) => void;
  setError: (error: string) => void;
  clear: () => void;
}

export const useUserStore = create<IUserStore>((set) => ({
  user: null,
  error: null,
  organizationUser: null,
  setUser: (user: User) => set({ user, error: null }),
  setOrganizationUser: (organizationUser: OrganizationUser) =>
    set({ organizationUser, error: null }),
  setError: (error: string) => set({ error }),
  clear: () => set({ user: null, organizationUser: null, error: null }),
}));
