import { router } from '@/config/trpc';
import { userRouter } from './user.route';
import { organizationRouter } from './organization.route';
import { testRouter } from './test.route';
import { analyticsRouter } from './analytics.route';

export const appRouter = router({
  user: userRouter,
  organization: organizationRouter,
  test: testRouter,
  analytics: analyticsRouter,
});

export type AppRouterType = typeof appRouter;
