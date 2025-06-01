import { TypeOf, z } from 'zod';

import { ContextType } from '@/config/trpc';

import { accessByIdSchema } from './user.type';

export const getListSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1),
  id: z.string(),
});

export const createOrganizationSchema = z.object({
  title: z.string(),
  description: z.string(),
  userId: z.string(),
  color: z.string(),
});

export const updateOrganizationSchema = z.object({
  organizationId: z.string(),
  organizationData: z.object({
    title: z.string(),
    description: z.string(),
    color: z.string(),
  }),
});

export const addUserToOrganizationSchema = z.object({
  userId: z.string(),
  organizationId: z.string(),
  permission: z.enum(['READ', 'WRITE']),
});

export const acceptUserToOrganizationSchema = z.object({
  userId: z.string(),
  organizationId: z.string(),
  approvement: z.enum(['DECLINED', 'PENDING', 'ACCEPTED']),
});

export const removeUserFromOrganizationSchema = z.object({
  userId: z.string(),
  organizationId: z.string(),
});

export type OrganizationProcedureType = {
  accessById: { input: TypeOf<typeof accessByIdSchema>; ctx: ContextType };
  getList: { input: TypeOf<typeof getListSchema>; ctx: ContextType };
  createOrganization: { input: TypeOf<typeof createOrganizationSchema>; ctx: ContextType };
  updateOrganization: { input: TypeOf<typeof updateOrganizationSchema>; ctx: ContextType };
  deleteOrganization: { input: TypeOf<typeof accessByIdSchema>; ctx: ContextType };
  addUserToOrganization: { input: TypeOf<typeof addUserToOrganizationSchema>; ctx: ContextType };
  acceptUserToOrganization: {
    input: TypeOf<typeof acceptUserToOrganizationSchema>;
    ctx: ContextType;
  };
  removeUserFromOrganization: {
    input: TypeOf<typeof removeUserFromOrganizationSchema>;
    ctx: ContextType;
  };
};
