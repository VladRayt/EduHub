import { prisma } from '@/config/db';
import { CompletedTest } from '@/@types/type';

export default class AnalyticsService {
  public static async getUserCreatedTests(userId: string): Promise<CompletedTest[]> {
    return prisma.completedTest.findMany({
      where: {
        test: {
          userId,
        },
      },
      include: { userAnswers: true, test: true },
    });
  }
  public static async getUserCompletedTests(
    userId: string,
    organizationId?: string
  ): Promise<CompletedTest[]> {
    return prisma.completedTest.findMany({
      where: { userId, organizationId },
      include: { userAnswers: true, test: true },
    });
  }
  public static async getCompletedTestsByTest(testId: number) {
    return prisma.completedTest.findMany({
      where: { testId },
      include: { userAnswers: true },
    });
  }
  public static async getCompletedTestsByOrganization(organizationId: string) {
    return prisma.completedTest.findMany({
      where: { organizationId },
      include: { userAnswers: true },
    });
  }
  //   public static async getCompletedTestsByOrganization(testId: number) {
  //     return prisma.completedTest.findMany({
  //       where: { testId },
  //       include: { userAnswers: true },
  //     });
  //   }
}
