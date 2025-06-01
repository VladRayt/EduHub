import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Size } from '@components/Button';
import { If } from '@components/If';
import { AnimatedInput } from '@components/Input';
import { AnimatedTextArea } from '@components/TextArea';
import { useMainProfileNavigation } from '@hooks/useTypedNavigation';
import {
  BottomTabsRoutes,
  MainNavigation,
  MainRouteProp,
  ProfileNavigation,
} from '../../../mobile-types/navigation.type';
import { StackActions } from '@react-navigation/native';
import { useCreateTest } from '@requests/test';
import { typographyStyles } from '@styles/typography';

import { LoadingScreen } from '../../../blocks/LoadingScreen';

type TestDetails = {
  title: string;
  theme: string;
  description: string;
  questionLength: number;
};

type Props = MainRouteProp<MainNavigation.CREATE_TEST>;

export const CreateTest = ({ route }: Props) => {
  const [testDetails, setTestDetails] = useState<TestDetails>({
    title: '',
    theme: '',
    description: '',
    questionLength: 0,
  });
  const { organizationId } = route.params;
  const { navigate, dispatch } = useMainProfileNavigation();
  const { t } = useTranslation();
  const { createTest, isError, isLoading } = useCreateTest(organizationId);

  const onTestDetailChange = useCallback(
    (field: keyof TestDetails) => (value: string) => {
      if (field === 'questionLength') {
        return setTestDetails((prev) => ({ ...(prev ?? {}), [field]: parseInt(value) }));
      }
      return setTestDetails((prev) => ({ ...(prev ?? {}), [field]: value }));
    },
    []
  );

  const handleCreateTest = async () => {
    if (!testDetails) return;
    const testId = await createTest(testDetails);
    dispatch(StackActions.popToTop());
    if (!testId) return;
    navigate(BottomTabsRoutes.PROFILE, { screen: ProfileNavigation.TEST, params: { testId } });
  };

  return (
    <View style={styles.container}>
      <If value={isLoading}>
        <LoadingScreen />
      </If>
      <If value={!isLoading && !isError}>
        <Text style={styles.titleStyle}>{t('main.create-test.title')}</Text>
        <View style={styles.inputContainer}>
          <AnimatedInput
            placeholder={t('main.create-test.title-pl')}
            value={testDetails.title}
            onChangeText={onTestDetailChange('title')}
          />
          <AnimatedInput
            placeholder={t('main.create-test.theme-pl')}
            value={testDetails.theme}
            onChangeText={onTestDetailChange('theme')}
          />
          <AnimatedTextArea
            placeholder={t('main.create-test.description-pl')}
            value={testDetails.description}
            onChangeText={onTestDetailChange('description')}
          />
          <AnimatedInput
            placeholder={t('main.create-test.questions-pl')}
            keyboardType='numeric'
            value={`${testDetails.questionLength}`}
            onChangeText={onTestDetailChange('questionLength')}
          />
          <Text style={typographyStyles.medium}>{t('main.create-test.description')}</Text>
        </View>
        <Button
          title={t('main.create-test.button')}
          disabled={Object.values(testDetails).some((detail) => !detail)}
          size={Size.LARGE}
          rounded
          style={styles.buttonStyle}
          onPress={handleCreateTest}
        />
      </If>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: '7.5%',
    paddingVertical: 16,
  },
  titleStyle: { fontSize: 40, fontWeight: 'bold', alignSelf: 'flex-start' },
  inputContainer: {
    rowGap: 24,
  },
  buttonStyle: {
    marginTop: 'auto',
    alignSelf: 'center',
  },
});
