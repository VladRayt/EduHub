import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import { t } from '@config/i18next';

import { Button, Size } from '@components/Button';
import { IconButton } from '@components/IconButton';
import { useMainNavigation } from '@hooks/useTypedNavigation';
import { MainNavigation, MainRouteProp } from '../../../mobile-types/navigation.type';
import { StackActions } from '@react-navigation/native';
import { useCompletedTestDetails } from '@requests/test';
import { Colors, PrimaryColor } from '@styles/colors';
import { typographyStyles } from '@styles/typography';
import { useOrganizationStore } from '@zustand/organization.store';
import { useTestStore } from '@zustand/test.store';

type Props = MainRouteProp<MainNavigation.COMPLETED_TEST_DETAILS>;

export const CompletedTestDetails = ({ route }: Props) => {
  const { testId } = route.params;
  const { navigate, setOptions, dispatch } = useMainNavigation();
  const selectedTest = useTestStore((state) => state.selectedCompletedTest);
  const organizationColor = useOrganizationStore((state) => state.selectedOrganization?.color);

  useCompletedTestDetails(testId);

  const setHeaderOptions = useCallback(() => {
    const handleReturn = () => {
      dispatch(StackActions.popToTop());
      navigate(MainNavigation.ORGANIZATION_DETAILS, {
        organizationId: selectedTest?.organizationId ?? '',
      });
    };
    setOptions({
      title: selectedTest?.test?.title,
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
          onPress={handleReturn}
        />
      ),
    });
  }, [selectedTest?.organizationId, organizationColor]);

  useLayoutEffect(() => setHeaderOptions(), [setHeaderOptions]);

  const onSeeResults = () => {
    navigate(MainNavigation.COMPLETED_TEST_REVIEW, {
      organizationColor: organizationColor as PrimaryColor,
    });
  };

  const correctAnswers = useMemo(() => {
    if (!selectedTest?.userAnswers?.length) return [];
    return selectedTest.userAnswers.filter((answer) => answer?.isCorrect);
  }, [selectedTest?.userAnswers?.length]);

  const percentageCorrect = useMemo(() => {
    if (!selectedTest?.userAnswers?.length) return 0;
    return (correctAnswers.length / selectedTest.userAnswers.length ?? 0) * 100;
  }, [correctAnswers]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('@assets/test_details.png')}
          resizeMode='contain'
          style={styles.image}
        />
      </View>
      <View style={styles.detailsStyle}>
        <Text style={typographyStyles.xl}>{selectedTest?.test?.title}</Text>
        <Text style={typographyStyles.large}>{selectedTest?.test?.theme}</Text>
        <Text style={typographyStyles.medium}>{selectedTest?.test?.description}</Text>
        <Text style={typographyStyles.medium}>{`${t('main.test.questions')}: ${selectedTest?.test?.questions?.length ?? 0
          }`}</Text>
      </View>
      <View style={styles.analyticsStyle}>
        <Text style={typographyStyles.large}>{t('main.test.analytics')}</Text>
        <Text style={typographyStyles.medium}>
          {t('main.test.correct')}: {correctAnswers.length}/
          {selectedTest?.test?.questions?.length ?? 0}
        </Text>
        <Text style={typographyStyles.medium}>
          {t('main.test.percentage')}: {percentageCorrect?.toFixed(2)}%
        </Text>
      </View>
      <Button
        onPress={onSeeResults}
        title={t('main.test.button-results')}
        rounded
        color={organizationColor as PrimaryColor}
        size={Size.LARGE}
        style={styles.buttonStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    flex: 1,
    paddingHorizontal: '7.5%',
    width: '100%',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    rowGap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('screen').width * 0.5,
    aspectRatio: 1,
    height: 'auto',
  },
  textStyle: { ...typographyStyles.medium, textAlign: 'center', color: Colors.DARK_GRAY },
  detailsStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 4,
  },
  analyticsStyle: {
    marginVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 4,
  },
  buttonStyle: { alignSelf: 'center' },
});
