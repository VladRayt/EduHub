import { ReactNode, useMemo } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact, inferReactQueryProcedureOptions } from '@trpc/react-query';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { useAuthStore } from '@zustand/auth.store';

import type { AppRouterType } from '../../../server/src/routes';

const BASE_URL = process.env.BASE_URL;

export const trpc = createTRPCReact<AppRouterType>();

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouterType>;
export type RouterInputs = inferRouterInputs<AppRouterType>;
export type RouterOutputs = inferRouterOutputs<AppRouterType>;

export const queryClient = new QueryClient();

export const RequestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  console.log('accessToken', accessToken);
  console.log('refreshToken', refreshToken);

  const trpcClient = useMemo(() => {
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: `http://10.0.2.2:5000/trpc`,
          headers: {
            ['Refresh']: refreshToken ?? '',
            ['Authorization']: `Bearer ${accessToken}`,
          },
        }),
      ],
    });
  }, [accessToken, refreshToken]);
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
