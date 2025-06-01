import { useTranslation } from 'react-i18next';

import { IconButton } from '@components/IconButton';
import { MainNavigation, MainStackParamsList } from '../mobile-types/navigation.type';
import { OrganizationListHOC } from '@page/main/AllOrganizations';
import { CreateOrganization } from '@page/main/CreateOrganization';
import { CreateTest } from '@page/main/CreateTest/CreateTest';
import { OrganizationDetails } from '@page/main/OrganizationDetails';
import { OrganizationsList } from '@page/main/OrganizationsList';
import { CompletedTestReview, TestCompleting } from '@page/main/TestCompleting';
import { CompletedTestDetails, TestDetails } from '@page/main/TestDetails';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

const MainStack = createNativeStackNavigator<MainStackParamsList>();

export const MainStackNavigation = () => {
  const { t } = useTranslation();
  return (
    <MainStack.Navigator initialRouteName={MainNavigation.MAIN_LIST}>
      <MainStack.Screen
        options={{ headerShown: false }}
        name={MainNavigation.MAIN_LIST}
        component={OrganizationsList}
      />
      <MainStack.Screen
        options={({ navigation }) => ({
          title: t('main.create-organization.header'),
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: Colors.LIGHT_GRAY,
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
        name={MainNavigation.CREATE_ORGANIZATION}
        component={CreateOrganization}
      />
      <MainStack.Screen
        options={({ navigation }) => ({
          title: t('main.organizations-list.header'),
          headerTitleStyle: {
            color: Colors.DARK_GRAY,
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
              iconColor={Colors.TEXT_DARK}
              onPress={() => navigation.navigate(MainNavigation.CREATE_ORGANIZATION)}
            />
          ),
        })}
        name={MainNavigation.ALL_ORGANIZATIONS}
        component={OrganizationListHOC}
      />
      <MainStack.Screen
        options={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: Colors.LIGHT_GRAY,
            ...typographyStyles.xl,
          },
          headerRight: () => (
            <IconButton
              iconLib='Feather'
              iconName='settings'
              iconColor={Colors.LIGHT_GRAY}
              onPress={() => { }}
            />
          ),
        }}
        name={MainNavigation.ORGANIZATION_DETAILS}
        component={OrganizationDetails}
      />
      <MainStack.Screen
        options={({ navigation }) => ({
          headerTitleAlign: 'center',
          headerTitle: 'Create own test',
          headerTitleStyle: {
            color: Colors.DARK_GRAY,
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
        name={MainNavigation.CREATE_TEST}
        component={CreateTest}
      />
      <MainStack.Screen
        options={{
          headerTitleAlign: 'center',
        }}
        name={MainNavigation.TEST_DETAILS}
        component={TestDetails}
      />
      <MainStack.Screen
        options={{
          headerTitleAlign: 'center',
        }}
        name={MainNavigation.COMPLETED_TEST_DETAILS}
        component={CompletedTestDetails}
      />
      <MainStack.Screen
        options={{
          headerTitleAlign: 'center',
        }}
        name={MainNavigation.TEST_COMPLETING}
        component={TestCompleting}
      />
      <MainStack.Screen
        options={{
          headerTitleAlign: 'center',
        }}
        name={MainNavigation.COMPLETED_TEST_REVIEW}
        component={CompletedTestReview}
      />
    </MainStack.Navigator>
  );
};
