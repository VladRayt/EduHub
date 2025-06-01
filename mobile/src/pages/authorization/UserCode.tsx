import React, { useState } from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { AnimatedInput } from '@components/Input';
import { t } from '@config/i18next';
import { useAuthNavigation } from '@hooks/useTypedNavigation';
import {
  AuthNavigation,
  AuthRouteProps,
  BottomTabsRoutes,
  MainNavigation,
} from '../../mobile-types/navigation.type';
import { useSignInWithCode } from '@requests/auth';
import { typographyStyles } from '@styles/typography';
import { useUserStore } from '@zustand/user.store';

import { AuthWrapper } from './AuthWrapper';

type Props = AuthRouteProps<AuthNavigation.ENTER_CODE>;

export const UserCode = ({ route }: Props) => {
  const { email, password } = route.params;
  const [userCode, setUserCode] = useState<string>('');

  const error = useUserStore((state) => state.error);
  const { signInWithCode, isError } = useSignInWithCode();
  const { navigate } = useAuthNavigation();

  const handleSubmit = async () => {
    if (!userCode || !email || !password) return;
    const isOneTimePassword = await signInWithCode({
      code: userCode,
      email,
      password,
    });

    if (isError || error || isOneTimePassword === undefined) return;
    if (!isOneTimePassword) {
      return navigate(AuthNavigation.MAIN, {
        screen: BottomTabsRoutes.WORKSPACES,
        params: {
          screen: MainNavigation.MAIN_LIST,
        },
      });
    }
    return navigate(AuthNavigation.RESTORE_PASSWORD, { code: userCode });
  };
  return (
    <AuthWrapper
      onSubmit={handleSubmit}
      error={isError || error ? error ?? 'Error with authorization' : undefined}
      buttonText={t('auth.user-code.sign-in')}
    >
      <AnimatedInput
        placeholder={t('auth.user-code.code-placeholder')}
        value={userCode}
        onChangeText={setUserCode}
        icon={<Icon name='code' size={22} />}
      />
      <Text style={typographyStyles.medium}>{t('auth.user-code.description')}</Text>
    </AuthWrapper>
  );
};
