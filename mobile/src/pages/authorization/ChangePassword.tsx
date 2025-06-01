import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';

import { t } from '@config/i18next';

import { AnimatedInput } from '@components/Input';
import {
  AuthNavigation,
  AuthRouteProps,
  BottomTabsRoutes,
  MainNavigation,
} from '../../mobile-types/navigation.type';
import { useUpdatePassword } from '@requests/auth';
import { useUserStore } from '@zustand/user.store';

import { useAuthNavigation } from '../../hooks/useTypedNavigation';
import { AuthWrapper } from './AuthWrapper';

type Props = AuthRouteProps<AuthNavigation.RESTORE_PASSWORD>;

export const ChangePassword = ({ route }: Props) => {
  const { code } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const email = useUserStore((state) => state.user?.email);
  const { resetPassword } = useUpdatePassword();
  const { navigate } = useAuthNavigation();

  const handleSubmit = async () => {
    if (!email || password !== confirmPassword || !password) return;

    await resetPassword({ email, password, code });
    navigate(AuthNavigation.MAIN, {
      screen: BottomTabsRoutes.WORKSPACES,
      params: {
        screen: MainNavigation.MAIN_LIST,
      },
    });
  };

  const passwordIcon = (
    <Icon
      name={isPasswordVisible ? 'eye' : 'eye-off'}
      size={22}
      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
    />
  );

  return (
    <AuthWrapper
      buttonText={t('auth.change-password.button-text')}
      onSubmit={handleSubmit}
      error={
        confirmPassword !== password || !password.length
          ? t('auth.change-password.not-same')
          : undefined
      }
    >
      <AnimatedInput
        placeholder={t('auth.change-password.new-password')}
        value={password}
        onChangeText={setPassword}
        icon={passwordIcon}
        secureTextEntry={!isPasswordVisible}
      />
      <AnimatedInput
        placeholder={t('auth.change-password.confirm-password')}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        icon={passwordIcon}
        secureTextEntry={!isPasswordVisible}
      />
    </AuthWrapper>
  );
};
