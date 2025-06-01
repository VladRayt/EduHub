import { router } from '@/config/trpc';
import TestController from '@/controllers/test.controller';
import {
  accessCompletedById,
  addQuestionSchema,
  completeTestSchema,
  createTestSchema,
  getTestListSchema,
  removeQuestionSchema,
  removeTestByIdSchema,
  updateTestSchema,
} from '@/@types/test.type';
import { accessTokenProcedure } from '@/middlewares/auth.middleware';

export const testRouter = router({
  getTestDetails: accessTokenProcedure
    .input(accessCompletedById)
    .query(TestController.getTestDetails),
  getCompletedDetails: accessTokenProcedure
    .input(accessCompletedById)
    .query(TestController.getCompletedTestDetails),
  getTestList: accessTokenProcedure.input(getTestListSchema).query(TestController.getTestList),
  createTest: accessTokenProcedure.input(createTestSchema).mutation(TestController.createTest),
  removeTest: accessTokenProcedure.input(removeTestByIdSchema).mutation(TestController.removeTest),
  completeTest: accessTokenProcedure
    .input(completeTestSchema)
    .mutation(TestController.completeTest),
  updateTest: accessTokenProcedure.input(updateTestSchema).mutation(TestController.updateTest),
  addQuestion: accessTokenProcedure.input(addQuestionSchema).mutation(TestController.addQuestion),
  removeQuestion: accessTokenProcedure
    .input(removeQuestionSchema)
    .mutation(TestController.removeQuestion),
});
