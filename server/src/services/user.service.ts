import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { prisma } from '@/config/db';

const jwtSecret = process.env.JWT_SECRET as string;

type IncludeFields = {
  organizations?: boolean;
  refreshToken?: boolean;
  auth?: boolean;
};

class UserService {
  public static async findUniqueById(input: { userId: string; includeFields?: IncludeFields }) {
    const { userId, includeFields } = input;

    return prisma.user.findUnique({
      where: { id: userId },
      include: includeFields,
    });
  }
  public static async findUniqueByEmail(input: { email: string; includeFields?: IncludeFields }) {
    const { email, includeFields } = input;

    const user = await prisma.user.findUnique({
      where: { email: email },
      include: includeFields,
    });

    if (user) {
      const userAuth = await prisma.userAuth.findUnique({
        where: { userId: user?.id },
      });
      const userRefreshToken = await prisma.userAuth.findUnique({
        where: { userId: user.id },
      });
      return {
        userWithSuchEmail: user,
        userRefreshToken: userRefreshToken?.token ?? null,
        authInfo: userAuth,
      };
    }
    return { userWithSuchEmail: null, userRefreshToken: null, authInfo: null };
  }
  public static async updateName(input: {
    userId: string;
    newName: string;
    includeFields?: IncludeFields;
  }) {
    const { userId, newName, includeFields } = input;

    return await prisma.user.update({
      where: { id: userId },
      data: {
        name: newName,
      },
      include: includeFields,
    });
  }
  public static async findMany(input: {
    skip: number;
    take: number;
    includeFields?: IncludeFields;
  }) {
    const { skip, take, includeFields } = input;

    return prisma.user.findMany({
      skip,
      take,
      include: includeFields,
    });
  }
  public static async createUser(input: {
    email: string;
    name: string;
    password: string;
    oneTimePassword?: boolean;
  }) {
    const { email, name, password, oneTimePassword = false } = input;

    const newRefreshToken: string = crypto.randomBytes(32).toString('hex');
    const userCode: string = crypto.randomBytes(10).toString('hex');

    const user = await prisma.user.create({
      data: {
        email,
        name,
        auth: {
          create: { password, token: newRefreshToken, restorationCode: userCode, oneTimePassword },
        },
      },
    });

    return {
      user,
      refreshToken: newRefreshToken,
      accessToken: jwt.sign({ _id: user?.id, email: email }, jwtSecret, {
        expiresIn: '30d',
      }),
      code: userCode,
    };
  }
  public static async deleteById(input: { userId: string }) {
    const { userId } = input;

    return prisma.user.delete({
      where: { id: userId },
    });
  }
  public static async updateRefreshToken(input: {
    userId: string;
    email: string;
    userRefreshToken?: string;
  }) {
    const { userId, email, userRefreshToken } = input;

    try {
      const token = jwt.sign({ _id: userId, email: email }, jwtSecret, {
        expiresIn: '30d',
      });
      const newRefreshToken = crypto.randomBytes(32).toString('hex');

      if (userRefreshToken) {
        await prisma.userAuth.update({
          where: { userId: userId, token: userRefreshToken },
          data: { token: newRefreshToken },
        });
      } else {
        await prisma.userAuth.update({
          where: { userId: userId },
          data: { token: newRefreshToken },
        });
      }

      return { token, refreshToken: newRefreshToken };
    } catch (error) {
      return { token: null, refreshToken: null };
    }
  }
  public static async userRestorationCodeAction(input: {
    userId: string;
    action: 'Remove' | 'Create';
  }) {
    const { action, userId } = input;

    const userRecoverCode = crypto.randomBytes(10).toString('hex');
    await prisma.userAuth.update({
      where: { userId },
      data: {
        restorationCode: action === 'Create' ? userRecoverCode : null,
      },
    });
    return { userRecoverCode };
  }
  public static async updatePassword(input: { userId: string; password: string }) {
    const { userId, password } = input;

    return prisma.userAuth.update({
      where: { userId },
      data: { password, oneTimePassword: false },
    });
  }
}
export default UserService;
