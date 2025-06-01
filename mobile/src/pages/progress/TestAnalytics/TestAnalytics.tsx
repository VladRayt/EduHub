import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';

import { Button, Size } from '@components/Button';
import { useMainProgressNavigation, useProfileProgressNavigation } from '@hooks/useTypedNavigation';
import {
  BottomTabsRoutes,
  MainNavigation,
  ProfileNavigation,
  ProgressNavigation,
  ProgressRouteProp,
} from '../../../mobile-types/navigation.type';
import { trpc } from '@requests/RequestContext';
import { useTestDetails } from '@requests/test';
import { useTestStore } from '@zustand/test.store';
import { useUserStore } from '@zustand/user.store';

import { UniqueTestAnalytics } from './UniqueTestAnalytics';

const chartWidth = Dimensions.get('screen').width - Dimensions.get('screen').width * 0.33;

type Props = ProgressRouteProp<ProgressNavigation.TEST_ANALYTICS>;

export const TestAnalytics = ({ route }: Props) => {
  const { testId } = route.params;
  const title = useTestStore((state) => state.selectedTest?.title ?? '');
  const authorId = useTestStore((state) => state.selectedTest?.userId ?? '');
  const userId = useUserStore((state) => state.user!.id);
  useTestDetails(testId);

  const { navigate: navigateProfile } = useProfileProgressNavigation();
  const { navigate: navigateMain } = useMainProgressNavigation();
  const { t } = useTranslation();

  const { data: testAnalytics } = trpc.analytics.accuracyForTestAcrossUsers.useQuery({
    userId,
    testId,
  });

  const averageTestAnalyticsData = testAnalytics?.data ?? [];

  return (
    <ScrollView style={styles.container}>
      <UniqueTestAnalytics
        accuracyAverageData={averageTestAnalyticsData}
        width={chartWidth}
        title={`${t('progress.test.details')} ${title}`}
        onTestPress={({ userId: userThatCompleteTest }) => {
          navigateMain(ProgressNavigation.USER_ANALYTICS, {
            userId: userThatCompleteTest,
          });
        }}
      />
      <Button
        style={{ marginTop: 24 }}
        title={t('progress.test.button')}
        size={Size.FULL}
        rounded
        onPress={() => {
          if (authorId === userId) {
            return navigateProfile(BottomTabsRoutes.PROFILE, {
              screen: ProfileNavigation.TEST,
              params: {
                testId: testId,
              },
            });
          }
          return navigateMain(BottomTabsRoutes.WORKSPACES, {
            screen: MainNavigation.COMPLETED_TEST_DETAILS,
            params: {
              testId: testId,
            },
          });
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
