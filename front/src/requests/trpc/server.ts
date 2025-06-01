import { cookiesStore } from '@/store/cookies.store';
import { createTRPCClient, httpBatchLink } from '@trpc/client';

import { AppRouterType } from '../../../../server/src/routes';

const BASE_URL = process.env.BASE_URL;

const lastUsedCookies = {
  accessToken: null,
  refreshToken: null,
};

let serverClientSingleton: ReturnType<typeof createServerClient> | undefined = undefined;
export const getServerClient = () => {
  const { getItem } = cookiesStore();
  const refreshToken = getItem('refreshToken');
  const accessToken = getItem('accessToken');
  if (
    lastUsedCookies.accessToken !== accessToken ||
    lastUsedCookies.refreshToken !== refreshToken
  ) {
    lastUsedCookies.accessToken = accessToken;
    lastUsedCookies.refreshToken = refreshToken;
    serverClientSingleton = createServerClient(refreshToken, accessToken);
    return serverClientSingleton;
  }
  return (serverClientSingleton ??= createServerClient(refreshToken, accessToken));
};

const createServerClient = (refreshToken: string, accessToken: string) => {
  const serverClient = createTRPCClient<AppRouterType>({
    links: [
      httpBatchLink({
        url: `${BASE_URL}/trpc`,
        async headers() {
          return {
            ['Refresh']: refreshToken ?? '',
            ['Authorization']: `Bearer ${accessToken}`,
          };
        },
      }),
    ],
  });
  return serverClient;
};
