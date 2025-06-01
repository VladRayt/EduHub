import React, { useCallback, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { DeleteModal } from '@blocks/DeleteModal';
import { IconButton } from '@components/IconButton';
import { useMainProfileNavigation } from '@hooks/useTypedNavigation';
import { Test } from '../../../mobile-types/front-types';
import {
  BottomTabsRoutes,
  MainNavigation,
  ProfileNavigation,
  ProfileRouteProps,
} from '../../../mobile-types/navigation.type';
import { StackActions } from '@react-navigation/native';
import {
  useAddTestQuestion,
  useRemoveTest,
  useRemoveTestQuestion,
  useTestDetails,
  useUpdateTest,
} from '@requests/test';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';
import { useTestStore } from '@zustand/test.store';

import { CreateQuestionModal } from './CreateQuestionModal';
import { DescriptionEdit } from './DescriptionsEdit';
import { QuestionsEdit } from './QuestionsEdit';
import { ThemeEdit } from './ThemeEdit';
import { TitleEdit } from './TitleEdit';

type Props = ProfileRouteProps<ProfileNavigation.TEST>;

export const TestSettings = ({ route, navigation }: Props) => {
  const { testId, questionToDelete } = route.params;
  const { setParams, setOptions, dispatch } = navigation;
  const { navigate } = useMainProfileNavigation();
  const [showDeleteTestConfirmation, setShowDeleteTestConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  const { updateTest } = useUpdateTest();
  const { removeTest } = useRemoveTest();

  const { removeQuestion } = useRemoveTestQuestion();
  const { addQuestion } = useAddTestQuestion();

  const selectedTest = useTestStore((state) => state.selectedTest);
  useTestDetails(testId);

  useLayoutEffect(() => {
    setOptions({
      headerRight: () => (
        <IconButton
          iconLib='Feather'
          iconName='trash-2'
          iconColor={Colors.DARK_GRAY}
          onPress={() => setShowDeleteTestConfirmation(true)}
        />
      ),
    });
  }, []);

  const handleSave = useCallback(
    (key: keyof Pick<Test, 'title' | 'theme' | 'description'>) => async (value: string) => {
      if (!selectedTest) return;
      const updatedTest = {
        testId: selectedTest.id,
        title: selectedTest.title,
        theme: selectedTest.theme,
        description: selectedTest.description,
      };
      updatedTest[key] = value;
      updateTest({
        ...updatedTest,
        [key]: value,
      });
    },
    [selectedTest]
  );

  const addQuestionForRemoving = (questionToDelete: number) => {
    setParams({ questionToDelete });
    setShowDeleteConfirmation(true);
  };

  const handleCancel = () => {
    setShowDeleteTestConfirmation(false);
    setShowDeleteConfirmation(false);
    setParams({ questionToDelete: undefined });
    setShowAddQuestion(false);
  };

  const handleRemove = async () => {
    if (!selectedTest) return;
    if (showDeleteTestConfirmation) {
      handleCancel();
      navigate(ProfileNavigation.TEST_SELECT, {});
      await removeTest({
        testId,
        organizationId: selectedTest.organizationId,
      });
    } else if (showDeleteConfirmation && questionToDelete) {
      await removeQuestion({
        testId,
        questionId: questionToDelete,
      });
      handleCancel();
    }
  };

  if (!selectedTest) {
    dispatch(StackActions.popToTop());
    navigate(BottomTabsRoutes.WORKSPACES, {
      screen: MainNavigation.MAIN_LIST,
    });
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <TitleEdit title={selectedTest.title} onSave={handleSave('title')} />
      <DescriptionEdit
        description={selectedTest.description ?? ''}
        onSave={handleSave('description')}
      />
      <ThemeEdit theme={selectedTest.theme ?? ''} onSave={handleSave('theme')} />
      <QuestionsEdit
        questions={selectedTest.questions ?? []}
        onRemoveQuestion={addQuestionForRemoving}
        onAddQuestion={() => setShowAddQuestion(true)}
      />
      <DeleteModal
        visible={showDeleteConfirmation || showDeleteTestConfirmation}
        handleClose={handleCancel}
        handleAccept={handleRemove}
      />
      <CreateQuestionModal
        visible={showAddQuestion}
        testId={testId}
        handleClose={handleCancel}
        onCreateQuestion={addQuestion}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    rowGap: 24,
    height: '100%',
    // alignItems: 'center',
    paddingHorizontal: '7.5%',
    width: '100%',
  },
  bottomContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    marginBottom: 24,
    alignItems: 'center',
    rowGap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    ...typographyStyles.medium,
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  itemContainer: {
    borderRadius: 12,
    height: 180,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  itemTextWrapper: {
    flex: 1,
    rowGap: 12,
  },
  itemTitle: {
    ...typographyStyles.xl2,
    color: Colors.LIGHT_GRAY,
  },
  itemDescription: {
    ...typographyStyles.medium,
    color: Colors.LIGHT_GRAY,
  },
});
