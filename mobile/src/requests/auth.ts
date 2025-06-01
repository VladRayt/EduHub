import { ResponseStatus } from '../mobile-types/front-types';
import { RouterInputs, trpc } from '@requests/RequestContext';
import { skipToken } from '@tanstack/react-query';
import { useAuthStore } from '@zustand/auth.store';
import { useUserStore } from '@zustand/user.store';

export const useSignIn = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken); // Get setUser from the store
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken); // Get setUser from the store
  const setUserId = useAuthStore((state) => state.setUserId); // Get setUser from the store

  const setUser = useUserStore((state) => state.setUser); // Get setUser from the store
  const setError = useUserStore((state) => state.setError); // Get setError from the store
  const { mutateAsync, isPending, isError } = trpc.user.signIn.useMutation(); // Assuming the mutation key is 'user.signIn'

  const signIn = async (input: RouterInputs['user']['signIn']) => {
    try {
      console.log('input', input);
      const result = await mutateAsync(input);
      console.log('result', result);
      if (result.error) {
        console.log('result.error', result.error);
        throw new Error(result.error);
      } else if (result.data) {
        const { tokens, ...user } = result.data;
        setUser(user);
        setUserId(user.id);
        setAccessToken(tokens.token ?? '');
        setRefreshToken(tokens.userRefreshToken ?? '');
      }
    } catch (error: any) {
      console.log('error', error);
      setError(typeof error === 'string' ? error : error.message);
      return true;
    }
  };

  return { signIn, isLoading: isPending, isError };
};

export const useSignUp = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken); // Get setError from the store
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken); // Get setError from the store

  const setError = useUserStore((state) => state.setError); // Get setError from the store
  const { mutateAsync, isPending, isError } = trpc.user.signUp.useMutation(); // Assuming the mutation key is 'user.signUp'

  const createUser = async (input: RouterInputs['user']['signUp']) => {
    try {
      const result = await mutateAsync(input);
      if (result.error) {
        throw new Error(result.error);
      } else if (
        result.status === ResponseStatus.SUCCESS &&
        result.data?.token &&
        result.data?.userRefreshToken
      ) {
        setAccessToken(result.data.token);
        setRefreshToken(result.data.userRefreshToken);
      }
    } catch (error: any) {
      setError(error?.message ?? error);
      return true;
    }
  };

  return { createUser, isLoading: isPending, isError };
};

export const useSignInWithCode = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);
  const setUserId = useAuthStore((state) => state.setUserId); // Get setUser from the store

  const setUser = useUserStore((state) => state.setUser);
  const setError = useUserStore((state) => state.setError);
  const { mutateAsync, isPending, isError } = trpc.user.signInWithCode.useMutation();

  const signInWithCode = async (input: RouterInputs['user']['signInWithCode']) => {
    try {
      const result = await mutateAsync(input);
      if (result.error) {
        throw new Error(result.error);
      } else if (result.data) {
        const { tokens, oneTimePassword, ...user } = result.data;
        setUser(user);
        setUserId(user.id);
        setAccessToken(tokens.token ?? '');
        setRefreshToken(tokens.userRefreshToken ?? '');

        return oneTimePassword;
      }
    } catch (error: any) {
      setError(typeof error === 'string' ? error : error.message);
    }
  };

  return { signInWithCode, isLoading: isPending, isError };
};

export const useRestorationCodeEmail = () => {
  const { mutateAsync, isPending, isError } = trpc.user.sendRestorationCode.useMutation();
  return { sendCode: mutateAsync, isLoading: isPending, isError };
};

export const useUpdatePassword = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken); // Get setUser from the store
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken); // Get setUser from the store

  const setUser = useUserStore((state) => state.setUser); // Get setUser from the store
  const setError = useUserStore((state) => state.setError); // Get setError from the store
  const { mutateAsync, isPending, isError } = trpc.user.restorePassword.useMutation(); // Assuming the mutation key is 'user.signIn'

  const resetPassword = async (input: RouterInputs['user']['restorePassword']) => {
    try {
      const result = await mutateAsync(input);
      if (result.error) {
        throw new Error(result.error);
      } else if (result.data) {
        const { token: accessToken, userRefreshToken: refreshToken, ...user } = result.data;
        setUser(user);
        setAccessToken(accessToken ?? '');
        setRefreshToken(refreshToken ?? '');
      }
    } catch (error: any) {
      setError(typeof error === 'string' ? error : error.message);
      return true;
    }
  };

  return { resetPassword, isLoading: isPending, isError };
};

export const useValidateUser = () => {
  const userId = useAuthStore((state) => state.userId);

  const { data, isError, isLoading } = trpc.user.validateToken.useQuery(
    userId
      ? {
          id: userId,
        }
      : skipToken
  );

  return {
    isValidated: userId && data?.data && !isError,
    isLoading: isLoading,
  };
};
