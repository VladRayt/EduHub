import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';

import { useProgressNavigation } from '@hooks/useTypedNavigation';
import { ProgressNavigation } from '../../../mobile-types/navigation.type';
import { trpc } from '@requests/RequestContext';
import { Colors } from '@styles/colors';
import { useUserStore } from '@zustand/user.store';

import { AverageUserAccuracy } from './AverageUserAccuracy';
import { CompletedTestsAccuracy } from './CompletedTestsAccuracy';

const chartWidth = Dimensions.get('screen').width - Dimensions.get('screen').width * 0.33;

export const UserAnalytics = () => {
  // data that show user his average accuracy
  const userId = useUserStore((state) => state.user!.id);
  const userName = useUserStore((state) => state.user!.name);

  const { navigate } = useProgressNavigation();
  const { t } = useTranslation();

  const { data: testAccuracyData } = trpc.analytics.userCompletedTestsAccuracy.useQuery({
    userId,
  });
  const userCompletedTestsAccuracy = testAccuracyData?.data ?? [];

  const accuracyAverageData = useMemo(() => {
    const totalCorrectPercentage =
      userCompletedTestsAccuracy.reduce((acc, curr) => acc + curr.value, 0) /
      userCompletedTestsAccuracy.length;
    const totalIncorrectPercentage = 100 - totalCorrectPercentage;

    return [
      { value: totalCorrectPercentage, label: t('progress.correct'), color: Colors.SUCCESS },
      { value: totalIncorrectPercentage, label: t('progress.incorrect'), color: Colors.DANGER },
    ];
  }, [userCompletedTestsAccuracy]);

  return (
    <ScrollView style={styles.container}>
      <AverageUserAccuracy
        accuracyAverageData={accuracyAverageData}
        name={`${userName} ${t('progress.user.user-details')}`}
      />
      <CompletedTestsAccuracy
        title={t('progress.user.completed-details')}
        width={chartWidth}
        accuracyAverageData={userCompletedTestsAccuracy}
        onTestPress={(item: { label: string; testId: number; value: number }) => {
          navigate(ProgressNavigation.TEST_ANALYTICS, { testId: item.testId });
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    rowGap: 24,
    flex: 1,
    paddingHorizontal: '7.5%',
    width: '100%',
  },
});
