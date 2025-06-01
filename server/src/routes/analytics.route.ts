import { router } from '@/config/trpc';
import AnalyticsController from '@/controllers/analytics.controller';
import {
  analyticsByOrganizationIdSchema,
  analyticsByUserAndTestIdSchema,
  analyticsByUserIdSchema,
} from '@/@types/analytics.type';
import { accessTokenProcedure } from '@/middlewares/auth.middleware';

export const analyticsRouter = router({
  userCreatedTestsAccuracy: accessTokenProcedure
    .input(analyticsByUserIdSchema)
    .query(AnalyticsController.averageAccuracyOnUserCreatedTests),
  userCreatedOrganizationsAccuracy: accessTokenProcedure
    .input(analyticsByUserIdSchema)
    .query(AnalyticsController.averageAccuracyOnUserCreatedOrganizations),
  accuracyForTestAcrossUsers: accessTokenProcedure
    .input(analyticsByUserAndTestIdSchema)
    .query(AnalyticsController.accuracyForTestAcrossUsers),
  organizationTestsAccuracy: accessTokenProcedure
    .input(analyticsByOrganizationIdSchema)
    .query(AnalyticsController.organizationTestsAccuracy),
  userOrganizationsAccuracy: accessTokenProcedure
    .input(analyticsByUserIdSchema)
    .query(AnalyticsController.averageUserAccuracyInEachOrganization),
  userCompletedTestsAccuracy: accessTokenProcedure
    .input(analyticsByUserIdSchema)
    .query(AnalyticsController.userCompletedTestsAccuracy),
});
