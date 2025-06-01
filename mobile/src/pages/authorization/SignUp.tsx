import React, { useCallback, useMemo, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';

import { If } from '@components/If';
import { AnimatedInput } from '@components/Input';
import { t } from '@config/i18next';
import { useAuthNavigation } from '@hooks/useTypedNavigation';
import { AuthNavigation } from '../../mobile-types/navigation.type';
import { useSignUp } from '@requests/auth';
import { useUserStore } from '@zustand/user.store';

import { AuthWrapper } from './AuthWrapper';

type InputValue = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export function SignUp() {
  const [step, setStep] = useState<1 | 2>(1);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<InputValue>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const { navigate } = useAuthNavigation();
  const { createUser, isError } = useSignUp();
  const error = useUserStore((state) => state.error);
  const setError = useUserStore((state) => state.setError);

  const handleChangeInputValue = useCallback(
    (key: keyof InputValue) => (value: string) => {
      setInputValue((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    console.log('step', step);
    if (step === 1) {
      if (!inputValue.firstName || !inputValue.lastName) {
        console.log('Invalid first name or last name');

        return setError('Invalid first name or last name');
      }
      setStep(2);
      setError(null);
    } else {
      console.log('inputValue', inputValue);
      const isErrorCreate = await createUser({
        email: inputValue.email,
        password: inputValue.password,
        name: `${inputValue.firstName} ${inputValue.lastName}`,
      });
      if (isErrorCreate || isError || error) return;
      navigate(AuthNavigation.ENTER_CODE, {
        email: inputValue.email,
        password: inputValue.password,
      });
    }
  }, [step, inputValue.email, inputValue.firstName, inputValue.lastName, inputValue.password]);

  const passwordIcon = useMemo(() => {
    if (isPasswordVisible) {
      return <Icon name='eye' size={22} onPress={() => setIsPasswordVisible(false)} />;
    }
    return <Icon name='eye-off' size={22} onPress={() => setIsPasswordVisible(true)} />;
  }, [isPasswordVisible]);

  return (
    <AuthWrapper
      error={isError || error ? error ?? 'Authorization error' : undefined}
      onSubmit={handleSubmit}
      buttonText={step === 1 ? t('auth.sign-up.button-one') : t('auth.sign-up.button-two')}
    >
      <If value={step === 1}>
        <AnimatedInput
          placeholder={t('auth.sign-up.first-name')}
          value={inputValue.firstName}
          onChangeText={handleChangeInputValue('firstName')}
          icon={<Icon name='user' size={22} />}
        />
        <AnimatedInput
          placeholder={t('auth.sign-up.last-name')}
          value={inputValue.lastName}
          onChangeText={handleChangeInputValue('lastName')}
          icon={<Icon name='user' size={22} />}
        />
      </If>
      <If value={step === 2}>
        <AnimatedInput
          placeholder={t('auth.sign-up.email-placeholder')}
          value={inputValue.email}
          onChangeText={handleChangeInputValue('email')}
          icon={<Icon name='mail' size={22} />}
        />
        <AnimatedInput
          placeholder={t('auth.sign-up.password-placeholder')}
          value={inputValue.password}
          onChangeText={handleChangeInputValue('password')}
          icon={passwordIcon}
          secureTextEntry={!isPasswordVisible}
        />
      </If>
    </AuthWrapper>
  );
}
