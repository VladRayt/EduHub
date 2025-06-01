import { TestProcedureType } from '@/@types/test.type';
import { CompletedTest, ControllerReturnType, Question, ResponseStatus, Test } from '@/@types/type';
import OpenAIService from '@/services/open-ai.service';
import OrganizationUserService from '@/services/organization-user.service';
import TestService from '@/services/test.service';

class TestController {
  public static async getTestDetails({
    input,
  }: TestProcedureType['getTestDetails']): ControllerReturnType<Test> {
    const { testId, userId } = input;

    if (!testId || !userId) {
      return { error: 'Test and User ID are required', status: ResponseStatus.FAILURE };
    }
    try {
      const test = await TestService.findUniqueById({
        testId: Number(testId),
        userId,
        includeFields: {
          usersThatComplete: true,
        },
      });
      const questions = await TestService.findQuestionsById({
        testId: Number(testId),
      });
      if (!test) {
        return { error: 'Test not found.', status: ResponseStatus.FAILURE };
      } else {
        return { data: { ...test, questions: questions ?? [] }, status: ResponseStatus.SUCCESS };
      }
    } catch (error) {
      console.error('Error fetching test:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async getCompletedTestDetails({
    input,
    ctx,
  }: TestProcedureType['getCompletedTestDetails']): ControllerReturnType<CompletedTest> {
    const { testId, userId } = input;

    if (!testId) {
      return { error: 'Test ID is required', status: ResponseStatus.FAILURE };
    }
    try {
      const completedTest = await TestService.findCompleteById({
        testId: Number(testId),
        userId,
        includeFields: {
          userAnswers: true,
          test: true,
        },
      });
      const { data: test } = await TestController.getTestDetails({
        input: { testId, userId },
        ctx,
      });

      if (!completedTest) {
        return { error: 'Test not found.', status: ResponseStatus.FAILURE };
      } else {
        return {
          data: { ...completedTest, test: test },
          status: ResponseStatus.SUCCESS,
        };
      }
    } catch (error) {
      console.error('Error fetching test:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async getTestList({
    input,
  }: TestProcedureType['getTestList']): ControllerReturnType<Test[]> {
    const { organizationId, userId, page = 1, limit = 100 } = input;
    const skip = (Number(page) - 1) * Number(limit);

    if (!organizationId && !userId) {
      return { error: 'Organization or user ID is required', status: ResponseStatus.FAILURE };
    }

    try {
      const tests = await TestService.findManyById({
        organizationId,
        userId,
        skip,
        take: Number(limit),
        includeFields: {
          usersThatComplete: true,
          questions: true,
        },
      });
      if (!tests) {
        return { error: 'Tests not found', status: ResponseStatus.FAILURE };
      }
      return { data: tests, status: ResponseStatus.SUCCESS };
    } catch (error) {
      console.error('Error fetching tests:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async createTest({
    input,
  }: TestProcedureType['createTest']): ControllerReturnType<Test> {
    const {
      organizationId,
      title,
      theme,
      description,
      userId,
      questionsCount,
      language,
      additionalInformation,
    } = input;

    if (!organizationId || !title || !theme) {
      return {
        error: 'Organization ID, title, theme are required',
        status: ResponseStatus.FAILURE,
      };
    }

    try {
      const organizationUser = await OrganizationUserService.findUniqueById({
        organizationId,
        userId,
      });
      if (!organizationUser) {
        return { error: 'Organization user not found', status: ResponseStatus.FAILURE };
      } else {
        const generatedTest = await OpenAIService.generateTest(
          title,
          description,
          theme,
          questionsCount ?? 2,
          language,
          additionalInformation
        );

        if (!generatedTest || !generatedTest.title) {
          return { error: 'Error with test creating', status: ResponseStatus.FAILURE };
        }

        const createdTest = await TestService.createTest({
          title: generatedTest.title || title,
          theme: generatedTest.theme || theme,
          description: generatedTest.description || description,
          questions: generatedTest.questions || [],
          organizationUser,
        });

        if (createdTest) {
          return { data: createdTest, status: ResponseStatus.SUCCESS };
        } else {
          return { error: 'Input data is not correct', status: ResponseStatus.FAILURE };
        }
      }
    } catch (error) {
      console.error('Error organization creating', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async removeTest({
    input,
  }: TestProcedureType['removeTest']): ControllerReturnType<{}> {
    const { organizationId, id: testId } = input;

    if (!organizationId || !testId) {
      return { error: 'Organization ID and test ID are required', status: ResponseStatus.FAILURE };
    }

    try {
      const removedTest = await TestService.deleteById({
        organizationId,
        testId,
      });
      if (!removedTest) {
        return { error: 'No such test', status: ResponseStatus.FAILURE };
      }

      return { status: ResponseStatus.SUCCESS };
    } catch (error) {
      console.error('Error creating user:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async completeTest({
    input,
  }: TestProcedureType['completeTest']): ControllerReturnType<CompletedTest> {
    const { userId, organizationId, testId, selectedAnswers } = input;
    if (!userId || !organizationId || !testId || !selectedAnswers) {
      return {
        error: 'User ID, organization ID, test ID and selected answers are required',
        status: ResponseStatus.FAILURE,
      };
    }
    try {
      const test = await TestService.findUniqueById({
        testId: Number(testId),
      });
      if (!test) {
        return { error: 'No such test', status: ResponseStatus.FAILURE };
      }
      const completedTest = await TestService.completeTest({
        organizationId,
        userId,
        testId: Number(testId),
        selectedAnswers,
      });
      if (completedTest) {
        return {
          data: completedTest,
          status: ResponseStatus.SUCCESS,
        };
      } else {
        return { error: 'Error with completing test', status: ResponseStatus.FAILURE };
      }
    } catch (error) {
      console.error('Error creating user:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async updateTest({
    input,
  }: TestProcedureType['updateTest']): ControllerReturnType<Test> {
    const { testId, title, theme, description } = input;
    if (!title || !testId || !description || !theme) {
      return {
        error: 'Test ID, theme, title and description are required',
        status: ResponseStatus.FAILURE,
      };
    }
    try {
      const test = await TestService.findUniqueById({
        testId: testId,
      });
      if (!test) {
        return { error: 'No such test', status: ResponseStatus.FAILURE };
      }
      const updatedTest = await TestService.updateById({
        testId: testId,
        updatedTest: {
          title,
          description,
          theme,
        },
      });
      const questions = await TestService.findQuestionsById({
        testId: Number(testId),
      });

      if (!updatedTest) {
        return { error: 'Error with updating test', status: ResponseStatus.FAILURE };
      }
      return {
        data: { ...updatedTest, questions: questions ?? [] },
        status: ResponseStatus.SUCCESS,
      };
    } catch (error) {
      console.error('Error test updating:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async addQuestion({
    input,
  }: TestProcedureType['addQuestion']): ControllerReturnType<Question> {
    const { title, testId, answers } = input;
    if (!title || !testId || !answers) {
      return {
        error: 'Title, test ID and answers are required',
        status: ResponseStatus.FAILURE,
      };
    }
    try {
      const test = await TestService.findUniqueById({
        testId,
      });
      if (!test) {
        return { error: 'No such test', status: ResponseStatus.FAILURE };
      }
      const updatedQuestion = await TestService.addQuestion({
        testId,
        question: {
          title,
          answers,
        },
        includeFields: {
          answers: true,
        },
      });

      if (!updatedQuestion) {
        return { error: 'Error with question adding', status: ResponseStatus.FAILURE };
      }
      return {
        data: updatedQuestion,
        status: ResponseStatus.SUCCESS,
      };
    } catch (error) {
      console.error('Error adding question:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async removeQuestion({
    input,
  }: TestProcedureType['removeQuestion']): ControllerReturnType<{}> {
    const { testId, questionId } = input;
    if (!testId || !questionId) {
      return {
        error: 'Test ID and question Id are required',
        status: ResponseStatus.FAILURE,
      };
    }
    try {
      const removedQuestion = await TestService.removeQuestion({
        questionId,
        testId: testId,
      });
      if (removedQuestion) {
        return {
          status: ResponseStatus.SUCCESS,
        };
      } else {
        return { error: 'Error with removing question', status: ResponseStatus.FAILURE };
      }
    } catch (error) {
      console.error('Error with removing question:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
}

export default TestController;
