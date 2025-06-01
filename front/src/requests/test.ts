import { useEffect } from 'react';

import { useLocale } from 'next-intl';

import { CompletedTest, ResponseStatus, Test } from '@/@types/front';
import { useOrganizationStore } from '@store/organization.store';
import { useTestStore } from '@store/test.store';
import { useUserStore } from '@store/user.store';
import { skipToken } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';

import { frontClient, getQueryClient } from './trpc/client';

const organizationTestsKey = getQueryKey(frontClient.test.getTestList);

export const useOrganizationTests = (id: string) => {
  const userId = useUserStore((state) => state.user?.id as string);

  const { setCompletedTests, setWorkspaceTests, setError, setTestsLength } = useTestStore(
    (state) => ({
      setCompletedTests: state.setCompletedTests,
      setWorkspaceTests: state.setWorkspaceTests,
      setError: state.setError,
      setTestsLength: state.setTestsLength,
    })
  );

  const { data, isFetching, isError, refetch, status } = frontClient.test.getTestList.useQuery({
    organizationId: id,
    page: 1,
    limit: 100,
    userId: null,
  });

  useEffect(() => {
    if (status === 'error') {
      setError('Something went wrong.');
    } else if (status === 'success') {
      if (data?.error) {
        setError(data.error);
      } else if (data?.data) {
        const completedTests = data.data.reduce((acc, test) => {
          const userThatComplete = test.usersThatComplete?.find((user) => user.userId === userId);
          if (userThatComplete) {
            acc.push({ ...userThatComplete, test });
          }
          return acc;
        }, [] as CompletedTest[]);
        const uncompletedTests = data.data.filter((test) => {
          return !completedTests.some((completedTest) => completedTest.testId === test.id);
        }) as Test[];
        setTestsLength(data.data.length);
        setCompletedTests(completedTests);
        setWorkspaceTests(uncompletedTests);
      }
    }
  }, [isFetching]);

  return {
    refetch,
    isError,
    isLoading: isFetching,
  };
};

export const useUserTests = () => {
  const userId = useUserStore((state) => state.user?.id ?? '7f4e8282-2883-4907-9ecf-982b7442b6e0');
  const { setUserTests, setError } = useTestStore((state) => ({
    setUserTests: state.setUserTests,
    setError: state.setError,
  }));
  const { data, isFetching, isError, refetch, status } = frontClient.test.getTestList.useQuery({
    organizationId: null,
    page: 1,
    limit: 100,
    userId,
  });

  useEffect(() => {
    if (status === 'error') {
      setError('Something went wrong.');
    } else if (status === 'success') {
      if (data?.error) {
        setError(data.error);
      } else if (data?.data) {
        const completedTests = data.data.reduce((acc, test) => {
          const userThatComplete = test.usersThatComplete?.find((user) => user.userId === userId);
          if (userThatComplete) {
            acc.push({ ...userThatComplete, test });
          }
          return acc;
        }, [] as CompletedTest[]);
        const uncompletedTests = data.data.filter((test) => {
          return test.userId === userId;
        });
        setUserTests({
          completed: completedTests,
          created: uncompletedTests,
        });
      }
    }
  }, [isFetching]);

  return {
    refetch,
    isError,
    isLoading: isFetching,
  };
};

export const useTestDetails = (testId: number | null) => {
  const userId = useUserStore((state) => state.user?.id);
  const { setSelectedTest, setError } = useTestStore((state) => ({
    setSelectedTest: state.setSelectedTest,
    setError: state.setError,
  }));

  const { data, isFetching, isError, refetch, status } = frontClient.test.getTestDetails.useQuery(
    testId && userId
      ? {
          testId,
          userId: `${userId}`,
        }
      : skipToken
  );

  useEffect(() => {
    if (!isFetching) {
      if (status === 'error') {
        setError('Something went wrong.');
      } else if (status === 'success') {
        if (data?.error) {
          setError(data.error);
        } else if (data?.data) {
          setSelectedTest(data?.data);
        }
      }
    }
  }, [isFetching]);

  return {
    refetch,
    isError,
    isLoading: isFetching,
  };
};

