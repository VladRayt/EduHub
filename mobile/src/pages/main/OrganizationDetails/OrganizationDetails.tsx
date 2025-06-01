import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, View } from 'react-native';

import { IconButton } from '@components/IconButton';
import { If } from '@components/If';
import { useMainNavigation, useMainProfileNavigation } from '@hooks/useTypedNavigation';
import { CompletedTest, Permission, Test } from '../../../mobile-types/front-types';
import {
  BottomTabsRoutes,
  MainNavigation,
  MainRouteProp,
  ProfileNavigation,
} from '../../../mobile-types/navigation.type';
import { useOrganizationDetails } from '@requests/organization';
import { useOrganizationTests } from '@requests/test';
import { Colors, PrimaryColor } from '@styles/colors';
import { typographyStyles } from '@styles/typography';
import { useOrganizationStore } from '@zustand/organization.store';
import { useTestStore } from '@zustand/test.store';
import { useUserStore } from '@zustand/user.store';

import { DetailsHeader } from './DetailsHeader';
import { TestButtonGroup } from './TestButtonGroup';
import { TestListRender } from './TestListRender';
import { TestSearch } from './TestSearch';

type Props = MainRouteProp<MainNavigation.ORGANIZATION_DETAILS>;

export const OrganizationDetails = ({ route }: Props) => {
  const { organizationId } = route.params;
  const { navigate, setOptions } = useMainNavigation();
  const { t } = useTranslation();

  const [selectedTab, setSelectedTab] = useState<'completed' | 'uncompleted'>('uncompleted');
  const [searchValue, setSearchValue] = useState<string | null>(null);

  const userName = useUserStore((state) => state.user?.name);
  const permission = useUserStore((state) => state.organizationUser?.permission);
  const organization = useOrganizationStore((state) => state.selectedOrganization);
  const completedTests = useTestStore((state) => state.completedTests);
  const uncompletedTests = useTestStore((state) => state.workspaceTests);
  const allTestsLength = useTestStore((state) => state.testLength);
  const setSelectedTest = useTestStore((state) => state.setSelectedTest);

  useOrganizationDetails(organizationId);

  const { isLoading: isLoadingTests } = useOrganizationTests(organizationId);
  const { navigate: navigateProfile } = useMainProfileNavigation();

  const isAdmin = false;

  const setHeaderOptions = useCallback(() => {
    const headerRight = () => (
      <IconButton
        iconLib='Feather'
        iconName='settings'
        iconColor={Colors.LIGHT_GRAY}
        onPress={() =>
          navigateProfile(BottomTabsRoutes.PROFILE, {
            screen: ProfileNavigation.ORGANIZATION,
            params: { organizationId },
          })
        }
      />
    );
    setOptions({
      title: organization?.title,
      headerStyle: {
        backgroundColor: organization?.color,
      },
      headerRight: isAdmin ? headerRight : undefined,
      headerLeft: () => (
        <IconButton
          iconLib='Feather'
          iconName='bell'
          iconColor={Colors.LIGHT_GRAY}
          onPress={() => {}}
        />
      ),
    });
  }, [organization?.title, permission]);

  const selectTest = (test: CompletedTest | Test, isCompleted?: boolean | undefined) => {
    setSelectedTest(test, isCompleted);
    if (!isAdmin) {
      if (isCompleted) {
        navigate(MainNavigation.COMPLETED_TEST_DETAILS, {
          testId: (test as CompletedTest).testId,
        });
      } else {
        navigate(MainNavigation.TEST_DETAILS, { testId: (test as Test).id });
      }
    } else {
      navigateProfile(BottomTabsRoutes.PROFILE, {
        screen: ProfileNavigation.TEST,
        params: { testId: 'id' in test ? test.id : test.testId },
      });
    }
  };

  const onAddPress = () => {
    // if (!isAdmin) {
    //   return Alert.alert(
    //     t('main.organization-details.alert-title'),
    //     t('main.organization-details.alert-description')
    //   );
    // }
    return navigate(MainNavigation.CREATE_TEST, {
      organizationId,
    });
  };

  const { filteredCompleted, filteredUncompleted } = useMemo(() => {
    if (isAdmin) {
      const mergedTests = uncompletedTests.concat(
        completedTests.map((completed) => completed.test as Test)
      );
      return {
        filteredCompleted: [],
        filteredUncompleted: mergedTests.filter((test) => {
          return searchValue ? test.title.includes(searchValue) : test;
        }),
      };
    }
    if (selectedTab === 'completed') {
      return {
        filteredCompleted: completedTests.filter((test) => {
          return searchValue ? test?.test?.title.includes(searchValue) : test;
        }),
        filteredUncompleted: uncompletedTests,
      };
    }
    return {
      filteredCompleted: completedTests,
      filteredUncompleted: uncompletedTests.filter((test) => {
        return searchValue ? test.title.includes(searchValue) : test;
      }),
    };
  }, [searchValue, selectedTab, uncompletedTests.length, completedTests.length]);

  useLayoutEffect(() => setHeaderOptions(), [setHeaderOptions]);
  return (
    <ScrollView>
      <View
        style={[
          styles.headerContainer,
          {
            // backgroundColor: organization?.color,
          },
        ]}
      >
        <DetailsHeader
          name={userName}
          title={organization?.title ?? ''}
          description={organization?.description ?? ''}
          membersLength={organization?.members?.length ?? 0}
          completedTests={completedTests.length ?? 0}
          allTests={allTestsLength}
        />
      </View>
      <View style={styles.pageContainer}>
        <If value={searchValue === null}>
          <TestButtonGroup
            selectedTab={selectedTab}
            organizationColor={organization?.color as PrimaryColor}
            isAdmin={isAdmin}
            setSelectedTab={setSelectedTab}
            onSearchClick={() => setSearchValue('')}
            onAddClick={onAddPress}
          />
        </If>
        <If value={searchValue !== null}>
          <TestSearch
            onChange={(value) => setSearchValue(value)}
            onClearSearch={() => setSearchValue(null)}
          />
        </If>
        <If value={isLoadingTests}>
          <ActivityIndicator
            color={Colors.PRIMARY}
            size={64}
            style={{
              flex: 1,
            }}
          />
        </If>
        <TestListRender
          selectTest={selectTest}
          selectedTab={selectedTab}
          isAdmin={isAdmin}
          isLoadingTests={isLoadingTests}
          filteredCompleted={filteredCompleted}
          filteredUncompleted={filteredUncompleted}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    minHeight: Dimensions.get('screen').height / 3,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  pageContainer: {
    paddingVertical: 16,
    rowGap: 24,
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
});
