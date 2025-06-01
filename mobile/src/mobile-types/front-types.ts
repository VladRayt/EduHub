import {
  Answer as PrismaAnswer,
  CompletedTest as PrismaCompletedTest,
  Organization as PrismaOrganization,
  OrganizationUser as PrismaOrganizationUser,
  Question as PrismaQuestion,
  Test as PrismaTest,
  User as PrismaUser,
  UserAnswer as PrismaUserAnswer,
  UserAuth as PrismaUserAuth,
} from '@prisma/client';

export enum ResponseStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export enum Permission {
  READ = 'READ',
  WRITE = 'WRITE',
}

export enum Approvement {
  DECLINED = 'DECLINED',
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
}

export enum Sorting {
  A_Z = 'A_Z',
  Z_A = 'Z_A',
  ZERO_NINE = 'ZERO_NINE',
  NINE_ZERO = 'NINE_ZERO',
}

export type Organization = PrismaOrganization & {
  members?: OrganizationUser[];
  tests?: Test[];
};

export type User = PrismaUser & {
  organizations?: OrganizationUser[];
  auth?: PrismaUserAuth;
};

export type OrganizationUser = PrismaOrganizationUser & {
  permission: keyof typeof Permission;
  approvement: keyof typeof Approvement;
  user?: User;
  organization?: Organization;
  completedTests?: CompletedTest[];
  createdTests?: Test[];
};

export type Test = PrismaTest & {
  usersThatComplete?: CompletedTest[];
  questions?: Question[];
  organizationUser?: OrganizationUser;
};

export type Question = PrismaQuestion & {
  answerList?: UserAnswer[];
  answers?: Answer[];
  test?: Test;
};

export type Answer = PrismaAnswer & {
  question?: Question;
  userAnswer?: UserAnswer[];
};

export type CompletedTest = PrismaCompletedTest & {
  userAnswers?: UserAnswer[];
  organizationUser?: OrganizationUser;
  test?: Test;
};

export type UserAnswer = PrismaUserAnswer & {
  question?: Question;
  selectedAnswer?: Answer;
  completedTest?: CompletedTest;
};

export type ControllerReturnType<T> = Promise<{
  status: ResponseStatus;
  data?: T | undefined;
  error?: string;
}>;
