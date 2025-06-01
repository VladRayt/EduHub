import jwt from 'jsonwebtoken';

import { middleware } from '@/config/trpc';
import { TRPCError } from '@trpc/server';

const jwtSecret = process.env.JWT_SECRET as string;

const accessTokenMiddleware = middleware(({ ctx, next }) => {
  const { accessToken, refreshToken } = ctx;
  if (!accessToken && !refreshToken)
    throw new TRPCError({ message: 'Access denied', code: 'UNAUTHORIZED' });

  const decodedToken = accessToken?.split(' ')[1];
  try {
    jwt.verify(decodedToken as string, jwtSecret, {});
    return next({ ctx: { accessToken, refreshToken } });
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new TRPCError({ message: 'Access denied', code: 'UNAUTHORIZED' });
    }
    throw new TRPCError({ message: 'Access denied', code: 'UNAUTHORIZED' });
  }
});

import { procedure } from '@/config/trpc';

export const accessTokenProcedure = procedure.use(accessTokenMiddleware);
