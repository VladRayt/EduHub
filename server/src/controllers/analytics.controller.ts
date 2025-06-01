import { AnalyticsProcedureType } from '@/@types/analytics.type';
import { ControllerReturnType, ResponseStatus, Test, User } from '@/@types/type';
import AnalyticsService from '@/services/analytics.service';
import OrganizationService from '@/services/organization.service';
import OrganizationUserService from '@/services/organization-user.service';
import TestService from '@/services/test.service';
import UserService from '@/services/user.service';

type AnalyticsReturnType = ControllerReturnType<
  {
    value: number;
    label: string | undefined;
    userId?: string;
    organizationId?: string;
    testId?: number;
  }[]
>;

export default class AnalyticsController {
  public static async averageAccuracyOnUserCreatedTests({
    input,
  }: AnalyticsProcedureType['userId']): AnalyticsReturnType {
    const { userId } = input;
    if (!userId) return { error: 'User id is required', status: ResponseStatus.FAILURE };

    try {
      const userCreatedTests = await AnalyticsService.getUserCreatedTests(userId);

      if (userCreatedTests.length === 0)
        return { error: 'User has not created any tests', status: ResponseStatus.FAILURE };

      const accuracyTestList = await Promise.all(
        userCreatedTests.map(async (test) => {
          const completedTests = await AnalyticsService.getCompletedTestsByTest(test.testId);
          const totalQuestions = test.userAnswers?.length ?? 0;
          const totalCorrectAnswers = completedTests.reduce((acc, curr) => {
            return acc + (curr.userAnswers ?? []).filter((answer) => answer.isCorrect).length;
          }, 0);
          const testAccuracy =
            (totalCorrectAnswers / (completedTests.length * totalQuestions)) * 100;
          return { value: testAccuracy, label: test.test!.title, testId: test.testId };
        })
      );

      return {
        data: accuracyTestList,
        status: ResponseStatus.SUCCESS,
      };
    } catch (error) {
      console.error(error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async averageAccuracyOnUserCreatedOrganizations({
    input,
  }: AnalyticsProcedureType['userId']): AnalyticsReturnType {
    const { userId } = input;
    if (!userId) return { error: 'User id is required', status: ResponseStatus.FAILURE };

    try {
      const userOrg = await OrganizationService.findMany({
        skip: 0,
        take: 100,
        userId,
      });

      const userCreatedOrgs = userOrg.filter((org) => org.authorId === userId);

      if (userCreatedOrgs.length === 0)
        return { error: 'User has not created any organizations', status: ResponseStatus.FAILURE };

      const accuracyOrganizationsList = await Promise.all(
        userCreatedOrgs.map(async (org) => {
          const testsInOrg = (await TestService.findManyById({
            organizationId: org.id,
            userId: null,
            skip: 0,
            take: 100,
            includeFields: {
              questions: true,
            },
          })) as Test[];
          const completedTests = await AnalyticsService.getCompletedTestsByOrganization(org.id);

          const totalQuestions = testsInOrg.reduce(
            (acc, curr) => acc + (curr.questions?.length ?? 0),
            0
          );
          const totalCorrectAnswers = completedTests.reduce((acc, curr) => {
            return acc + (curr.userAnswers ?? []).filter((answer) => answer.isCorrect).length;
          }, 0);
          const averageAccuracy =
            (totalCorrectAnswers / (completedTests.length * totalQuestions)) * 100;

          return { value: averageAccuracy, label: org.title, frontColor: org.color };
        })
      );

      return {
        data: accuracyOrganizationsList,
        status: ResponseStatus.SUCCESS,
      };
    } catch (error) {
      console.error(error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async accuracyForTestAcrossUsers({
    input,
  }: AnalyticsProcedureType['userTestId']): AnalyticsReturnType {
    const { userId, testId } = input;
    if (!userId || !testId)
      return { error: 'User id and test id are required', status: ResponseStatus.FAILURE };

    try {
      const completedTests = await AnalyticsService.getCompletedTestsByTest(testId);

      if (completedTests.length === 0)
        return {
          error: 'No completed tests found for the specified test',
          status: ResponseStatus.FAILURE,
        };

      const accuracyTestUserList = await Promise.all(
        completedTests.map(async (completedTest) => {
          const user = (await UserService.findUniqueById({ userId: completedTest.userId })) as User;
          const totalQuestions = completedTest.userAnswers.length;
          const totalCorrectAnswers = (completedTest.userAnswers ?? []).filter(
            (answer) => answer.isCorrect
          ).length;
          const testAccuracy = (totalCorrectAnswers / totalQuestions) * 100;

          return {
            value: testAccuracy,
            label: user.name,
            frontColor: user.id === userId ? 'blue' : 'red',
            userId: user.id,
          };
        })
      );

      return {
        data: accuracyTestUserList,
        status: ResponseStatus.SUCCESS,
      };
    } catch (error) {
      console.error(error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async organizationTestsAccuracy({
    input,
  }: AnalyticsProcedureType['organizationId']): AnalyticsReturnType {
    const { organizationId } = input;
    if (!organizationId)
      return { error: 'Organization id is required', status: ResponseStatus.FAILURE };

    try {
      const organizationTests = await TestService.findManyById({
        organizationId,
        userId: null,
        skip: 0,
        take: 100,
        includeFields: {
          questions: true,
        },
      });

      if (!organizationTests) {
        return {
          error: 'No tests found for the specified organization',
          status: ResponseStatus.FAILURE,
        };
      }

      if (organizationTests.length === 0)
        return {
          error: 'No tests found for the specified organization',
          status: ResponseStatus.FAILURE,
        };

      const accuracyOrganizationTestList = await Promise.all(
        organizationTests.map(async (test) => {
          const completedTests = await AnalyticsService.getCompletedTestsByTest(test.id);
          const totalQuestions = test.questions?.length ?? 0;
          const totalCorrectAnswers = completedTests.reduce((acc, curr) => {
            return acc + (curr.userAnswers ?? []).filter((answer) => answer.isCorrect).length;
          }, 0);
          const averageAccuracy =
            (totalCorrectAnswers / (completedTests.length * totalQuestions)) * 100;

          return { value: averageAccuracy, label: test.title, frontColor: 'red', testId: test.id };
        })
      );

      return {
        data: accuracyOrganizationTestList,
        status: ResponseStatus.SUCCESS,
      };
    } catch (error) {
      console.error(error);
      return { error: 'Internal Server Error', status: ResponseStatus.FAILURE };
    }
  }
  public static async averageUserAccuracyInEachOrganization({
    input,
  }: AnalyticsProcedureType['userId']): AnalyticsReturnType {
    const { userId } = input;
    if (!userId) return { error: 'User id is required', status: ResponseStatus.FAILURE };

    try {
      const userOrgs = await OrganizationService.findMany({
        skip: 0,
        take: 100,
        userId,
      });

      if (userOrgs.length === 0)
        return {
          error: 'User is not a member of any organization',
          status: ResponseStatus.FAILURE,
        };

      const accuracyUserOrganizationList = await Promise.all(
        userOrgs.map(async (org) => {
          const orgMembers = await OrganizationUserService.findManyById({
            organizationId: org.id,
          });

          if (!orgMembers || orgMembers.length === 0)
            return { value: 0, label: org.title, frontColor: org.color };

          const userAccuracies = await Promise.all(
            orgMembers.map(async (member) => {
              const completedTests = await AnalyticsService.getUserCompletedTests(
                member.userId,
                org.id
              );
              const totalQuestions = completedTests.reduce(
                (acc, curr) => acc + (curr.userAnswers?.length ?? 0),
                0
              );
              const totalCorrectAnswers = completedTests.reduce((acc, curr) => {
                return acc + (curr.userAnswers ?? []).filter((answer) => answer.isCorrect).length;
              }, 0);
              const averageAccuracy =
                totalQuestions === 0 ? 0 : (totalCorrectAnswers / totalQuestions) * 100;

              return averageAccuracy;
            })
          );

          const orgAverageAccuracy =
            userAccuracies.reduce((acc, curr) => acc + curr, 0) / userAccuracies.length;

          return {
            value: orgAverageAccuracy,
            label: org.title,
            frontColor: org.color,
            organizationId: org.id,
          };
        })
      );

      return {
        data: accuracyUserOrganizationList,
        status: ResponseStatus.SUCCESS,
      };
    } catch (error) {
      console.error(error);
      return {
        error: 'Internal Server Error',
        status: ResponseStatus.FAILURE,
      };
    }
  }
  public static async userCompletedTestsAccuracy({
    input,
  }: AnalyticsProcedureType['userId']): AnalyticsReturnType {
    const { userId } = input;
    if (!userId) return { error: 'User id is required', status: ResponseStatus.FAILURE };

    try {
      const completedTests = await AnalyticsService.getUserCompletedTests(userId);
      if (completedTests.length === 0)
        return { error: 'User has not completed any tests', status: ResponseStatus.FAILURE };

      const accuracyUserTestsList = completedTests.map((completedTest) => {
        const totalQuestions = completedTest.userAnswers?.length ?? 0;
        const totalCorrectAnswers = (completedTest.userAnswers ?? []).filter(
          (answer) => answer.isCorrect
        ).length;
        const testAccuracy = (totalCorrectAnswers / totalQuestions) * 100;

        return {
          value: testAccuracy,
          label: completedTest.test?.title,
          testId: completedTest.testId,
        };
      });

      return {
        data: accuracyUserTestsList,
        status: ResponseStatus.SUCCESS,
      };
    } catch (error) {
      console.error(error);
      return { error: 'Internal Server Error', status: ResponseStatus.FAILURE };
    }
  }
}
