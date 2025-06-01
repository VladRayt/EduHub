import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import { CardItem } from '@blocks/CardItem';
import { Button, Size } from '@components/Button';
import { IconButton } from '@components/IconButton';
import { useMainNavigation } from '@hooks/useTypedNavigation';
import { Answer, Question } from '../../../mobile-types/front-types';
import { MainNavigation, MainRouteProp } from '../../../mobile-types/navigation.type';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';
import { useTestStore } from '@zustand/test.store';

import { TestProgress } from './TestProgress';

type Props = MainRouteProp<MainNavigation.COMPLETED_TEST_REVIEW>;

export const CompletedTestReview = ({ route }: Props) => {
  const { organizationColor } = route.params;
  const { goBack, setOptions } = useMainNavigation();
  const { t } = useTranslation();

  const testTitle = useTestStore((state) => state.selectedCompletedTest?.test?.title);
  const questions = useTestStore((state) => state.selectedCompletedTest?.test?.questions);
  const userAnswers = useTestStore((state) => state.selectedCompletedTest?.userAnswers);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const { activeQuestion, activeAnswer } = useMemo(() => {
    const activeQuestion = questions?.[currentQuestionIndex] as Question;
    const activeAnswer = userAnswers?.find((answer) => answer.questionId === activeQuestion.id);
    return {
      activeAnswer,
      activeQuestion,
    };
  }, [currentQuestionIndex, userAnswers?.length]);

  const goNext = () => setCurrentQuestionIndex((prev) => prev + 1);
  const goPrevious = () => setCurrentQuestionIndex((prev) => prev - 1);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Answer>) => {
      let fillColor: string = 'transparent';

      if (activeAnswer?.answerId === item?.id) {
        fillColor = item.isCorrect ? organizationColor : Colors.DARK_GRAY;
      } else if (item.isCorrect && activeAnswer?.answerId !== item?.id) {
        fillColor = Colors.GREEN;
      }

      return (
        <BouncyCheckbox
          size={24}
          style={styles.itemStyle}
          fillColor={fillColor}
          unfillColor='transparent'
          isChecked={activeAnswer?.answerId === item?.id || item?.isCorrect}
          disableBuiltInState
          iconStyle={{ borderColor: organizationColor }}
          textComponent={<Text style={styles.itemText}>{item?.title}</Text>}
        />
      );
    },
    [activeQuestion?.answers]
  );

  const setHeaderOptions = useCallback(() => {
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
          onPress={goBack}
        />
      ),
    });
  }, [testTitle, organizationColor]);

  useEffect(() => setHeaderOptions(), [setHeaderOptions]);

  return (
    <View style={styles.container}>
      <TestProgress
        isQuestionActive={false}
        currentQuestionIndex={currentQuestionIndex + 1}
        questionsLength={questions?.length ?? 0}
      />
      <CardItem
        title={`${t('main.completing.question')} ${currentQuestionIndex + 1}`}
        description={activeQuestion?.title ?? ''}
        backgroundColor={organizationColor}
        onPress={() => { }}
      />
      <Text style={styles.progressText}>
        {currentQuestionIndex + 1} {t('main.completing.count')} {questions?.length}
      </Text>
      <FlashList data={activeQuestion?.answers} style={{ flex: 1 }} renderItem={renderItem} />
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
      >
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
              ? t('main.completing.accept')
              : t('main.completing.button-next')
          }
          size={Size.SMALL}
          color={organizationColor}
          rounded
          onPress={currentQuestionIndex === (questions?.length ?? 0) - 1 ? goBack : goNext}
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
    width: '100%',
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
});
