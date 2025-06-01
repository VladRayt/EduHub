import Icon from 'react-native-vector-icons/Feather';

import { BottomTabParamsList, BottomTabsRoutes } from '../mobile-types/navigation.type';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useUserDetails } from '@requests/user';
import { tabBarMainShow } from '@utils/getIsTabBarShown';

import { MainStackNavigation } from './MainNavigator';
import { ProfileStackNavigation } from './ProfileNavigator';
import { ProgressStackNavigation } from './ProgressNavigator';

const BottomTabs = createBottomTabNavigator<BottomTabParamsList>();

const defaultTabBarStyles = {
  marginHorizontal: 20,
  marginBottom: 24,
  height: 80,
  paddingBottom: 0,
  borderRadius: 24,
};

const hiddenTabBarStyles = {
  marginHorizontal: 0,
  marginBottom: 0,
  height: 0,
  paddingBottom: 0,
  borderRadius: 0,
};

export const BottomTabsNavigation = () => {
  useUserDetails();

  return (
    <BottomTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: defaultTabBarStyles,
        tabBarShowLabel: false,
      }}
    >
      <BottomTabs.Screen
        options={({ route }) => ({
          tabBarIcon: ({ color }) => <Icon color={color} name='layers' size={32} />,
          tabBarVisible: tabBarMainShow(route),
          tabBarStyle: tabBarMainShow(route) ? defaultTabBarStyles : hiddenTabBarStyles,
        })}
        name={BottomTabsRoutes.WORKSPACES}
        component={MainStackNavigation}
      />
      <BottomTabs.Screen
        options={{
          tabBarIcon: ({ color }) => <Icon color={color} name='bar-chart-2' size={32} />,
        }}
        name={BottomTabsRoutes.PROGRESS}
        component={ProgressStackNavigation}
      />
      <BottomTabs.Screen
        options={{ tabBarIcon: ({ color }) => <Icon color={color} name='user' size={32} /> }}
        name={BottomTabsRoutes.PROFILE}
        component={ProfileStackNavigation}
      />
    </BottomTabs.Navigator>
  );
};
