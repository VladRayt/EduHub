import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { ssrPrepass } from '@trpc/next/ssrPrepass';

import { AppRouterType } from '../../../../server/src/routes';

const BASE_URL = process.env.BASE_URL;

export const nextClient = createTRPCNext<AppRouterType>({
  config() {
    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `http://localhost:5000/trpc`,
        }),
      ],
    };
  },
  ssrPrepass,
  ssr: true,
});
