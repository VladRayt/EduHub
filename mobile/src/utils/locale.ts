import { storage } from '@zustand/auth.store';

export const getLocale = () => {
  return storage.getString('lng') ?? 'en';
};
export const setLocale = (locale: string) => {
  storage.set('lng', locale);
};
export const deleteLocale = () => {
  storage.delete('lng');
};
