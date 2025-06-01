import { TypeOf, z } from 'zod';

import { ContextType } from '@/config/trpc';

export const getTestListSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1),
  userId: z.string().nullable(),
  organizationId: z.string().nullable(),
});

export const accessCompletedById = z.object({
  userId: z.string(),
  testId: z.number(),
});

export const createTestSchema = z.object({
  title: z.string(),
  theme: z.string(),
  description: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  questionsCount: z.number(),
  language: z.string(),
  additionalInformation: z.string(),
});

export const completeTestSchema = z.object({
  userId: z.string(),
  organizationId: z.string(),
  testId: z.string(),
  selectedAnswers: z.array(
    z.object({
      questionId: z.number(),
      answerId: z.number(),
      isCorrect: z.boolean(),
    })
  ),
});

export const addQuestionSchema = z.object({
  testId: z.number(),
  title: z.string(),
  answers: z.array(
    z.object({
      title: z.string(),
      isCorrect: z.boolean(),
    })
  ),
});

export const removeQuestionSchema = z.object({
  testId: z.number(),
  questionId: z.number(),
});

export const updateTestSchema = z.object({
  title: z.string(),
  theme: z.string(),
  description: z.string(),
  testId: z.number(),
});

export const removeTestByIdSchema = z.object({ id: z.number(), organizationId: z.string() });

export type TestProcedureType = {
  getTestDetails: { input: TypeOf<typeof accessCompletedById>; ctx: ContextType };
  getCompletedTestDetails: { input: TypeOf<typeof accessCompletedById>; ctx: ContextType };
  getTestList: { input: TypeOf<typeof getTestListSchema>; ctx: ContextType };
  createTest: { input: TypeOf<typeof createTestSchema>; ctx: ContextType };
  removeTest: { input: TypeOf<typeof removeTestByIdSchema>; ctx: ContextType };
  completeTest: { input: TypeOf<typeof completeTestSchema>; ctx: ContextType };
  updateTest: { input: TypeOf<typeof updateTestSchema>; ctx: ContextType };
  addQuestion: { input: TypeOf<typeof addQuestionSchema>; ctx: ContextType };
  removeQuestion: { input: TypeOf<typeof removeQuestionSchema>; ctx: ContextType };
};
