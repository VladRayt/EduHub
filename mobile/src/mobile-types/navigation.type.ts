import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
// export type ProfileRouteProps<T extends ProfileNavigation> = RouteProp<ProfileStackParamsList, T>;
import type { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackNavigationProp } from '@react-navigation/stack';
import { PrimaryColor } from '@styles/colors';

import { Approvement, Permission, Sorting } from './front-types';

export enum AuthNavigation {
  SIGN_IN = 'SignIn',
  SIGN_UP = 'SignUp',
  RESTORE_PASSWORD = 'RestorePassword',
  ENTER_CODE = 'EnterCode',
  MAIN = 'Main',
}

export type AuthStackParamList = {
  [AuthNavigation.SIGN_IN]: undefined;
  [AuthNavigation.SIGN_UP]: undefined;
  [AuthNavigation.RESTORE_PASSWORD]: { code: string };
  [AuthNavigation.ENTER_CODE]: { email: string; password: string };
  [AuthNavigation.MAIN]: NavigatorScreenParams<BottomTabParamsList>;
};

export enum BottomTabsRoutes {
  WORKSPACES = 'Workspaces',
  PROFILE = 'Profile',
  PROGRESS = 'Progress',
}

export type BottomTabParamsList = {
  [BottomTabsRoutes.WORKSPACES]: NavigatorScreenParams<MainStackParamsList>;
  [BottomTabsRoutes.PROGRESS]: NavigatorScreenParams<ProgressStackParamsList>;
  [BottomTabsRoutes.PROFILE]: NavigatorScreenParams<ProfileStackParamsList>;
};

export enum MainNavigation {
  CREATE_ORGANIZATION = 'CreateOrganization',
  MAIN_LIST = 'MainList',
  ORGANIZATION_DETAILS = 'OrganizationDetails',
  TEST_DETAILS = 'TestDetails',
  COMPLETED_TEST_DETAILS = 'CompletedTestDetails',
  CREATE_TEST = 'CreateTest',
  ALL_ORGANIZATIONS = 'AllOrganizations',
  TEST_COMPLETING = 'TestCompleting',
  COMPLETED_TEST_REVIEW = 'CompletedTestReview',
}

export type MainStackParamsList = {
  [MainNavigation.CREATE_ORGANIZATION]: undefined;
  [MainNavigation.ALL_ORGANIZATIONS]: {
    roleFilter?: Permission;
    approveFilter?: Approvement;
    searchFilter?: string;
    sorting?: Sorting;
  };
  [MainNavigation.MAIN_LIST]: undefined;
  [MainNavigation.ORGANIZATION_DETAILS]: { organizationId: string };
  [MainNavigation.TEST_DETAILS]: { testId: number };
  [MainNavigation.COMPLETED_TEST_DETAILS]: { testId: number };
  [MainNavigation.CREATE_TEST]: { organizationId: string };
  [MainNavigation.TEST_COMPLETING]: { organizationColor: PrimaryColor };
  [MainNavigation.COMPLETED_TEST_REVIEW]: { organizationColor: PrimaryColor };
};

export enum ProfileNavigation {
  SETTINGS_LIST = 'SettingsList',
  NOTIFICATION = 'Notifications',
  ORGANIZATION = 'OrganizationSettings',
  ORGANIZATION_SELECT = 'SelectOrganization',
  TEST = 'TestSettings',
  TEST_SELECT = 'SelectTest',
  PROFILE = 'ProfileSettings',
  ABOUT = 'About',
}

export type ProfileStackParamsList = {
  [ProfileNavigation.SETTINGS_LIST]: undefined;
  [ProfileNavigation.NOTIFICATION]: undefined;
  [ProfileNavigation.ORGANIZATION]: { organizationId: string; userToDelete?: string };
  [ProfileNavigation.ORGANIZATION_SELECT]: {
    roleFilter?: Permission;
    approveFilter?: Approvement;
    searchFilter?: string;
    sorting?: Sorting;
  };
  [ProfileNavigation.TEST]: { testId: number; questionToDelete?: number };
  [ProfileNavigation.TEST_SELECT]: {
    completeFilter?: 'Completed' | 'Uncompleted';
    searchFilter?: string;
    sorting?: Sorting;
  };
  [ProfileNavigation.PROFILE]: undefined;
  [ProfileNavigation.ABOUT]: undefined;
};

export enum ProgressNavigation {
  HOME_ANALYTICS = 'HomeAnalytics',
  USER_ANALYTICS = 'UserAnalytics',
  TEST_ANALYTICS = 'TestAnalytics',
  ORGANIZATION_ANALYTICS = 'OrganizationAnalytics',
}

export type ProgressStackParamsList = {
  [ProgressNavigation.HOME_ANALYTICS]: undefined;
  [ProgressNavigation.USER_ANALYTICS]: { userId: string };
  [ProgressNavigation.TEST_ANALYTICS]: { testId: number };
  [ProgressNavigation.ORGANIZATION_ANALYTICS]: { organizationId: string };
};

export type AuthRouteProps<T extends AuthNavigation> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;
export type BottomTabRouteProps<T extends BottomTabsRoutes> = NativeStackScreenProps<
  BottomTabParamsList,
  T
>;
export type MainRouteProp<T extends MainNavigation> = NativeStackScreenProps<
  MainStackParamsList,
  T
>;
export type ProgressRouteProp<T extends ProgressNavigation> = NativeStackScreenProps<
  ProgressStackParamsList,
  T
>;
export type ProfileRouteProps<T extends ProfileNavigation> = NativeStackScreenProps<
  ProfileStackParamsList,
  T
>;

export type CompositeMainProfile = CompositeNavigationProp<
  CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabParamsList, BottomTabsRoutes>,
    StackNavigationProp<ProfileStackParamsList>
  >,
  StackNavigationProp<MainStackParamsList>
>;

export type CompositeMainProgress = CompositeNavigationProp<
  CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabParamsList, BottomTabsRoutes>,
    StackNavigationProp<ProgressStackParamsList>
  >,
  StackNavigationProp<MainStackParamsList>
>;

export type CompositeProgressProfile = CompositeNavigationProp<
  CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabParamsList, BottomTabsRoutes>,
    StackNavigationProp<ProgressStackParamsList>
  >,
  StackNavigationProp<ProfileStackParamsList>
>;
