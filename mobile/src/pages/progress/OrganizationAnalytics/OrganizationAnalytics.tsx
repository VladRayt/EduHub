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
import { useOrganizationDetails } from '@requests/organization';
import { useOrganizationStore } from '@zustand/organization.store';
import { useUserStore } from '@zustand/user.store';

import { UniqueOrganizationAnalytics } from './UniqueOrganizationAnalytics';

const chartWidth = Dimensions.get('screen').width - Dimensions.get('screen').width * 0.33;

type Props = ProgressRouteProp<ProgressNavigation.ORGANIZATION_ANALYTICS>;

export const OrganizationAnalytics = ({ route }: Props) => {
  const { organizationId } = route.params;
  const title = useOrganizationStore((state) => state.selectedOrganization?.title ?? '');
  const authorId = useOrganizationStore((state) => state.selectedOrganization?.authorId ?? '');
  const userId = useUserStore((state) => state.user!.id);
  useOrganizationDetails(organizationId);

  const { navigate: navigateProfile } = useProfileProgressNavigation();
  const { navigate: navigateMain } = useMainProgressNavigation();
  const { t } = useTranslation();

  const { data: testAnalytics } = trpc.analytics.organizationTestsAccuracy.useQuery({
    organizationId,
  });

  const averageTestAnalyticsData = testAnalytics?.data ?? [];

  return (
    <ScrollView style={styles.container}>
      <UniqueOrganizationAnalytics
        accuracyAverageData={averageTestAnalyticsData}
        width={chartWidth}
        title={`${t('progress.organization.details')} ${title}`}
        onOrganizationPress={({ testId }) => {
          navigateMain(ProgressNavigation.TEST_ANALYTICS, {
            testId,
          });
        }}
      />
      <Button
        style={{ marginTop: 24 }}
        title={t('progress.organization.button')}
        size={Size.FULL}
        rounded
        onPress={() => {
          if (authorId === userId) {
            return navigateProfile(BottomTabsRoutes.PROFILE, {
              screen: ProfileNavigation.ORGANIZATION,
              params: {
                organizationId,
              },
            });
          }
          return navigateMain(BottomTabsRoutes.WORKSPACES, {
            screen: MainNavigation.ORGANIZATION_DETAILS,
            params: {
              organizationId,
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
