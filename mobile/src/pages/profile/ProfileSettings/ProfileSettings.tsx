import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@components/Button';
import { useAuthNavigation } from '@hooks/useTypedNavigation';
import { AuthNavigation } from '../../../mobile-types/navigation.type';
import { StackActions } from '@react-navigation/native';
import { useRestorationCodeEmail, useUpdatePassword } from '@requests/auth';
import { useUpdateUserName } from '@requests/user';
import { Colors } from '@styles/colors';
import { useAuthStore } from '@zustand/auth.store';
import { useUserStore } from '@zustand/user.store';

import { LanguageEdit } from './LanguageEdit';
import { PasswordEdit } from './PasswordEdit';
import { UserNameEdit } from './UserNameEdit';

export const ProfileSettings = () => {
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clear);
  const clear = useAuthStore((state) => state.clear);

  const { t } = useTranslation();
  const { navigate, dispatch } = useAuthNavigation();

  const { sendCode } = useRestorationCodeEmail();
  const { resetPassword } = useUpdatePassword();
  const { updateName } = useUpdateUserName();

  const signOut = () => {
    clear();
    dispatch(StackActions.popToTop());
    navigate(AuthNavigation.SIGN_IN);
    clearUser();
  };

  return (
    <View style={styles.container}>
      <UserNameEdit onSave={(name) => updateName({ id: user!.id, name })} userName={user!.name} />
      <PasswordEdit
        onCodeSend={() => {
          sendCode({ email: user!.email });
        }}
        onPasswordRestore={(code, password) => {
          resetPassword({
            email: user!.email,
            code,
            password,
          });
        }}
      />
      <LanguageEdit />
      <Button title={t('profile.profile.sign-out')} color={Colors.DANGER} onPress={signOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: '7.5%',
    flex: 1,
    rowGap: 24,
  },
});