export const useCompletedTestDetails = (testId: number | null) => {
  const userId = useUserStore((state) => state.user?.id ?? '7f4e8282-2883-4907-9ecf-982b7442b6e0');

  console.log('userId', userId);
  const { setSelectedTest, setError } = useTestStore((state) => ({
    setSelectedTest: state.setSelectedTest,
    setError: state.setError,
  }));

  const { data, isFetching, isError, refetch, status } =
    frontClient.test.getCompletedDetails.useQuery(
      testId && userId
        ? {
            testId,
            userId,
          }
        : skipToken
    );

  useEffect(() => {
    if (status === 'error') {
      setError('Something went wrong.');
    } else if (status === 'success') {
      if (data?.error) {
        setError(data.error);
      } else if (data?.data) {
        setSelectedTest(data?.data, true);
      }
    }
  }, [isFetching]);

  return {
    refetch,
    isError,
    isLoading: isFetching,
  };
};

export const useCreateTest = (id: string) => {
  const queryClient = getQueryClient();
  const locale = useLocale();

  const userId = useUserStore((state) => state.user?.id ?? '7f4e8282-2883-4907-9ecf-982b7442b6e0');
  const { setError, setSelectedTest, setOrganizationTests, organizationTests } = useTestStore(
    (state) => ({
      setError: state.setError,
      setSelectedTest: state.setSelectedTest,
      setOrganizationTests: state.setWorkspaceTests,
      organizationTests: state.workspaceTests,
    })
  );

  const { mutateAsync, isError, isPending } = frontClient.test.createTest.useMutation();

  const createTest = async ({
    title,
    theme,
    description,
    questionLength,
    additionalInformation,
  }: {
    title: string;
    theme: string;
    description: string;
    questionLength: number;
    additionalInformation: string;
  }) => {
    try {
      // Детальне логування початкових даних
      console.log('=== CREATE TEST DEBUG ===');
      console.log('Request payload:', {
        title,
        userId,
        organizationId: id,
        theme,
        description,
        questionsCount: questionLength,
        language: locale,
        additionalInformation,
      });

      // Перевірка обов'язкових параметрів
      if (!userId) {
        console.error('Missing userId:', userId);
        setError('User ID is required');
        return;
      }

      if (!id) {
        console.error('Missing organizationId:', id);
        setError('Organization ID is required');
        return;
      }

      // Валідація вхідних даних
      if (!title?.trim()) {
        console.error('Invalid title:', title);
        setError('Title is required');
        return;
      }

      if (questionLength <= 0 || questionLength > 100) {
        console.error('Invalid questionLength:', questionLength);
        setError('Question length must be between 1 and 100');
        return;
      }

      console.log('All validations passed, making API call...');

      const { data: test, error } = await mutateAsync({
        title: title.trim(),
        userId,
        organizationId: id,
        theme: theme?.trim() || '',
        description: description?.trim() || '',
        questionsCount: questionLength,
        language: locale,
        additionalInformation: additionalInformation?.trim() || '',
      });

      console.log('API Response:', { test, error });

      if (error) {
        console.error('API returned error:', error);
        setError(typeof error === 'string' ? error : 'Error creating test');
        return;
      }

      if (!test) {
        console.error('No test data returned from API');
        setError('No test data received from server');
        return;
      }

      console.log('Test created successfully:', test);

      // Оновлення кешу та стану
      queryClient.invalidateQueries({ queryKey: organizationTestsKey });
      setSelectedTest(test as Test);
      setOrganizationTests([...organizationTests, test as Test]);

      console.log('State updated successfully');
      return test.id;
    } catch (error: any) {
      console.error('=== CREATE TEST ERROR ===');
      console.error('Full error object:', error);
      console.error('Error message:', error?.message);
      console.error('Error status:', error?.status);
      console.error('Error code:', error?.code);
      console.error('Error response:', error?.response?.data);
      console.error('Error stack:', error?.stack);

      // Більш детальна обробка помилок
      let errorMessage = 'Unknown error occurred';

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      console.error('Final error message:', errorMessage);
      setError(errorMessage);

      return undefined;
    }
  };

  return {
    createTest,
    isError,
    isLoading: isPending,
  };
};

