import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import { CardItem } from '@blocks/CardItem';
import { Button, Size } from '@components/Button';
import { IconButton } from '@components/IconButton';
import { useMainNavigation } from '@hooks/useTypedNavigation';
import { Answer, Question } from '../../../mobile-types/front-types';
import { MainNavigation, MainRouteProp } from '../../../mobile-types/navigation.type';
import { useCompleteTest } from '@requests/test';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';
import { useTestStore } from '@zustand/test.store';

import { TestProgress } from './TestProgress';

type Props = MainRouteProp<MainNavigation.TEST_COMPLETING>;

type LocalUserAnswer = Record<number, number | null>;

export const TestCompleting = ({ route }: Props) => {
  const { organizationColor } = route.params;
  const { navigate, goBack, setOptions } = useMainNavigation();
  const { t } = useTranslation();

  const testTitle = useTestStore((state) => state.selectedTest?.title);
  const testId = useTestStore((state) => state.selectedTest?.id);
  const questions = useTestStore((state) => state.selectedTest?.questions);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<LocalUserAnswer>({});
  const { completeTest } = useCompleteTest();

  const currentSelectedAnswerId = userAnswer[(questions?.[currentQuestionIndex] as Question).id];

  const activeQuestion = useMemo(
    () => questions?.[currentQuestionIndex] as Question,
    [currentQuestionIndex]
  );

  const answerQuestion = (answerId: number | null) => {
    if (!activeQuestion?.id) return;
    setUserAnswer((prev) => ({ ...prev, [activeQuestion.id]: answerId }));
  };

  const goNext = async () => {
    if (!questions || !testId) return;
    if (currentQuestionIndex === questions?.length - 1) {
      const selectedAnswers = questions.map((question) => ({
        isCorrect: !!question.answers?.find((answer) => answer?.id === userAnswer[question.id])
          ?.isCorrect,
        questionId: question.id,
        answerId: userAnswer[question.id] ?? 0,
      }));
      await completeTest(testId, selectedAnswers);
      return navigate(MainNavigation.COMPLETED_TEST_DETAILS, { testId });
    }
    return setCurrentQuestionIndex((prev) => prev + 1);
  };
  const goPrevious = () => setCurrentQuestionIndex((prev) => prev - 1);

  const setHeaderOptions = useCallback(() => {
    const handleGoBack = () => {
      Alert.alert(t('main.completing.alert-title'), t('main.completing.alert-description'), [
        { text: t('main.completing.alert-cancel'), onPress: undefined },
        { text: t('main.completing.alert-accept'), onPress: goBack },
      ]);
    };
    setOptions({
      title: testTitle,
      headerTitleStyle: {
        color: Colors.LIGHT_GRAY,
        ...typographyStyles.xl,
        textAlign: 'center',
      },
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: organizationColor,
      },
      headerLeft: () => (
        <IconButton
          iconLib='Feather'
          iconName='arrow-left'
          iconColor={Colors.LIGHT_GRAY}
          onPress={handleGoBack}
        />
      ),
    });
  }, [testTitle, organizationColor]);

  useEffect(() => setHeaderOptions(), [setHeaderOptions]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Answer>) => (
      <BouncyCheckbox
        size={24}
        style={styles.itemStyle}
        fillColor={organizationColor}
        unfillColor='transparent'
        isChecked={userAnswer[activeQuestion?.id] === item?.id}
        disableBuiltInState
        iconStyle={{ borderColor: organizationColor }}
        textComponent={<Text style={styles.itemText}>{item?.title}</Text>}
        onPress={() => {
          const isChecked = userAnswer[activeQuestion?.id] === item?.id;
          answerQuestion(isChecked ? null : item?.id);
        }}
      />
    ),
    [userAnswer, activeQuestion]
  );

  return (
    <View style={styles.container}>
      <TestProgress
        isQuestionActive={!userAnswer[activeQuestion?.id ?? 0]}
        currentQuestionIndex={currentQuestionIndex + 1}
        questionsLength={questions?.length ?? 0}
      />
      <CardItem
        title={`${t('main.completing.question')} ${currentQuestionIndex + 1}`}
        description={activeQuestion?.title ?? ''}
        backgroundColor={organizationColor}
        onPress={() => { }}
        style={{ height: 'fit-content' }}
      />
      <Text style={styles.progressText}>
        {currentQuestionIndex + 1} {t('main.completing.count')} {questions?.length}
      </Text>
      <FlashList
        extraData={currentSelectedAnswerId}
        data={activeQuestion?.answers ?? []}
        style={{ flex: 1 }}
        renderItem={renderItem}
      />
      <View style={styles.buttonContainer}>
        <Button
          title={t('main.completing.button-back')}
          size={Size.SMALL}
          disabled={currentQuestionIndex === 0}
          color={organizationColor}
          rounded
          onPress={goPrevious}
        />
        <Button
          title={
            currentQuestionIndex === (questions?.length ?? 0) - 1
              ? t('main.completing.button-finish')
              : t('main.completing.button-next')
          }
          size={Size.SMALL}
          color={organizationColor}
          rounded
          onPress={goNext}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 32,
    flex: 1,
    flexBasis: '40%',
    paddingHorizontal: '7.5%',
    rowGap: 16,
  },
  themeText: {
    ...typographyStyles.large,
    textTransform: 'capitalize',
  },
  progressText: {
    ...typographyStyles.medium,
  },
  itemStyle: { marginTop: 12 },
  itemText: {
    ...typographyStyles.large,
    color: Colors.TEXT_LIGHT,
    marginLeft: 12,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
