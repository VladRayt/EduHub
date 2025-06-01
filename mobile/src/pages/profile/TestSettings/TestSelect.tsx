import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { OrganizationsSearch } from '@blocks/OrganizationsSearch';
import { SortingDropdown } from '@blocks/SortingDropdown';
import { TestCard } from '@blocks/TestCard';
import { t } from '@config/i18next';
import { useMainProfileNavigation } from '@hooks/useTypedNavigation';
import { Test } from '../../../mobile-types/front-types';
import {
  BottomTabsRoutes,
  MainNavigation,
  ProfileNavigation,
  ProfileRouteProps,
} from '../../../mobile-types/navigation.type';
import { useUserTests } from '@requests/test';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { typographyStyles } from '@styles/typography';
import { getSortedArrayBySorting } from '@utils/sorting';
import { useTestStore } from '@zustand/test.store';

import { CompletedDropdown } from './CompletedDropdown';

type Props = ProfileRouteProps<ProfileNavigation.TEST_SELECT>;

export const TestSelect = ({ route, navigation }: Props) => {
  const { completeFilter, sorting, searchFilter } = route.params;

  const { completed, created } = useTestStore((state) => state.userTests);
  const setSelectedTest = useTestStore((state) => state.setSelectedTest);

  useUserTests();

  const { setParams } = navigation;
  const { navigate } = useMainProfileNavigation();

  const onItemPress = (item: Test) => {
    if (!item) return;
    setSelectedTest(item);
    if (created.some((test) => test.id === item.id)) {
      return navigate(ProfileNavigation.TEST, { testId: item.id });
    }
    return navigate(BottomTabsRoutes.WORKSPACES, {
      screen: MainNavigation.COMPLETED_TEST_DETAILS,
      params: {
        testId: item.id,
      },
    });
  };

  const renderList = useMemo(() => {
    const initialList = [];
    const completedSorted = getSortedArrayBySorting(
      sorting,
      completed.map((completed) => ({
        ...completed.test,
        userId: completed.userId,
        organizationId: completed.organizationId,
      })),
      'title',
      'questions',
      true
    ).filter((test) =>
      searchFilter && test.title
        ? test.title.toLowerCase().includes(searchFilter.toLowerCase())
        : test
    );
    const uncompletedSorted = getSortedArrayBySorting(
      sorting,
      created,
      'title',
      'questions',
      true
    ).filter((test) =>
      searchFilter ? test.title.toLowerCase().includes(searchFilter.toLowerCase()) : test
    );

    if (completedSorted.length && (!completeFilter || completeFilter !== 'Uncompleted'))
      initialList.push(t('profile.tests-list.completed'), ...completedSorted);
    if (uncompletedSorted.length && (!completeFilter || completeFilter !== 'Completed'))
      initialList.push(t('profile.tests-list.created'), ...uncompletedSorted);

    return initialList;
  }, [completed.length, created.length, completeFilter, sorting, searchFilter]);

  const renderItem = ({ item }: ListRenderItemInfo<string | Test>) => {
    if (typeof item === 'string') {
      return <Text style={typographyStyles.xl}>{item}</Text>;
    } else {
      return <TestCard test={item} onPress={() => onItemPress(item)} />;
    }
  };

  return (
    <View style={styles.pageContainer}>
      <OrganizationsSearch onChange={(value) => setParams({ searchFilter: value })} />
      <View style={styles.filterContainer}>
        <SortingDropdown
          defaultSorting={sorting}
          onChange={(sort) => setParams({ sorting: sort })}
        />
        <CompletedDropdown
          defaultFilter={completeFilter}
          onChange={(completeFilter) => setParams({ completeFilter })}
        />
      </View>
      <FlashList
        contentContainerStyle={styles.list}
        data={renderList}
        renderItem={renderItem}
        getItemType={(item) => {
          return typeof item === 'string' ? 'sectionHeader' : 'row';
        }}
        estimatedItemSize={140}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    paddingVertical: 16,
    rowGap: 24,
    flex: 1,
    paddingHorizontal: '7.5%',
    width: '100%',
  },
  filterContainer: {
    flexDirection: 'column',
    rowGap: 12,
  },
  list: {
    // flex: 1,
    // marginVertical: 20,
    // width: '100%',
    // rowGap: 10,
  },
});
