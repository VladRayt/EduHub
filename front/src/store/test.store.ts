import { create } from 'zustand';

import { CompletedTest, Question, Test } from '@/@types/front';

const initialState = {
  selectedCompletedTest: null,
  selectedTest: null,
  completedTests: [],
  workspaceTests: [],
  userTests: {
    created: [],
    completed: [],
  },
  error: null,
  testLength: 0,
};

interface ITestStore {
  selectedCompletedTest: CompletedTest | null;
  selectedTest: Test | null;
  completedTests: CompletedTest[];
  workspaceTests: Test[];
  userTests: {
    created: Test[];
    completed: CompletedTest[];
  };
  error: string | null;
  testLength: number;
  setSelectedTest: (test: CompletedTest | Test, isCompleted?: boolean) => void;
  setCompletedTests: (completedTests: CompletedTest[]) => void;
  setWorkspaceTests: (workspaceTests: Test[]) => void;
  setUserTests: (userTests: { created: Test[]; completed: CompletedTest[] }) => void;
  setTestsLength: (length: number) => void;
  updateLocalTest: (test: Test) => void;
  deleteTest: (testId: number) => void;
  questionAction: (questionId: number, question?: Question) => void;
  setError: (error: string) => void;
  clear: () => void;
}

export const useTestStore = create<ITestStore>((set, get) => ({
  ...initialState,
  setSelectedTest: (test: CompletedTest | Test, isCompleted?: boolean) => {
    if (isCompleted) {
      return set({ selectedCompletedTest: test as CompletedTest, error: null });
    }
    return set({ selectedTest: test as Test, error: null });
  },
  setCompletedTests: (completedTests) => set({ completedTests, error: null }),
  setWorkspaceTests: (workspaceTests) => set({ workspaceTests, error: null }),
  setUserTests: (userTests) => set({ userTests, error: null }),
  setTestsLength: (length) => set({ testLength: length }),
  updateLocalTest: (test) => {
    const { userTests, workspaceTests, completedTests } = get();
    set({
      userTests: {
        completed: userTests.completed.map((completedTest) => {
          return completedTest.testId === test.id ? { ...completedTest, test } : completedTest;
        }),
        created: userTests.created.map((createdTest) => {
          return createdTest.id === test.id ? test : createdTest;
        }),
      },
      workspaceTests: workspaceTests.map((workspaceTest) => {
        return workspaceTest.id === test.id ? test : workspaceTest;
      }),
      completedTests: completedTests.map((completedTest) => {
        return completedTest.testId === test.id ? { ...completedTest, test } : completedTest;
      }),
      selectedTest: test,
    });
  },
  deleteTest: (testId) => {
    const { userTests, workspaceTests, completedTests } = get();
    set({
      userTests: {
        completed: userTests.completed.filter((completedTest) => {
          return completedTest.testId !== testId;
        }),
        created: userTests.created.filter((createdTest) => {
          return createdTest.id !== testId;
        }),
      },
      workspaceTests: workspaceTests.filter((workspaceTest) => {
        return workspaceTest.id !== testId;
      }),
      completedTests: completedTests.filter((completedTest) => {
        return completedTest.testId !== testId;
      }),
      selectedTest: null,
    });
  },
  questionAction: (questionId, question) => {
    const { selectedTest } = get();
    if (!selectedTest) return;
    if (question) {
      return set({
        selectedTest: {
          ...selectedTest,
          questions: [...(selectedTest.questions ?? []), question],
        },
      });
    }
    const filteredQuestions = (selectedTest.questions ?? []).filter(
      (question) => question.id !== questionId
    );
    return set({
      selectedTest: {
        ...selectedTest,
        questions: filteredQuestions,
      },
    });
  },
  setError: (error: string) => set({ error }),
  clear: () => set({ ...initialState, error: null }),
}));
