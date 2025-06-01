import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { AnimatedInput } from '@components/Input';
import { t } from '@config/i18next';
import {
  AuthNavigation,
  BottomTabsRoutes,
  MainNavigation,
} from '../../mobile-types/navigation.type';
import { useRestorationCodeEmail, useSignIn } from '@requests/auth';
import { useAuthStore } from '@zustand/auth.store';
import { useUserStore } from '@zustand/user.store';

import { useAuthNavigation } from '../../hooks/useTypedNavigation';
import { AuthWrapper } from './AuthWrapper';

type InputValue = {
  email: string;
  password: string;
};

export function SignIn() {
  const [inputValue, setInputValue] = useState<InputValue>({
    email: '',
    password: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const { signIn, isError } = useSignIn();
  const { sendCode } = useRestorationCodeEmail();
  const error = useUserStore((state) => state.error);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const { navigate } = useAuthNavigation();

  const passwordIcon = useMemo(() => {
    if (isPasswordVisible) {
      return <Icon name='eye' size={22} onPress={() => setIsPasswordVisible(false)} />;
    }
    return <Icon name='eye-off' size={22} onPress={() => setIsPasswordVisible(true)} />;
  }, [isPasswordVisible]);

  const handleChangeInputValue = useCallback(
    (key: 'email' | 'password') => (value: string) => {
      setInputValue((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSubmit = async () => {
    // if (!refreshToken) {
    //   const isErrorSendCode = await sendCode({ email: inputValue.email });
    //   if (!isErrorSendCode) return;
    //   return navigate(AuthNavigation.ENTER_CODE, inputValue);
    // }
    const isErrorSignIn = await signIn(inputValue);

    if (!isErrorSignIn) {
      return navigate(AuthNavigation.MAIN, {
        screen: BottomTabsRoutes.WORKSPACES,
        params: {
          screen: MainNavigation.MAIN_LIST,
        },
      });
    }
  };

  const handleSignUp = () => {
    navigate(AuthNavigation.SIGN_UP);
  };

  return (
    <AuthWrapper
      error={isError && error ? error : undefined}
      buttonText={t('auth.sign-in.button-text')}
      onSubmit={handleSubmit}
    >
      <AnimatedInput
        placeholder={t('auth.sign-in.email-placeholder')}
        value={inputValue.email}
        onChangeText={handleChangeInputValue('email')}
        icon={<Icon name='mail' size={22} />}
      />
      <AnimatedInput
        placeholder={t('auth.sign-in.password-placeholder')}
        value={inputValue.password}
        onChangeText={handleChangeInputValue('password')}
        icon={passwordIcon}
        secureTextEntry={!isPasswordVisible}
      />
      <View style={styles.linkContainer}>
        <TouchableOpacity>
          <Text>{t('auth.sign-in.forgot-password')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignUp}>
          <Text>{t('auth.sign-in.sign-up')}</Text>
        </TouchableOpacity>
      </View>
    </AuthWrapper>
  );
}

const styles = StyleSheet.create({
  linkContainer: {
    position: 'absolute',
    display: 'flex',
    bottom: -28,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});
