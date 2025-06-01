import { OrganizationProcedureType } from '@/@types/organization.type';
import { ControllerReturnType, Organization, ResponseStatus } from '@/@types/type';
import OrganizationService from '@/services/organization.service';
import UserService from '@/services/user.service';

class OrganizationController {
  public static async getOrganizationsList({
    input,
  }: OrganizationProcedureType['getList']): ControllerReturnType<Organization[] | undefined> {
    const { page, limit, id: userId } = input;
    const skip = (Number(page) - 1) * Number(limit);
    try {
      const organizations = await OrganizationService.findMany({
        skip,
        take: Number(limit),
        userId: userId,
        includeFields: {
          members: true,
        },
      });
      return { data: organizations || [], status: ResponseStatus.SUCCESS };
    } catch (error) {
      console.error('Error fetching organizations:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async getOrganizationsById({
    input,
  }: OrganizationProcedureType['accessById']): ControllerReturnType<Organization | undefined> {
    const { id } = input;
    if (!id) {
      return { error: 'Organization ID is required', status: ResponseStatus.FAILURE };
    }
    try {
      const organization = await OrganizationService.findUniqueById({
        organizationId: id,
        includeFields: {
          members: true,
        },
      });
      if (!organization) {
        return { error: 'Organization not found', status: ResponseStatus.FAILURE };
      } else {
        return { data: organization, status: ResponseStatus.SUCCESS };
      }
    } catch (error) {
      console.error('Error fetching organization by ID:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async createOrganization({
    input,
  }: OrganizationProcedureType['createOrganization']): ControllerReturnType<
    Organization | undefined
  > {
    const { title, userId, color, description } = input;

    if (!title || !userId) {
      return { error: 'Title and user ID are required', status: ResponseStatus.FAILURE };
    }

    const userWithSuchId = await UserService.findUniqueById({
      userId,
    });

    if (!userWithSuchId) {
      return { error: 'User not found', status: ResponseStatus.FAILURE };
    }

    try {
      const organization = await OrganizationService.createOrganization({
        title,
        userId,
        userName: userWithSuchId.name,
        color,
        description,
      });

      if (!organization) {
        return { error: 'Organization not found', status: ResponseStatus.FAILURE };
      } else {
        return { data: organization, status: ResponseStatus.SUCCESS };
      }
    } catch (error) {
      console.error('Error creating user:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async deleteOrganization({
    input,
  }: OrganizationProcedureType['accessById']): ControllerReturnType<{} | undefined> {
    const { id } = input;

    if (!id) {
      return { error: 'Organization ID is required', status: ResponseStatus.FAILURE };
    }

    try {
      await OrganizationService.deleteById({
        organizationId: id,
      });
      return { status: ResponseStatus.SUCCESS };
    } catch (error) {
      console.error('Error deleting organization:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async updateOrganization({
    input,
  }: OrganizationProcedureType['updateOrganization']): ControllerReturnType<Organization> {
    if (!input.organizationId) {
      return { error: 'Organization ID is required', status: ResponseStatus.FAILURE };
    }
    try {
      const updatedOrganization = await OrganizationService.updateUnique(input);
      if (!updatedOrganization) {
        return { error: 'Organization not updated', status: ResponseStatus.FAILURE };
      }

      return { data: updatedOrganization, status: ResponseStatus.SUCCESS };
    } catch (error) {
      console.error('Error deleting organization:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
}

export default OrganizationController;
