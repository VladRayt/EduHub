import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { QuestionCard } from '@blocks/QuestionCard';
import { IconButton } from '@components/IconButton';
import { t } from '@config/i18next';
import { Question } from '../../../mobile-types/front-types';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

type Props = {
  questions: Question[];
  onRemoveQuestion: (questionId: number) => void | Promise<void>;
  onAddQuestion: () => void;
};

export const QuestionsEdit = ({ questions, onRemoveQuestion, onAddQuestion }: Props) => {
  const renderItem = (item: Question, index: number) => (
    <View style={{ marginVertical: 8 }} key={`${item}-${index}`}>
      <QuestionCard question={item} onRemove={() => onRemoveQuestion(item.id)} />
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.settingNameStyle}>{t('profile.test-details.question-title')}</Text>
        <IconButton
          iconLib='Feather'
          iconName='plus'
          iconColor={Colors.DARK_GRAY}
          onPress={onAddQuestion}
        />
      </View>
      <View style={{ paddingHorizontal: 4 }}>{questions.map(renderItem)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginBottom: 16,
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  settingNameStyle: {
    flex: 1,
    ...typographyStyles.large,
    color: Colors.DARK_GRAY,
  },
});
