import { prisma } from '@/config/db';
import { Approvement, Organization, Permission } from '@/@types/type';

type IncludeFields = {
  members?: boolean;
  tests?: boolean;
};

class OrganizationService {
  public static async findUniqueById(input: {
    organizationId: string;
    includeFields?: IncludeFields;
  }) {
    const { organizationId, includeFields } = input;

    return prisma.organization.findUnique({
      where: { id: organizationId },
      include: includeFields,
    });
  }
  public static async findMany(input: {
    skip: number;
    take: number;
    includeFields?: IncludeFields;
    userId?: string;
  }) {
    const { skip, take, includeFields, userId } = input;

    if (userId) {
      return prisma.organization.findMany({
        where: {
          members: {
            some: {
              userId,
            },
          },
        },
        skip,
        take,
        include: includeFields,
      });
    }
    return prisma.organization.findMany({
      skip,
      take,
      include: includeFields,
    });
  }
  public static async createOrganization(input: {
    title: string;
    userId: string;
    userName: string;
    color: string;
    description: string;
  }) {
    const { title, userId, userName, color, description } = input;

    return prisma.organization.create({
      data: {
        title,
        authorId: userId,
        authorName: userName,
        color,
        description,
        members: {
          create: [
            {
              userId,
              permission: Permission.WRITE,
              approvement: Approvement.ACCEPTED,
            },
          ],
        },
      },
      include: {
        members: true,
      },
    });
  }
  public static async updateUnique(input: {
    organizationId: string;
    organizationData: Partial<Organization>;
  }): Promise<Organization | null> {
    const { organizationId, organizationData } = input;

    return prisma.organization.update({
      where: { id: organizationId },
      data: {
        title: organizationData.title,
        description: organizationData.description,
        color: organizationData.color,
      },
      include: {
        members: true,
      },
    });
  }
  public static async findMemberById(input: { organizationId: string; userId: string }) {
    const { organizationId, userId } = input;

    return prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          organizationId,
          userId,
        },
      },
    });
  }
  public static async updateMembersList(input: {
    organizationId: string;
    userId: string;
    permission: Permission;
  }): Promise<Organization | null> {
    const { organizationId, userId, permission } = input;

    return prisma.organization.update({
      where: { id: organizationId },
      data: {
        members: {
          create: {
            user: { connect: { id: userId } },
            permission,
            approvement: Approvement.PENDING,
          },
        },
      },
      include: {
        members: true,
      },
    });
  }
  public static async deleteMemberById(input: { userId: string; organizationId: string }) {
    const { userId, organizationId } = input;

    return prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        members: {
          delete: {
            userId_organizationId: {
              userId,
              organizationId,
            },
          },
        },
      },
      include: {
        members: true,
      },
    });
  }
  public static async deleteById(input: { organizationId: string }) {
    const { organizationId } = input;

    return prisma.organization.delete({
      where: { id: organizationId },
    });
  }
}
export default OrganizationService;
