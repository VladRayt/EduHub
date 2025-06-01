import { useEffect } from 'react';

import { useAuthStore } from '@store/auth.store';
import { useUserStore } from '@store/user.store';

import { RouterInputs, frontClient } from './trpc/client';

export const useUserDetails = () => {
  const userId = useAuthStore((state) => state.userId);

  const { setUser, setError } = useUserStore((state) => ({
    setUser: state.setUser,
    setError: state.setError,
  }));
  const { data, isFetching, isError, refetch, status } = frontClient.user.getUserById.useQuery({
    id: userId as string,
  });

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
  const { setUser, setError } = useUserStore((state) => ({
    setUser: state.setUser,
    setError: state.setError,
  }));

  const { mutateAsync, isPending, isError } = frontClient.user.updateUserName.useMutation();

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
