import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { Button } from '@components/Button';
import { If } from '@components/If';
import { AnimatedInput } from '@components/Input';
import { t } from '@config/i18next';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

type Props = {
  onCodeSend: () => Promise<void> | void;
  onPasswordRestore: (code: string, newPassword: string) => Promise<void> | void;
};

export const PasswordEdit = ({ onCodeSend, onPasswordRestore }: Props) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [newPassword, setNewPassword] = useState<string>('');
  const [restoreCode, setRestoreCode] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const passwordIcon = useMemo(() => {
    if (isPasswordVisible) {
      return <Icon name='eye' size={22} onPress={() => setIsPasswordVisible(false)} />;
    }
    return <Icon name='eye-off' size={22} onPress={() => setIsPasswordVisible(true)} />;
  }, [isPasswordVisible]);

  const handleButtonPress = () => {
    if (step === 1) {
      setStep(2);
      onCodeSend();
    } else {
      onPasswordRestore(restoreCode, newPassword);
      setStep(1);
      setRestoreCode('');
      setNewPassword('');
    }
  };

  return (
    <View>
      <Text style={[typographyStyles.large, styles.textColor]}>
        {t('profile.profile.reset-password')}
      </Text>
      <View style={styles.inputContainer}>
        <If value={step === 1}>
          <AnimatedInput
            placeholder={t('profile.profile.password')}
            value={newPassword}
            onChangeText={setNewPassword}
            icon={passwordIcon}
            secureTextEntry={!isPasswordVisible}
          />
        </If>
        <If value={step === 2}>
          <AnimatedInput
            placeholder={t('profile.profile.code')}
            value={restoreCode}
            onChangeText={setRestoreCode}
          />
        </If>
      </View>
      <Button
        title={step === 1 ? t('profile.profile.send-code') : t('profile.profile.update')}
        onPress={handleButtonPress}
        disabled={step === 1 ? !newPassword : !restoreCode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    rowGap: 12,
    marginVertical: 8,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'red',
  },
  textColor: {
    color: Colors.DARK_GRAY,
  },
});
