import { useTranslation } from 'react-i18next';

import { IconButton } from '@components/IconButton';
import {
  BottomTabsRoutes,
  MainNavigation,
  ProfileNavigation,
  ProfileStackParamsList,
} from '../mobile-types/navigation.type';
import { OrganizationListHOC } from '@page/main/AllOrganizations';
import { About } from '@page/profile/AboutSettings';
import { OrganizationSettings } from '@page/profile/OrganizationSettings';
import { ProfileSettings } from '@page/profile/ProfileSettings/ProfileSettings';
import { SettingsList } from '@page/profile/SettingsList';
import { TestSelect, TestSettings } from '@page/profile/TestSettings';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

const ProfileStack = createNativeStackNavigator<ProfileStackParamsList>();

export const ProfileStackNavigation = () => {
  const { t } = useTranslation();

  return (
    <ProfileStack.Navigator initialRouteName={ProfileNavigation.SETTINGS_LIST}>
      <ProfileStack.Screen
        options={({ navigation }) => ({
          title: t('profile.list.header'),
          headerTitleStyle: {
            color: Colors.TEXT_DARK,
            ...typographyStyles.xl,
          },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <IconButton
              iconLib='Feather'
              iconName='arrow-left'
              iconColor={Colors.DARK_GRAY}
              onPress={() =>
                navigation.navigate(BottomTabsRoutes.WORKSPACES, {
                  screen: MainNavigation.MAIN_LIST,
                })
              }
            />
          ),
        })}
        name={ProfileNavigation.SETTINGS_LIST}
        component={SettingsList}
      />
      <ProfileStack.Screen
        options={({ navigation }) => ({
          title: t('profile.organization-details.header'),
          headerTitleStyle: {
            color: Colors.TEXT_DARK,
          },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <IconButton
              iconLib='Feather'
              iconName='arrow-left'
              iconColor={Colors.DARK_GRAY}
              onPress={() => navigation.navigate(ProfileNavigation.SETTINGS_LIST)}
            />
          ),
        })}
        name={ProfileNavigation.ORGANIZATION}
        component={OrganizationSettings}
      />
      <ProfileStack.Screen
        options={({ navigation }) => ({
          title: t('main.organizations-list.header'),
          headerTitleStyle: {
            color: Colors.TEXT_DARK,
            ...typographyStyles.xl,
          },
          headerTitleAlign: 'center',
          headerLeft: () => (
            <IconButton
              iconLib='Feather'
              iconName='arrow-left'
              iconColor={Colors.DARK_GRAY}
              onPress={() => navigation.goBack()}
            />
          ),
          headerRight: () => (
            <IconButton
              iconLib='Feather'
              iconName='plus'
              iconColor={Colors.DARK_GRAY}
              onPress={() => navigation.navigate(MainNavigation.CREATE_ORGANIZATION)}
            />
          ),
        })}
        name={ProfileNavigation.ORGANIZATION_SELECT}
        component={OrganizationListHOC}
      />
      <ProfileStack.Screen
        options={({ navigation }) => ({
          title: t('profile.tests-list.header'),
          headerTitleStyle: {
            color: Colors.TEXT_DARK,
            ...typographyStyles.xl,
          },
          headerLeft: () => (
            <IconButton
              iconLib='Feather'
              iconName='arrow-left'
              iconColor={Colors.TEXT_DARK}
              onPress={navigation.goBack}
            />
          ),
        })}
        name={ProfileNavigation.TEST_SELECT}
        component={TestSelect}
      />
      <ProfileStack.Screen
        options={({ navigation }) => ({
          title: t('profile.test-details.header'),
          headerTitleStyle: {
            color: Colors.TEXT_DARK,
            ...typographyStyles.xl,
          },
          headerLeft: () => (
            <IconButton
              iconLib='Feather'
              iconName='arrow-left'
              iconColor={Colors.TEXT_DARK}
              onPress={navigation.goBack}
            />
          ),
        })}
        name={ProfileNavigation.TEST}
        component={TestSettings}
      />
      <ProfileStack.Screen
        options={({ navigation }) => ({
          title: t('profile.profile.header'),
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: Colors.TEXT_DARK,
            ...typographyStyles.xl,
          },
          headerLeft: () => (
            <IconButton
              iconLib='Feather'
              iconName='arrow-left'
              iconColor={Colors.DARK_GRAY}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
        name={ProfileNavigation.PROFILE}
        component={ProfileSettings}
      />
      <ProfileStack.Screen
        options={({ navigation }) => ({
          title: t('profile.about.title'),
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: Colors.TEXT_DARK,
            ...typographyStyles.xl,
          },
          headerLeft: () => (
            <IconButton
              iconLib='Feather'
              iconName='arrow-left'
              iconColor={Colors.DARK_GRAY}
              onPress={() => navigation.goBack()}
            />
          ),
        })}
        name={ProfileNavigation.ABOUT}
        component={About}
      />
    </ProfileStack.Navigator>
  );
};
