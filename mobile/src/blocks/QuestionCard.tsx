import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AccordionItem } from '@components/AccordionItem';
import { Button, Size } from '@components/Button';
import { t } from '@config/i18next';
import { Question } from '../mobile-types/front-types';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

type Props = {
  question: Question;
  onRemove: () => void;
};

export const QuestionCard = ({ question, onRemove }: Props) => {
  const questionAnswers = question.answers ?? [];

  return (
    <AccordionItem title={question.title}>
      {questionAnswers.map((answer, index) => (
        <View style={styles.answerContainer} key={answer.id}>
          <Text style={styles.answerText}>
            {index + 1}. {answer.title}
          </Text>
          <View
            style={{
              backgroundColor: answer.isCorrect ? Colors.GREEN + '30' : Colors.RED + '30',
              paddingHorizontal: 8,
              paddingVertical: 4,
              justifyContent: 'center',
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: answer.isCorrect ? Colors.GREEN : Colors.RED,
              }}
            >
              {answer.isCorrect ? 'True' : 'False'}
            </Text>
          </View>
        </View>
      ))}
      <Button
        title={t('profile.test-details.remove-button')}
        color={Colors.DANGER}
        onPress={onRemove}
        size={Size.SMALL}
        style={{ marginTop: 24 }}
      />
    </AccordionItem>
  );
};

const styles = StyleSheet.create({
  answerContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },

  answerText: {
    flex: 1,
    ...typographyStyles.medium,
  },
});
