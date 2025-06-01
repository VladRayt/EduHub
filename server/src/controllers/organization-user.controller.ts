import { OrganizationProcedureType } from '@/@types/organization.type';
import {
  Approvement,
  ControllerReturnType,
  Organization,
  OrganizationUser,
  Permission,
  ResponseStatus,
} from '@/@types/type';
import OrganizationService from '@/services/organization.service';
import OrganizationUserService from '@/services/organization-user.service';

class OrganizationUserController {
  public static async getUsersFromOrganization({
    input,
  }: OrganizationProcedureType['getList']): ControllerReturnType<OrganizationUser[] | undefined> {
    const { page, limit, id: organizationId } = input;
    const skip = (Number(page) - 1) * Number(limit);
    if (!organizationId) {
      return { status: ResponseStatus.FAILURE, error: 'Organization ID is required' };
    }
    try {
      const users = await OrganizationUserService.findManyById({
        organizationId,
        skip,
        take: Number(limit),
        includeFields: {
          user: true,
        },
      });
      if (users) {
        return { data: users, status: ResponseStatus.SUCCESS };
      } else {
        return { data: [], status: ResponseStatus.FAILURE, error: 'No such members found' };
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      return { status: ResponseStatus.FAILURE, error: 'Internal server error' };
    }
  }
  public static async addUserToOrganization({
    input,
  }: OrganizationProcedureType['addUserToOrganization']): ControllerReturnType<
    Organization | undefined
  > {
    const { userId, organizationId, permission } = input;
    if (!userId || !organizationId || !permission) {
      return {
        error: 'User ID, organization ID and permission are required',
        status: ResponseStatus.FAILURE,
      };
    }

    try {
      const memberWithSameName = await OrganizationService.findMemberById({
        organizationId,
        userId,
      });
      if (memberWithSameName) {
        return { error: 'User already exists in the organization', status: ResponseStatus.FAILURE };
      }
      const organization = await OrganizationService.updateMembersList({
        organizationId,
        userId,
        permission: permission as Permission,
      });

      if (!organization?.members) {
        return { error: 'Members not found', status: ResponseStatus.FAILURE };
      } else {
        return { data: organization, status: ResponseStatus.SUCCESS };
      }
    } catch (error) {
      console.error('Error with adding user to organization:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async acceptUserToOrganization({
    input,
  }: OrganizationProcedureType['acceptUserToOrganization']): ControllerReturnType<
    OrganizationUser | undefined | {}
  > {
    const { userId, organizationId, approvement } = input;
    if (!userId || !organizationId || !approvement) {
      return {
        error: 'User ID, organization ID and approvement are required',
        status: ResponseStatus.FAILURE,
      };
    }

    try {
      const organizationUser = await OrganizationUserService.findUniqueById({
        userId,
        organizationId,
        includeFields: {
          organization: true,
        },
      });

      if (!organizationUser) {
        return { error: 'User not found in the organization', status: ResponseStatus.FAILURE };
      }

      if (approvement === Approvement.DECLINED) {
        await OrganizationService.deleteMemberById({
          organizationId,
          userId,
        });
        return { status: ResponseStatus.SUCCESS };
      }

      const updatedUser = await OrganizationUserService.updateApprovement({
        organizationId,
        userId,
        approvement,
        includeFields: {
          user: true,
        },
      });

      if (!updatedUser) {
        return { error: 'Members not found', status: ResponseStatus.FAILURE };
      } else {
        return { data: updatedUser, status: ResponseStatus.SUCCESS };
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async removeUserFromWorkspace({
    input,
  }: OrganizationProcedureType['removeUserFromOrganization']): ControllerReturnType<
    OrganizationUser | undefined
  > {
    const { userId, organizationId } = input;
    if (!userId || !organizationId) {
      return { error: 'User ID and organization ID are required', status: ResponseStatus.FAILURE };
    }

    try {
      const organizationUser = await OrganizationUserService.findUniqueById({
        userId,
        organizationId,
        includeFields: {
          organization: true,
        },
      });

      if (!organizationUser) {
        return { error: 'User not found in the organization', status: ResponseStatus.FAILURE };
      } else if (organizationUser.organization?.authorId === userId) {
        return {
          error: 'Access declined. Unable to remove creator',
          status: ResponseStatus.FAILURE,
        };
      }

      await OrganizationService.deleteMemberById({ userId, organizationId });

      return { status: ResponseStatus.SUCCESS };
    } catch (error) {
      console.error('Error creating user:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
}

export default OrganizationUserController;
