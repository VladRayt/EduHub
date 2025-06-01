import { initTRPC } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const accessToken = opts.req.headers.get('Authorization');
  const refreshToken = opts.req.headers.get('Refresh');
  return {
    accessToken,
    refreshToken,
  };
};

export type ContextType = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<ContextType>().create();

export const { procedure, middleware, router } = t;
