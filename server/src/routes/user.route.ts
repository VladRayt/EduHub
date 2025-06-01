import { procedure, router } from '@/config/trpc';
import UserController from '@/controllers/user.controller';
import {
  accessByIdSchema,
  createUserFromEmailSchema,
  getUsersListSchema,
  restorePasswordEmailSchema,
  signInSchema,
  signInWithCodeSchema,
  signUpSchema,
  updateNameSchema,
} from '@/@types/user.type';
import { accessTokenProcedure } from '@/middlewares/auth.middleware';

export const userRouter = router({
  getUserById: accessTokenProcedure.input(accessByIdSchema).query(UserController.getUserById),
  getUsersList: accessTokenProcedure.input(getUsersListSchema).query(UserController.getUserList),
  signIn: procedure.input(signInSchema).mutation(UserController.signInUser),
  signUp: procedure.input(signUpSchema).mutation(UserController.createUser),
  validateToken: accessTokenProcedure.input(accessByIdSchema).query(UserController.verifyToken),
  updateUserName: accessTokenProcedure
    .input(updateNameSchema)
    .mutation(UserController.updateUserName),
  deleteUser: accessTokenProcedure.input(accessByIdSchema).mutation(UserController.deleteUser),
  sendRestorationCode: procedure
    .input(restorePasswordEmailSchema)
    .mutation(UserController.activatePasswordRestoring),
  restorePassword: accessTokenProcedure
    .input(signInWithCodeSchema)
    .mutation(UserController.restorePassword),
  signInWithCode: procedure.input(signInWithCodeSchema).mutation(UserController.signInUserWithCode),
  createUserWithEmail: accessTokenProcedure
    .input(createUserFromEmailSchema)
    .mutation(UserController.createUserFromEmail),
});
