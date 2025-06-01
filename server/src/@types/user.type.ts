import { TypeOf, z } from 'zod';

import { ContextType } from '@/config/trpc';

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const accessByIdSchema = z.object({ id: z.string() });

export const updateNameSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const getUsersListSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1),
});

export const restorePasswordEmailSchema = z.object({
  email: z.string().email(),
});

export const verifyRestorationCodeSchema = z.object({
  email: z.string().email(),
  code: z.string(),
});

export const signInWithCodeSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  code: z.string(),
});

export const createUserFromEmailSchema = z.object({
  email: z.string().email(),
});

export type UserProcedureType = {
  accessById: { input: TypeOf<typeof accessByIdSchema>; ctx: ContextType };
  signIn: { input: TypeOf<typeof signInSchema>; ctx: ContextType };
  signUp: { input: TypeOf<typeof signUpSchema>; ctx: ContextType };
  updateName: { input: TypeOf<typeof updateNameSchema>; ctx: ContextType };
  getUsersList: { input: TypeOf<typeof getUsersListSchema>; ctx: ContextType };
  sendRestorePasswordEmail: { input: TypeOf<typeof restorePasswordEmailSchema>; ctx: ContextType };
  verifyRestorationCodeSchema: {
    input: TypeOf<typeof verifyRestorationCodeSchema>;
    ctx: ContextType;
  };
  restorePassword: { input: TypeOf<typeof signInWithCodeSchema>; ctx: ContextType };
  signInWithVerificationCode: { input: TypeOf<typeof signInWithCodeSchema>; ctx: ContextType };
  createUserFromEmail: { input: TypeOf<typeof createUserFromEmailSchema>; ctx: ContextType };
};