export const useCompleteTest = () => {
  const queryClient = getQueryClient();
  const userId = useUserStore((state) => state.user?.id as string);
  const organizationId = useOrganizationStore((state) => state.selectedOrganization?.id);

  const { setCompletedTests, setSelectedTest, setError } = useTestStore((state) => ({
    setCompletedTests: state.setCompletedTests,
    setSelectedTest: state.setSelectedTest,
    setError: state.setError,
  }));

  const {
    mutateAsync,
    isPending: isLoading,
    isError,
  } = frontClient.test.completeTest.useMutation();

  const completeTest = async (
    testId: number,
    selectedAnswers: { questionId: number; answerId: number; isCorrect: boolean }[]
  ) => {
    try {
      const { data: completedTest, error } = await mutateAsync({
        userId,
        organizationId: organizationId as string,
        testId: `${testId}`,
        selectedAnswers,
      });
      if (error || !completedTest) {
        throw new Error(error ?? 'Failed to complete test');
      }
      queryClient.invalidateQueries({ queryKey: organizationTestsKey });
      setSelectedTest(completedTest, true);
      setCompletedTests([completedTest]);
    } catch (error: any) {
      setError(error?.message ?? error);
    }
  };
  return { completeTest, isLoading, isError };
};

export const useUpdateTest = () => {
  const queryClient = getQueryClient();

  const { updateLocalTest, setError } = useTestStore((state) => ({
    updateLocalTest: state.updateLocalTest,
    setError: state.setError,
  }));

  const { mutateAsync, isError, isPending } = frontClient.test.updateTest.useMutation();

  const updateTest = async ({
    testId,
    title,
    description,
    theme,
  }: {
    testId: number;
    title: string;
    description: string;
    theme: string;
  }) => {
    try {
      const {
        data: test,
        error,
        status,
      } = await mutateAsync({
        testId,
        title,
        theme,
        description,
      });

      if (error || status === ResponseStatus.FAILURE || !test) {
        setError(error ?? 'Error with organization updating.');
        return;
      }
      queryClient.invalidateQueries({ queryKey: organizationTestsKey });
      updateLocalTest(test);
    } catch (error: any) {
      setError(error?.message ?? error);
    }
  };
  return {
    updateTest,
    isError,
    isLoading: isPending,
  };
};

export const useRemoveTest = () => {
  const queryClient = getQueryClient();
  const deleteOrganizationTest = useOrganizationStore((state) => state.deleteOrganizationTest);

  const { deleteTest, setError } = useTestStore((state) => ({
    deleteTest: state.deleteTest,
    setError: state.setError,
  }));

  const { mutateAsync, isError, isPending } = frontClient.test.removeTest.useMutation();

  const removeTest = async ({
    testId,
    organizationId,
  }: {
    testId: number;
    organizationId: string;
  }) => {
    try {
      const { error, status } = await mutateAsync({
        id: testId,
        organizationId,
      });

      if (error || status === ResponseStatus.FAILURE) {
        setError(error ?? 'Error with organization updating.');
        return;
      }
      queryClient.invalidateQueries({ queryKey: organizationTestsKey });
      deleteOrganizationTest(testId);
      deleteTest(testId);
    } catch (error: any) {
      setError(error?.message ?? error);
    }
  };
  return {
    removeTest,
    isError,
    isLoading: isPending,
  };
};

export const useAddTestQuestion = () => {
  const { questionAction, setError } = useTestStore((state) => ({
    questionAction: state.questionAction,
    setError: state.setError,
  }));

  const { mutateAsync, isError, isPending } = frontClient.test.addQuestion.useMutation();

  const addQuestion = async ({
    testId,
    title,
    answers,
  }: {
    testId: number;
    title: string;
    answers: {
      title: string;
      isCorrect: boolean;
    }[];
  }) => {
    try {
      const {
        data: question,
        error,
        status,
      } = await mutateAsync({
        testId,
        title,
        answers,
      });

      if (error || status === ResponseStatus.FAILURE || !question) {
        setError(error ?? 'Error with organization updating.');
        return;
      }
      questionAction(question.id, question);
    } catch (error: any) {
      setError(error?.message ?? error);
    }
  };
  return {
    addQuestion,
    isError,
    isLoading: isPending,
  };
};

export const useRemoveTestQuestion = () => {
  const { questionAction, setError } = useTestStore((state) => ({
    questionAction: state.questionAction,
    setError: state.setError,
  }));

  const { mutateAsync, isError, isPending } = frontClient.test.removeQuestion.useMutation();

  const removeQuestion = async ({ testId, questionId }: { testId: number; questionId: number }) => {
    try {
      const { error, status } = await mutateAsync({
        testId,
        questionId,
      });

      if (error || status === ResponseStatus.FAILURE) {
        setError(error ?? 'Error with organization updating.');
        return;
      }
      questionAction(questionId);
    } catch (error: any) {
      setError(error?.message ?? error);
    }
  };
  return {
    removeQuestion,
    isError,
    isLoading: isPending,
  };
};
