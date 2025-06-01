import { PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Text, View } from 'react-native';

import { Button, Size } from '@components/Button';
import { t } from '@config/i18next';
import { authStyles } from '@styles/authStyle';

type Props = PropsWithChildren<{
  onSubmit: () => void | Promise<void>;
  buttonText: string;
  error?: string;
}>;

export function AuthWrapper({ onSubmit, buttonText, children, error }: Props) {
  return (
    <KeyboardAvoidingView behavior='padding' style={authStyles.containerStyles}>
      <Text style={authStyles.textStyles}>{t('auth.auth-text')}</Text>
      <View style={authStyles.inputsContainerStyles}>{children}</View>
      <View style={authStyles.buttonContainerStyles}>
        <Button title={buttonText} size={Size.LARGE} onPress={onSubmit} />
        <Text style={authStyles.errorStyles}>{error}</Text>
      </View>
    </KeyboardAvoidingView>
  );
}
