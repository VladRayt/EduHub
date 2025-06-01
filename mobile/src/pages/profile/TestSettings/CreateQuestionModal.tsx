import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import { Button, Size } from '@components/Button';
import { AnimatedInput } from '@components/Input';
import { t } from '@config/i18next';
import { Answer, Question } from '../../../mobile-types/front-types';
import { typographyStyles } from '@styles/typography';

type CreateQuestion = Omit<Question, 'id' | 'answers'> & {
  answers: Omit<Answer, 'id' | 'questionId'>[];
};

type Props = {
  visible: boolean;
  testId: number;
  handleClose: () => void;
  onCreateQuestion: (question: CreateQuestion) => Promise<void> | void;
};

export const CreateQuestionModal = ({ visible, handleClose, onCreateQuestion, testId }: Props) => {
  const [questionTitle, setQuestionTitle] = useState('');
  const [answers, setAnswers] = useState(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(-1);

  const handleCreateQuestion = () => {
    if (questionTitle.trim() === '') {
      return;
    }

    if (correctAnswerIndex === -1) {
      return;
    }

    const question = {
      title: questionTitle,
      testId,
      answers: answers.map((answer, index) => ({
        title: answer,
        isCorrect: index === correctAnswerIndex,
      })),
    };

    onCreateQuestion(question);

    // Reset state
    setQuestionTitle('');
    setAnswers(['', '', '', '']);
    setCorrectAnswerIndex(-1);

    handleClose();
  };

  return (
    <Modal visible={visible} animationType='slide'>
      <View style={styles.container}>
        <Text style={styles.modalTitle}>{t('question-modal.title')}</Text>
        <AnimatedInput
          placeholder={t('question-modal.title-placeholder')}
          value={questionTitle}
          onChangeText={(text) => setQuestionTitle(text)}
        />
        <Text style={styles.modalDescription}>{t('question-modal.description')}</Text>
        {answers.map((answer, index) => (
          <View key={index} style={styles.answerContainer}>
            <View style={styles.inputContainer}>
              <AnimatedInput
                placeholder={`${t('question-modal.answer-title')} ${index + 1}.`}
                value={answer}
                onChangeText={(text) => {
                  const newAnswers = [...answers];
                  newAnswers[index] = text;
                  setAnswers(newAnswers);
                }}
              />
            </View>
            <BouncyCheckbox
              disableBuiltInState
              isChecked={index === correctAnswerIndex}
              onPress={() => setCorrectAnswerIndex(index)}
            />
          </View>
        ))}
        <View style={styles.buttonContainer}>
          <Button
            title={t('question-modal.cancel')}
            onPress={handleClose}
            size={Size.SMALL}
            rounded
          />
          <Button
            title={t('question-modal.accept')}
            onPress={handleCreateQuestion}
            size={Size.SMALL}
            rounded
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: '7.5%',
  },
  modalTitle: {
    ...typographyStyles.xl,
    marginBottom: 20,
  },
  modalDescription: {
    ...typographyStyles.large,
    marginVertical: 20,
  },
  inputContainer: {
    width: '75%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  answerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    marginTop: 24,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
