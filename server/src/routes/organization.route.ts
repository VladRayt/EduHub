import { router } from '@/config/trpc';
import OrganizationController from '@/controllers/organization.controller';
import OrganizationUserController from '@/controllers/organization-user.controller';
import {
  acceptUserToOrganizationSchema,
  addUserToOrganizationSchema,
  createOrganizationSchema,
  getListSchema,
  removeUserFromOrganizationSchema,
  updateOrganizationSchema,
} from '@/@types/organization.type';
import { accessByIdSchema } from '@/@types/user.type';
import { accessTokenProcedure } from '@/middlewares/auth.middleware';

export const organizationRouter = router({
  getOrganizationsById: accessTokenProcedure
    .input(accessByIdSchema)
    .query(OrganizationController.getOrganizationsById),
  getOrganizationsList: accessTokenProcedure
    .input(getListSchema)
    .query(OrganizationController.getOrganizationsList),
  createOrganization: accessTokenProcedure
    .input(createOrganizationSchema)
    .mutation(OrganizationController.createOrganization),
  updateOrganization: accessTokenProcedure
    .input(updateOrganizationSchema)
    .mutation(OrganizationController.updateOrganization),
  deleteOrganization: accessTokenProcedure
    .input(accessByIdSchema)
    .mutation(OrganizationController.deleteOrganization),
  getUsersFromOrganization: accessTokenProcedure
    .input(getListSchema)
    .query(OrganizationUserController.getUsersFromOrganization),
  addUserToOrganization: accessTokenProcedure
    .input(addUserToOrganizationSchema)
    .mutation(OrganizationUserController.addUserToOrganization),
  acceptUserToOrganization: accessTokenProcedure
    .input(acceptUserToOrganizationSchema)
    .mutation(OrganizationUserController.acceptUserToOrganization),
  removeUserFromOrganization: accessTokenProcedure
    .input(removeUserFromOrganizationSchema)
    .mutation(OrganizationUserController.removeUserFromWorkspace),
});
