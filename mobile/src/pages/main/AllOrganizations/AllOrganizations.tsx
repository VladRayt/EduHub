import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CardItem } from '@blocks/CardItem';
import { FilterDropdown } from '@blocks/FilterDropdown';
import { OrganizationsSearch } from '@blocks/OrganizationsSearch';
import { SortingDropdown } from '@blocks/SortingDropdown';
import { t } from '@config/i18next';
import { useMainNavigation } from '@hooks/useTypedNavigation';
import { Approvement, Organization, Permission, Sorting } from '../../../mobile-types/front-types';
import {
  MainNavigation,
  MainRouteProp,
  ProfileNavigation,
  ProfileRouteProps,
} from '../../../mobile-types/navigation.type';
import { useUserOrganizations } from '@requests/organization';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { typographyStyles } from '@styles/typography';
import { getSortedArrayBySorting } from '@utils/sorting';
import { useOrganizationStore } from '@zustand/organization.store';

type HOCProps =
  | MainRouteProp<MainNavigation.ALL_ORGANIZATIONS>
  | ProfileRouteProps<ProfileNavigation.ORGANIZATION_SELECT>;

type Props = HOCProps & {
  onItemPress: (organization: Organization) => void;
  onlyAdmin: boolean;
};

const AllOrganizations = ({ route, onItemPress, onlyAdmin }: Props) => {
  const { roleFilter, approveFilter, sorting, searchFilter } = route.params;

  const adminOrganizations = useOrganizationStore((state) => state.adminOrganizations);
  const userOrganizations = useOrganizationStore((state) => state.userOrganizations);
  const unapprovedOrganizations = useOrganizationStore((state) => state.unapprovedOrganizations);

  useUserOrganizations();

  const { setParams } = useMainNavigation();

  const renderItem = ({ item }: ListRenderItemInfo<Organization>) => {
    if (typeof item === 'string') {
      return <Text style={typographyStyles.xl}>{item}</Text>;
    } else {
      return (
        <View style={{ marginTop: 16 }}>
          <CardItem
            title={item.title}
            description={item.description ?? ''}
            backgroundColor={item.color}
            showIcon={false}
            onPress={() => onItemPress(item)}
          />
        </View>
      );
    }
  };

  const onChangeSearch = (search: string) => setParams({ searchFilter: search });
  const onChangeSort = (sort: Sorting) => setParams({ sorting: sort });
  const onChangeFilter = (filter: Permission | Approvement) => {
    if (filter === Approvement.DECLINED || filter === Approvement.PENDING) {
      setParams({ roleFilter: undefined, approveFilter: filter });
    } else {
      setParams({
        roleFilter: filter as Permission,
        approveFilter: Approvement.ACCEPTED,
      });
    }
  };

  const renderList = useMemo(() => {
    const initialList = [];
    const adminSorted = getSortedArrayBySorting(
      sorting,
      adminOrganizations,
      'title',
      'members',
      true
    ).filter((org) =>
      searchFilter ? org.title.toLowerCase().includes(searchFilter.toLowerCase()) : org
    );
    let userSorted: Organization[] = [];
    let unapprovedSorted: Organization[] = [];

    if (!onlyAdmin) {
      userSorted = getSortedArrayBySorting(
        sorting,
        userOrganizations,
        'title',
        'members',
        true
      ).filter((org) =>
        searchFilter ? org.title.toLowerCase() === searchFilter.toLowerCase() : org
      );
      unapprovedSorted = getSortedArrayBySorting(
        sorting,
        unapprovedOrganizations,
        'title',
        'members',
        true
      ).filter((org) =>
        searchFilter ? org.title.toLowerCase() === searchFilter.toLowerCase() : org
      );
    }

    if (
      adminSorted.length &&
      (!roleFilter || roleFilter !== Permission.READ) &&
      (!approveFilter || approveFilter === Approvement.ACCEPTED)
    )
      initialList.push(t('main.organizations-list.admin'), ...adminSorted);
    if (
      userSorted.length &&
      (!roleFilter || roleFilter !== Permission.WRITE) &&
      (!approveFilter || approveFilter === Approvement.ACCEPTED)
    )
      initialList.push(t('main.organizations-list.user'), ...userSorted);
    if (unapprovedSorted.length && (!approveFilter || approveFilter !== Approvement.ACCEPTED))
      initialList.push(t('main.organizations-list.pending'), ...unapprovedSorted);
    return initialList;
  }, [
    adminOrganizations,
    userOrganizations,
    unapprovedOrganizations,
    roleFilter,
    approveFilter,
    sorting,
    searchFilter,
  ]);

  return (
    <View style={styles.pageContainer}>
      <OrganizationsSearch onChange={onChangeSearch} />
      <View style={styles.filterContainer}>
        <SortingDropdown defaultSorting={sorting} onChange={onChangeSort} />
        <FilterDropdown
          defaultFilter={roleFilter ?? approveFilter ?? undefined}
          onChange={onChangeFilter}
        />
      </View>
      <FlashList
        style={styles.listContainer}
        data={renderList}
        renderItem={renderItem}
        getItemType={(item) => (typeof item === 'string' ? 'sectionHeader' : 'row')}
        estimatedItemSize={140}
      />
    </View>
  );
};

export const OrganizationListHOC = (props: HOCProps) => {
  const setSelectedOrganization = useOrganizationStore((state) => state.setSelectedOrganization);
  const isSeeAll = props.route.name === MainNavigation.ALL_ORGANIZATIONS;
  const onItemPress = (organization: Organization) => {
    setSelectedOrganization(organization);
    if (isSeeAll) {
      const seeAllProps = props as MainRouteProp<MainNavigation.ALL_ORGANIZATIONS>;
      return seeAllProps.navigation.navigate(MainNavigation.ORGANIZATION_DETAILS, {
        organizationId: organization.id,
      });
    }
    const seeAllProps = props as ProfileRouteProps<ProfileNavigation.ORGANIZATION_SELECT>;
    return seeAllProps.navigation.navigate(ProfileNavigation.ORGANIZATION, {
      organizationId: organization.id,
    });
  };

  return <AllOrganizations {...props} onItemPress={onItemPress} onlyAdmin={!isSeeAll} />;
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
  listContainer: {
    flex: 1,
    marginVertical: 20,
    width: '100%',
    rowGap: 10,
  },
});
