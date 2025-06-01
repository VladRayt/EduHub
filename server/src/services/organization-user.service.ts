import { prisma } from '@/config/db';
import { OrganizationUser } from '@/@types/type';

type IncludeFields = {
  user?: boolean;
  organization?: boolean;
  completedTests?: boolean;
};

class OrganizationUserService {
  public static async findUniqueById(input: {
    userId: string;
    organizationId: string;
    includeFields?: IncludeFields;
  }): Promise<OrganizationUser | null> {
    const { userId, organizationId, includeFields } = input;
    return prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      include: includeFields,
    });
  }
  public static async findManyById(input: {
    organizationId?: string;
    userId?: string;
    includeFields?: IncludeFields;
    skip?: number;
    take?: number;
  }): Promise<OrganizationUser[] | undefined> {
    const { organizationId, userId, includeFields, skip, take } = input;
    if (organizationId && userId) {
      return prisma.organizationUser.findMany({
        where: {
          organizationId,
          userId,
        },
        include: includeFields,
        skip,
        take,
      });
    } else if (organizationId) {
      return prisma.organizationUser.findMany({
        where: {
          organizationId,
        },
        include: includeFields,
        skip,
        take,
      });
    } else if (userId) {
      return prisma.organizationUser.findMany({
        where: {
          userId,
        },
        include: includeFields,
        skip,
        take,
      });
    }
  }
  public static async updateApprovement(input: {
    userId: string;
    organizationId: string;
    approvement: OrganizationUser['approvement'];
    includeFields?: IncludeFields;
  }) {
    const { userId, organizationId, approvement, includeFields } = input;

    return prisma.organizationUser.update({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      data: {
        approvement,
      },
      include: includeFields,
    });
  }
}

export default OrganizationUserService;
