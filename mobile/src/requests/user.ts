import { useEffect } from 'react';

import { RouterInputs, trpc } from '@requests/RequestContext';
import { skipToken } from '@tanstack/react-query';
import { useAuthStore } from '@zustand/auth.store';
import { useUserStore } from '@zustand/user.store';

export const useUserDetails = () => {
  const userId = useAuthStore((state) => state.userId);
  const setUser = useUserStore((state) => state.setUser);
  const setError = useUserStore((state) => state.setError);

  const { data, isFetching, isError, refetch, status } = trpc.user.getUserById.useQuery(
    userId
      ? {
          id: userId,
        }
      : skipToken
  );

  useEffect(() => {
    if (status === 'error') {
      setError('Something went wrong.');
    } else if (status === 'success') {
      if (data.error) {
        setError(data.error);
      } else if (data.data) {
        setUser(data.data);
      }
    }
  }, [isFetching]);

  return { refetch, isLoading: isFetching, isError };
};

export const useUpdateUserName = () => {
  const setUser = useUserStore((state) => state.setUser); // Get setUser from the store
  const setError = useUserStore((state) => state.setError); // Get setError from the store

  const { mutateAsync, isPending, isError } = trpc.user.updateUserName.useMutation(); // Assuming the mutation key is 'user.signIn'

  const updateName = async (input: RouterInputs['user']['updateUserName']) => {
    try {
      const result = await mutateAsync(input);
      if (result.error) {
        throw new Error(result.error);
      } else if (result.data) {
        setUser(result.data);
      }
    } catch (error: any) {
      setError(typeof error === 'string' ? error : error.message);
    }
  };

  return { updateName, isLoading: isPending, isError };
};
