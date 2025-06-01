import { useAuthStore } from '@store/auth.store';
import { useUserStore } from '@store/user.store';

import { RouterInputs, frontClient } from './trpc/client';

export const useSignIn = () => {
  const { setAccessToken, setRefreshToken, setUserId } = useAuthStore(
    ({ setAccessToken, setRefreshToken, setUserId }) => ({
      setAccessToken,
      setRefreshToken,
      setUserId,
    })
  );

  const { setUser, setError } = useUserStore((state) => ({
    setUser: state.setUser,
    setError: state.setError,
  }));

  const { mutateAsync, isPending, isError } = frontClient.user.signIn.useMutation(); // Assuming the mutation key is 'user.signIn'

  const signIn = async (input: RouterInputs['user']['signIn']) => {
    try {
      const result = await mutateAsync(input);
      if (result.error) {
        throw new Error(result.error);
      } else if (result.data) {
        const { tokens, ...user } = result.data;
        setUser(user);
        setUserId(user.id);
        setAccessToken(tokens.token ?? '');
        setRefreshToken(tokens.userRefreshToken ?? '');
      }
    } catch (error: any) {
      setError(typeof error === 'string' ? error : error.message);
    }
  };

  return { signIn, isLoading: isPending, isError };
};

export const useSignUp = () => {
  const setError = useUserStore((state) => state.setError);
  const { mutateAsync, isPending, isError } = frontClient.user.signUp.useMutation(); // Assuming the mutation key is 'user.signUp'

  const createUser = async (input: RouterInputs['user']['signUp']) => {
    try {
      const result = await mutateAsync(input);
      if (result.error) {
        throw new Error(result.error);
      }
    } catch (error: any) {
      setError(error?.message ?? error);
    }
  };

  return { createUser, isLoading: isPending, isError };
};

export const useSignInWithCode = () => {
  const { setAccessToken, setRefreshToken, setUserId } = useAuthStore((state) => ({
    setAccessToken: state.setAccessToken,
    setRefreshToken: state.setRefreshToken,
    setUserId: state.setUserId,
  }));

  const { setUser, setError } = useUserStore((state) => ({
    setUser: state.setUser,
    setError: state.setError,
  }));

  const { mutateAsync, isPending, isError } = frontClient.user.signInWithCode.useMutation();

  const signInWithCode = async (
    input: RouterInputs['user']['signInWithCode'] & { isForgotPassword: boolean }
  ) => {
    const { isForgotPassword, ...rest } = input;
    try {
      const result = await mutateAsync(rest);
      if (result.error) {
        throw new Error(result.error);
      } else if (result.data) {
        const { tokens, oneTimePassword, ...user } = result.data;
        if (isForgotPassword) {
          setAccessToken(tokens.token ?? '');
          setRefreshToken(tokens.userRefreshToken ?? '');
          return false;
        }
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
  const { mutateAsync, isPending, isError } = frontClient.user.sendRestorationCode.useMutation();
  return { sendCode: mutateAsync, isLoading: isPending, isError };
};

export const useUpdatePassword = () => {
  const { setAccessToken, setRefreshToken, setUserId } = useAuthStore((state) => ({
    setAccessToken: state.setAccessToken,
    setRefreshToken: state.setRefreshToken,
    setUserId: state.setUserId,
  }));

  const { setUser, setError } = useUserStore((state) => ({
    setUser: state.setUser,
    setError: state.setError,
  }));

  const { mutateAsync, isPending, isError } = frontClient.user.restorePassword.useMutation();

  const resetPassword = async (input: RouterInputs['user']['restorePassword']) => {
    try {
      const result = await mutateAsync(input);
      if (result.error) {
        throw new Error(result.error);
      } else if (result.data) {
        const { token: accessToken, userRefreshToken: refreshToken, ...user } = result.data;
        setUser(user);
        setUserId(user.id);
        setAccessToken(accessToken ?? '');
        setRefreshToken(refreshToken ?? '');
      }
    } catch (error: any) {
      setError(typeof error === 'string' ? error : error.message);
    }
  };

  return { resetPassword, isLoading: isPending, isError };
};
