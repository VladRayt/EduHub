import { cookies } from 'next/headers';

export const cookiesStore = () => {
  const authDataJSON = cookies().get('auth-storage')?.value ?? '{"state":{}}';
  const parsedData = JSON.parse(authDataJSON);

  return {
    getItem: (key: string) => parsedData.state[key] ?? null,
    setItem: (key: string, value: string) => {
      if (!key || !value) return;
      cookies().set({
        name: 'auth-storage',
        value: JSON.stringify({ ...parsedData, state: { ...parsedData.state, [key]: value } }),
      });
    },
    deleteItem: (key: string) => {
      const parsedStateCopy = { ...parsedData.state };
      delete parsedStateCopy[key];
      cookies().set({
        name: 'auth-storage',
        value: JSON.stringify({ ...parsedData, state: parsedStateCopy }),
      });
    },
  };
};
