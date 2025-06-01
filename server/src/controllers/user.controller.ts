import crypto from 'crypto';

import { ControllerReturnType, ResponseStatus, User } from '@/@types/type';
import { UserProcedureType } from '@/@types/user.type';
import EmailService from '@/services/email.service';
import UserService from '@/services/user.service';

class UserController {
  public static async getUserList({
    input,
  }: UserProcedureType['getUsersList']): ControllerReturnType<User[] | undefined> {
    const { page, limit } = input;

    const skip = (Number(page) - 1) * Number(limit);
    try {
      const users = await UserService.findMany({
        skip,
        take: Number(limit),
      });
      if (!users) {
        return { error: 'Users not found', status: ResponseStatus.FAILURE };
      }
      return { data: users, status: ResponseStatus.SUCCESS };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async getUserById({
    input,
  }: UserProcedureType['accessById']): ControllerReturnType<User | undefined> {
    const { id } = input;
    try {
      const user = await UserService.findUniqueById({
        userId: id,
        includeFields: {
          organizations: true,
        },
      });

      if (user) {
        return { data: user, status: ResponseStatus.SUCCESS };
      } else {
        return { error: 'User not found', status: ResponseStatus.FAILURE };
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async signInUser({ input, ctx }: UserProcedureType['signIn']): ControllerReturnType<
    | (User & {
        tokens: {
          token: string | null;
          userRefreshToken: string | null;
        };
      })
    | undefined
  > {
    const { email, password } = input;
    const { refreshToken: oldRefreshToken } = ctx;
    const { userWithSuchEmail, userRefreshToken, authInfo } = await UserService.findUniqueByEmail({
      email,
    });

    // if (userRefreshToken !== oldRefreshToken) {
    //   return { error: 'Incorrect refresh token', status: ResponseStatus.FAILURE };
    // }

    if (!userWithSuchEmail) {
      return { error: 'Create user first', status: ResponseStatus.FAILURE };
    }

    const isPasswordMatched = await Bun.password.verify(password, authInfo?.password as string);

    if (!isPasswordMatched) {
      return { error: 'Incorrect password', status: ResponseStatus.FAILURE };
    }

    const { token, refreshToken } = await UserService.updateRefreshToken({
      userId: userWithSuchEmail.id,
      email,
      userRefreshToken: userRefreshToken as string,
    });

    return {
      data: { ...userWithSuchEmail, tokens: { token, userRefreshToken: refreshToken } },
      status: ResponseStatus.SUCCESS,
    };
  }
  public static async updateUserName({
    input,
  }: UserProcedureType['updateName']): ControllerReturnType<User | undefined> {
    const { name, id } = input;

    try {
      const user = await UserService.updateName({
        userId: id,
        newName: name,
        includeFields: {
          organizations: true,
        },
      });

      if (!user) {
        return { error: 'No such user', status: ResponseStatus.FAILURE };
      }

      return {
        data: user,
        status: ResponseStatus.SUCCESS,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async createUser({
    input,
  }: UserProcedureType['signUp']): ControllerReturnType<
    { token: string | null; userRefreshToken: string | null } | undefined
  > {
    const { name, email, password } = input;
    const { userWithSuchEmail } = await UserService.findUniqueByEmail({
      email,
    });

    if (userWithSuchEmail) {
      return { error: 'User with such email already exists', status: ResponseStatus.FAILURE };
    }

    try {
      const hashedPassword = await Bun.password.hash(password);

      if (!hashedPassword) {
        return { error: 'Error with password', status: ResponseStatus.FAILURE };
      }

      const {
        refreshToken: userRefreshToken,
        accessToken,
        code,
      } = await UserService.createUser({
        name,
        email,
        password: hashedPassword,
      });

      await EmailService.sendRestoreEmail(email, code);

      return {
        data: { token: accessToken, userRefreshToken },
        status: ResponseStatus.SUCCESS,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async deleteUser({
    input,
  }: UserProcedureType['accessById']): ControllerReturnType<{} | undefined> {
    const { id } = input;
    if (!id) {
      return { error: 'User ID is required', status: ResponseStatus.FAILURE };
    }

    try {
      await UserService.deleteById({ userId: id });
      return { status: ResponseStatus.SUCCESS };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async activatePasswordRestoring({
    input,
  }: UserProcedureType['sendRestorePasswordEmail']): ControllerReturnType<{} | undefined> {
    const { email } = input;

    try {
      const { userWithSuchEmail } = await UserService.findUniqueByEmail({ email });

      if (!userWithSuchEmail) {
        return { error: 'User with such email not found', status: ResponseStatus.FAILURE };
      }

      const { userRecoverCode } = await UserService.userRestorationCodeAction({
        userId: userWithSuchEmail.id,
        action: 'Create',
      });

      EmailService.sendRestoreEmail(email, userRecoverCode);

      return { data: 'Email sended', status: ResponseStatus.SUCCESS };
    } catch (error) {
      return { error: 'Interval server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async restorePassword({
    input,
  }: UserProcedureType['restorePassword']): ControllerReturnType<
    (User & { token: string | null; userRefreshToken: string | null }) | undefined
  > {
    const { email, password, code } = input;

    try {
      const { userWithSuchEmail, userRefreshToken, authInfo } = await UserService.findUniqueByEmail(
        {
          email,
        }
      );

      if (!userWithSuchEmail) {
        return { error: 'User with such email not found', status: ResponseStatus.FAILURE };
      }

      if (code !== authInfo?.restorationCode) {
        return { error: 'Code is invalid', status: ResponseStatus.FAILURE };
      }

      const hashedPassword = await Bun.password.hash(password);

      await UserService.updatePassword({ userId: userWithSuchEmail.id, password: hashedPassword });

      const { refreshToken, token } = await UserService.updateRefreshToken({
        userId: userWithSuchEmail.id,
        email,
        userRefreshToken: userRefreshToken as string,
      });

      if (!refreshToken || !token) {
        return { error: 'Error with token creating', status: ResponseStatus.FAILURE };
      }

      return {
        data: {
          ...userWithSuchEmail,
          token,
          userRefreshToken: refreshToken,
        },
        status: ResponseStatus.SUCCESS,
      };
    } catch (error) {
      return { error: 'Interval server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async signInUserWithCode({
    input,
  }: UserProcedureType['signInWithVerificationCode']): ControllerReturnType<
    | (User & {
        tokens: {
          token: string | null;
          userRefreshToken: string | null;
        };
        oneTimePassword?: boolean;
      })
    | undefined
  > {
    const { email, code, password } = input;
    const { userWithSuchEmail, userRefreshToken, authInfo } = await UserService.findUniqueByEmail({
      email,
    });

    if (code !== authInfo?.restorationCode) {
      return { error: 'Code is incorrect', status: ResponseStatus.FAILURE };
    }

    if (!userWithSuchEmail) {
      return { error: 'Create user first', status: ResponseStatus.FAILURE };
    }

    const isPasswordMatched = password
      ? await Bun.password.verify(password, authInfo?.password as string)
      : true;
    if (!isPasswordMatched) {
      return { error: 'Incorrect password', status: ResponseStatus.FAILURE };
    }

    const { token, refreshToken } = await UserService.updateRefreshToken({
      userId: userWithSuchEmail.id,
      email,
      userRefreshToken: userRefreshToken as string,
    });

    return {
      data: {
        ...userWithSuchEmail,
        tokens: { token, userRefreshToken: refreshToken },
        oneTimePassword: authInfo.oneTimePassword,
      },
      status: ResponseStatus.SUCCESS,
    };
  }
  public static async createUserFromEmail({
    input,
  }: UserProcedureType['createUserFromEmail']): ControllerReturnType<User | undefined> {
    const { email } = input;

    console.log(`🔍 Creating user for email: ${email}`);

    const { userWithSuchEmail } = await UserService.findUniqueByEmail({
      email,
    });

    if (userWithSuchEmail) {
      console.log('✅ User already exists, returning existing user');
      return {
        data: userWithSuchEmail,
        status: ResponseStatus.SUCCESS,
      };
    }

    const [name] = email.split('@');
    const firstTimePassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await Bun.password.hash(firstTimePassword);

    try {
      console.log('👤 Creating new user...');
      const { user } = await UserService.createUser({
        email,
        name,
        password: hashedPassword,
        oneTimePassword: true,
      });

      if (!user) {
        return { error: 'User is not created', status: ResponseStatus.FAILURE };
      }

      console.log('✅ User created:', user.id);

      try {
        await EmailService.sendOneTimePassword(email, firstTimePassword);
        console.log('✅ Email sent successfully');
      } catch (emailError) {
        console.error('❌ Failed to send email:', emailError);
        return {
          error: 'User created but email sending failed. Please contact support.',
          status: ResponseStatus.FAILURE,
        };
      }

      return {
        data: user,
        status: ResponseStatus.SUCCESS,
      };
    } catch (error) {
      console.error('❌ Error creating user:', error);
      return { error: 'Internal server error', status: ResponseStatus.FAILURE };
    }
  }
  public static async verifyToken({
    input,
  }: UserProcedureType['accessById']): ControllerReturnType<boolean> {
    const { id } = input;

    const user = (await UserService.findUniqueById({
      userId: id,
      includeFields: {
        auth: true,
      },
    })) as User;

    if (!id || !user) {
      return { error: 'Id is required', status: ResponseStatus.FAILURE };
    }

    return {
      data: true,
      status: ResponseStatus.SUCCESS,
    };
  }
}

export default UserController;
