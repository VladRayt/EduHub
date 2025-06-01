import { TypeOf, z } from 'zod';

import { ContextType } from '@/config/trpc';

export const analyticsByUserIdSchema = z.object({
  userId: z.string(),
});

export const analyticsByUserAndTestIdSchema = z.object({
  userId: z.string(),
  testId: z.number(),
});

export const analyticsByOrganizationIdSchema = z.object({
  organizationId: z.string(),
});

export type AnalyticsProcedureType = {
  userId: { input: TypeOf<typeof analyticsByUserIdSchema>; ctx: ContextType };
  userTestId: { input: TypeOf<typeof analyticsByUserAndTestIdSchema>; ctx: ContextType };
  organizationId: { input: TypeOf<typeof analyticsByOrganizationIdSchema>; ctx: ContextType };
};
