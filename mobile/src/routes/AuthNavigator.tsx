import { LoadingScreen } from '@blocks/LoadingScreen';
import { ChangePassword } from '@page/authorization/ChangePassword';
import { SignIn } from '@page/authorization/SignIn';
import { SignUp } from '@page/authorization/SignUp';
import { UserCode } from '@page/authorization/UserCode';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useValidateUser } from '@requests/auth';

import { BottomTabsNavigation } from './BottomTabNavigator';
import { AuthNavigation, AuthStackParamList } from '../mobile-types/navigation.type';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export const AuthStackNavigation = () => {
  const { isLoading, isValidated } = useValidateUser();

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <AuthStack.Navigator
      initialRouteName={isValidated ? AuthNavigation.MAIN : AuthNavigation.SIGN_IN}
    >
      <AuthStack.Screen
        options={{ headerShown: false }}
        name={AuthNavigation.SIGN_IN}
        component={SignIn}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name={AuthNavigation.SIGN_UP}
        component={SignUp}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name={AuthNavigation.ENTER_CODE}
        component={UserCode}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name={AuthNavigation.RESTORE_PASSWORD}
        component={ChangePassword}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name={AuthNavigation.MAIN}
        component={BottomTabsNavigation}
      />
    </AuthStack.Navigator>
  );
};
