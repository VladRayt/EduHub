'use client';

import { ReactNode, useMemo } from 'react';

import { FullPageSpinner } from '@/components/ui/spinner';
import { useHydratedRequestStore } from '@/hooks/useHydratedRequestStore';
import { useAuthStore } from '@store/auth.store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact, inferReactQueryProcedureOptions } from '@trpc/react-query';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import type { AppRouterType } from '../../../../server/src/routes';

const BASE_URL = process.env.BASE_URL;

let clientQueryClientSingleton: QueryClient | undefined = undefined;
export const getQueryClient = () => {
  return (clientQueryClientSingleton ??= new QueryClient());
};

export const frontClient = createTRPCReact<AppRouterType>();

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouterType>;
export type RouterInputs = inferRouterInputs<AppRouterType>;
export type RouterOutputs = inferRouterOutputs<AppRouterType>;

export const RequestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isHydrated = useHydratedRequestStore();
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  const queryClient = getQueryClient();
  const trpcClient = useMemo(() => {
    if (!isHydrated) return null;
    return frontClient.createClient({
      links: [
        httpBatchLink({
          url: `http://localhost:5000/trpc`,
          headers: {
            ['Refresh']: refreshToken ?? '',
            ['Authorization']: `Bearer ${accessToken}`,
          },
        }),
      ],
    });
  }, [accessToken, refreshToken, isHydrated]);

  if (trpcClient) {
    return (
      <QueryClientProvider client={queryClient}>
        <frontClient.Provider client={trpcClient} queryClient={queryClient}>
          {children}
        </frontClient.Provider>
      </QueryClientProvider>
    );
  }
  return <FullPageSpinner />;
};
