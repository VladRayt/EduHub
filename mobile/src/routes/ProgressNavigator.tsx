import { useTranslation } from 'react-i18next';

import { IconButton } from '@components/IconButton';
import { ProgressNavigation, ProgressStackParamsList } from '../mobile-types/navigation.type';
import { HomeAnalytics } from '@page/progress/HomeAnalytics';
import { OrganizationAnalytics } from '@page/progress/OrganizationAnalytics';
import { TestAnalytics } from '@page/progress/TestAnalytics';
import { UserAnalytics } from '@page/progress/UserAnalytics';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

const ProgressStack = createNativeStackNavigator<ProgressStackParamsList>();

export const ProgressStackNavigation = () => {
  const { t } = useTranslation();

  return (
    <ProgressStack.Navigator initialRouteName={ProgressNavigation.HOME_ANALYTICS}>
      <ProgressStack.Screen
        options={{
          title: t('progress.home.header'),
          headerTitleStyle: {
            color: Colors.DARK_GRAY,
            ...typographyStyles.xl,
          },
          headerTitleAlign: 'center',
        }}
        name={ProgressNavigation.HOME_ANALYTICS}
        component={HomeAnalytics}
      />
      <ProgressStack.Screen
        options={({ navigation }) => ({
          title: t('progress.test.header'),
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
              onPress={() => navigation.navigate(ProgressNavigation.HOME_ANALYTICS)}
            />
          ),
        })}
        name={ProgressNavigation.TEST_ANALYTICS}
        component={TestAnalytics}
      />
      <ProgressStack.Screen
        options={({ navigation }) => ({
          title: t('progress.organization.header'),
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
              onPress={() => navigation.navigate(ProgressNavigation.HOME_ANALYTICS)}
            />
          ),
        })}
        name={ProgressNavigation.ORGANIZATION_ANALYTICS}
        component={OrganizationAnalytics}
      />
      <ProgressStack.Screen
        options={({ navigation }) => ({
          title: t('progress.user.header'),
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
              onPress={() => navigation.navigate(ProgressNavigation.HOME_ANALYTICS)}
            />
          ),
        })}
        name={ProgressNavigation.USER_ANALYTICS}
        component={UserAnalytics}
      />
    </ProgressStack.Navigator>
  );
};
