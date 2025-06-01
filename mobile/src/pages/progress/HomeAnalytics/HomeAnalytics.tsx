import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet } from 'react-native';

import { If } from '@components/If';
import { useProgressNavigation } from '@hooks/useTypedNavigation';
import { ProgressNavigation } from '../../../mobile-types/navigation.type';
import { trpc } from '@requests/RequestContext';
import { Colors } from '@styles/colors';
import { useUserStore } from '@zustand/user.store';

import { AverageOrganizationAccuracy } from './AverageOrganizationAccuracy';
import { AverageUserAccuracy } from './AverageUserAccuracy';
import { CreatedTestsAccuracy } from './CreatedTestsAccuracy';

const chartWidth = Dimensions.get('screen').width - Dimensions.get('screen').width * 0.33;

export const HomeAnalytics = () => {
  const userId = useUserStore((state) => state.user!.id);
  const { navigate } = useProgressNavigation();
  const { t } = useTranslation();
  const { data: testAccuracyData } = trpc.analytics.userCompletedTestsAccuracy.useQuery({
    userId,
  });
  const { data: organizationAccuracyData, isFetching: isFetchingOrganizations } =
    trpc.analytics.userCreatedOrganizationsAccuracy.useQuery({
      userId,
    });
  const { data: createdTestAccuracyData, isFetching: isFetchingTests } =
    trpc.analytics.userCreatedTestsAccuracy.useQuery({
      userId,
    });
  const userCompletedTestsAccuracy = testAccuracyData?.data ?? [];
  const userOrganizationsAccuracy = organizationAccuracyData?.data ?? [];
  const userCreatedTestsAccuracy = createdTestAccuracyData?.data ?? [];

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
      <If value={isFetchingTests || isFetchingOrganizations}>
        <ActivityIndicator
          color={Colors.PRIMARY}
          size={64}
          style={{
            flex: 1,
          }}
        />
      </If>
      <If value={!isFetchingTests && !isFetchingOrganizations}>
        <AverageUserAccuracy
          title={t('progress.home.average-user')}
          accuracyAverageData={accuracyAverageData}
        />
        <CreatedTestsAccuracy
          title={t('progress.home.created-tests')}
          width={chartWidth}
          accuracyAverageData={userCreatedTestsAccuracy}
          onTestPress={(item: { label: string; testId: number; value: number }) => {
            navigate(ProgressNavigation.TEST_ANALYTICS, { testId: item.testId });
          }}
        />
        <AverageOrganizationAccuracy
          title={t('progress.home.average-organizations')}
          accuracyAverageData={userOrganizationsAccuracy}
          width={chartWidth}
          onOrganizationPress={(item: { label: string; organizationId: string; value: number }) => {
            navigate(ProgressNavigation.ORGANIZATION_ANALYTICS, {
              organizationId: item.organizationId,
            });
          }}
        />
      </If>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    marginBottom: 16,
    rowGap: 24,
    flex: 1,
    paddingHorizontal: '7.5%',
    width: '100%',
  },
});
