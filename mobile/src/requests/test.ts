import { useEffect } from 'react';

import { CompletedTest, ResponseStatus } from '../mobile-types/front-types';
import { queryClient, trpc } from '@requests/RequestContext';
import { skipToken } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { getLocale } from '@utils/locale';
import { useOrganizationStore } from '@zustand/organization.store';
import { useTestStore } from '@zustand/test.store';
import { useUserStore } from '@zustand/user.store';

const organizationTestsKey = getQueryKey(trpc.test.getTestList);

export const useOrganizationTests = (id: string) => {
  const userId = useUserStore((state) => state.user?.id);

  const setCompletedTests = useTestStore((state) => state.setCompletedTests);
  const setWorkspaceTests = useTestStore((state) => state.setWorkspaceTests);

  const setError = useTestStore((state) => state.setError);
  const setTestsLength = useTestStore((state) => state.setTestsLength);

  const { data, isFetching, isError, refetch, status } = trpc.test.getTestList.useQuery(
    id
      ? {
        organizationId: id,
        page: 1,
        limit: 100,
        userId: null,
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
        const completedTests = data.data.reduce((acc, test) => {
          const userThatComplete = test.usersThatComplete?.find((user) => user.userId === userId);
          if (userThatComplete) {
            acc.push({ ...userThatComplete, test });
          }
          return acc;
        }, [] as CompletedTest[]);
        const uncompletedTests = data.data.filter((test) => {
          return !completedTests.some((completedTest) => completedTest.testId === test.id);
        });
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
  const userId = useUserStore((state) => state.user?.id);
  const setUserTests = useTestStore((state) => state.setUserTests);
  const setError = useTestStore((state) => state.setError);
  const { data, isFetching, isError, refetch, status } = trpc.test.getTestList.useQuery(
    userId
      ? {
        organizationId: null,
        page: 1,
        limit: 100,
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

export const useTestDetails = (testId: number) => {
  const userId = useUserStore((state) => state.user?.id);
  const setSelectedTest = useTestStore((state) => state.setSelectedTest);
  const setError = useTestStore((state) => state.setError);

  const { data, isFetching, isError, refetch, status } = trpc.test.getTestDetails.useQuery(
    testId && userId
      ? {
        testId,
        userId: `${userId}`,
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
        setSelectedTest(data?.data);
      }
    }
  }, [isFetching]);

  return {
    refetch,
    isError,
    isLoading: isFetching,
  };
};

export const useCompletedTestDetails = (id: number) => {
  const userId = useUserStore((state) => state.user?.id);
  const setSelectedTest = useTestStore((state) => state.setSelectedTest);
  const setError = useTestStore((state) => state.setError);

  const { data, isFetching, isError, refetch, status } = trpc.test.getCompletedDetails.useQuery(
    id && userId
      ? {
        testId: id,
        userId: userId,
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
  const userId = useUserStore((state) => state.user?.id ?? '7f4e8282-2883-4907-9ecf-982b7442b6e0');

  const organizationTests = useTestStore((state) => state.workspaceTests);
  const setError = useTestStore((state) => state.setError);
  const setSelectedTest = useTestStore((state) => state.setSelectedTest);
  const setOrganizationTests = useTestStore((state) => state.setWorkspaceTests);

  const { mutateAsync, isError, isPending } = trpc.test.createTest.useMutation();

  const createTest = async ({
    title,
    theme,
    description,
    questionLength,
  }: {
    title: string;
    theme: string;
    description: string;
    questionLength: number;
  }) => {
    try {
      if (!userId || !id) return;
      const locale = getLocale();
      const { data: test, error } = await mutateAsync({
        title,
        userId,
        organizationId: id,
        theme,
        description,
        questionsCount: questionLength,
        language: locale as string,
        additionalInformation: '',
      });

      if (error || !test) {
        setError(error ?? 'Error with organization creating.');
        return;
      }
      queryClient.invalidateQueries({ queryKey: organizationTestsKey });
      setSelectedTest(test);
      setOrganizationTests([...organizationTests, test]);
      return test.id;
    } catch (error: any) {
      setError(error?.message ?? error);
    }
  };
  return {
    createTest,
    isError,
    isLoading: isPending,
  };
};

export const useCompleteTest = () => {
  const userId = useUserStore((state) => state.user?.id ?? '7f4e8282-2883-4907-9ecf-982b7442b6e0');
  const organizationId = useOrganizationStore((state) => state.selectedOrganization?.id);

  const setCompletedTests = useTestStore((state) => state.setCompletedTests);
  const setSelectedTest = useTestStore((state) => state.setSelectedTest);
  const setError = useTestStore((state) => state.setError);

  const { mutateAsync, isPending: isLoading, isError } = trpc.test.completeTest.useMutation();

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
  const updateLocalTest = useTestStore((state) => state.updateLocalTest);
  const setError = useTestStore((state) => state.setError);

  const { mutateAsync, isError, isPending } = trpc.test.updateTest.useMutation();

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
  const deleteOrganizationTest = useOrganizationStore((state) => state.deleteOrganizationTest);
  const deleteTest = useTestStore((state) => state.deleteTest);
  const setError = useTestStore((state) => state.setError);

  const { mutateAsync, isError, isPending } = trpc.test.removeTest.useMutation();

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
  const questionAction = useTestStore((state) => state.questionAction);
  const setError = useTestStore((state) => state.setError);

  const { mutateAsync, isError, isPending } = trpc.test.addQuestion.useMutation();

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
  const questionAction = useTestStore((state) => state.questionAction);
  const setError = useTestStore((state) => state.setError);

  const { mutateAsync, isError, isPending } = trpc.test.removeQuestion.useMutation();

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
