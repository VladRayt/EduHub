import { prisma } from '@/config/db';
import { CompletedTest, OrganizationUser, Question, Test } from '@/@types/type';

type IncludeFields = {
  usersThatComplete?: boolean;
  questions?: boolean;
  organizationUser?: boolean;
};

type CompletedTestIncludeFields = {
  test?: boolean;
  organizationUser?: boolean;
  userAnswers?: boolean;
};

type QuestionIncludeFields = {
  answers?: boolean;
  userAnswers?: boolean;
  test?: boolean;
};

type SelectedAnswers = {
  questionId: number;
  answerId: number;
  isCorrect: boolean;
};

type UpdatedTest = {
  title: string;
  theme: string;
  description: string;
};

// type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];

class TestService {
  public static async findUniqueById(input: {
    testId: number;
    userId?: string;
    includeFields?: IncludeFields;
  }): Promise<Test | null> {
    const { testId, userId, includeFields } = input;
    if (userId) {
      return prisma.test.findUnique({
        where: {
          id: testId,
          organizationUser: {
            organization: {
              members: {
                some: {
                  userId,
                },
              },
            },
          },
        },
        include: includeFields,
      });
    }
    return prisma.test.findUnique({
      where: {
        id: testId,
      },
      include: includeFields,
    });
  }
  public static async findCompleteById(input: {
    userId: string;
    testId: number;
    includeFields?: CompletedTestIncludeFields;
  }): Promise<CompletedTest | null> {
    const { userId, testId, includeFields } = input;

    return prisma.completedTest.findUnique({
      where: { userId_testId: { userId, testId } },
      include: includeFields,
    });
  }
  public static async findManyById(input: {
    skip: number;
    take: number;
    includeFields?: IncludeFields;
    organizationId: string | null;
    userId: string | null;
  }): Promise<Test[] | undefined> {
    const { organizationId, userId, skip, take, includeFields } = input;

    if (organizationId && userId) {
      return prisma.test.findMany({
        where: {
          organizationId,
          usersThatComplete: {
            some: {
              userId,
            },
          },
        },
        skip,
        take,
        include: includeFields,
      });
    } else if (organizationId) {
      return prisma.test.findMany({
        where: {
          organizationId,
        },
        skip,
        take,
        include: includeFields,
      });
    } else if (userId) {
      return prisma.test.findMany({
        where: {
          OR: [
            {
              usersThatComplete: {
                some: {
                  userId,
                },
              },
            },
            {
              organizationUser: {
                userId,
              },
            },
          ],
        },
        skip,
        take,
        include: includeFields,
      });
    }
  }
  public static async createTest(input: {
    title: string;
    theme: string;
    description: string;
    questions: Question[];
    organizationUser: OrganizationUser;
  }) {
    const { title, theme, description, questions, organizationUser } = input;

    return prisma.test.create({
      data: {
        title,
        theme,
        description,
        questions: {
          create: questions.map((question) => ({
            title: question.title,
            answers: {
              create: (question.answers ?? []).map((answer) => ({
                title: answer.title,
                isCorrect: answer.isCorrect,
              })),
            },
          })),
        },
        organizationUser: {
          connect: {
            userId_organizationId: {
              userId: organizationUser.userId,
              organizationId: organizationUser.organizationId,
            },
          },
        },
      },
      include: {
        questions: true,
      },
    });
  }
  public static async completeTest(input: {
    userId: string;
    organizationId: string;
    testId: number;
    selectedAnswers: SelectedAnswers[];
    includeFields?: CompletedTestIncludeFields;
  }) {
    const { testId, userId, organizationId, selectedAnswers, includeFields } = input;

    return prisma.completedTest.create({
      data: {
        testId,
        userId,
        organizationId,
        userAnswers: {
          createMany: {
            data: selectedAnswers,
          },
        },
      },
      include: includeFields,
    });
  }
  public static async deleteById(input: { organizationId: string; testId: number }) {
    const { organizationId, testId } = input;

    return prisma.test.delete({
      where: { id: testId, organizationId },
    });
  }
  public static async findQuestionsById(input: { testId: number }) {
    const { testId } = input;

    return prisma.question.findMany({
      where: {
        testId,
      },
      include: {
        answers: true,
      },
    });
  }
  public static async updateById(input: {
    testId: number;
    updatedTest: UpdatedTest;
    includeFields?: IncludeFields;
  }): Promise<Test | null> {
    const { testId, includeFields, updatedTest } = input;

    return prisma.test.update({
      where: { id: testId },
      data: updatedTest,
      include: includeFields,
    });
  }
  public static async addQuestion(input: {
    testId: number;
    question: {
      title: string;
      answers: {
        title: string;
        isCorrect: boolean;
      }[];
    };
    includeFields?: QuestionIncludeFields;
  }): Promise<Question | null> {
    const { testId, question, includeFields } = input;

    return prisma.question.create({
      data: {
        testId,
        title: question.title,
        answers: {
          createMany: {
            data:
              question.answers?.map((answer) => ({
                title: answer.title,
                isCorrect: answer.isCorrect,
              })) ?? [],
          },
        },
      },
      include: includeFields,
    });
  }
  public static async removeQuestion(input: {
    testId: number;
    questionId: number;
  }): Promise<Question | null> {
    const { testId, questionId } = input;

    return prisma.question.delete({
      where: {
        testId: testId,
        id: questionId,
      },
    });
  }
}
export default TestService;
