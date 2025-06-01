import { BottomTabRouteProps, BottomTabsRoutes, MainNavigation } from '../mobile-types/navigation.type';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

export function tabBarMainShow(route: BottomTabRouteProps<BottomTabsRoutes.WORKSPACES>['route']) {
  const routeName = getFocusedRouteNameFromRoute(route);
  switch (routeName) {
    case MainNavigation.CREATE_ORGANIZATION:
    case MainNavigation.ALL_ORGANIZATIONS:
    case MainNavigation.CREATE_TEST:
    case MainNavigation.TEST_COMPLETING:
      return false;
    default:
      return true;
  }
}
