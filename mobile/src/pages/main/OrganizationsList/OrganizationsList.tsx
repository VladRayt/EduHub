import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import { CarouselListItems } from '@blocks/CarouselListItems';
import { OrganizationsSearch } from '@blocks/OrganizationsSearch';
import { Button, Size } from '@components/Button';
import { If } from '@components/If';
import { useMainNavigation } from '@hooks/useTypedNavigation';
import { Approvement, Permission } from '../../../mobile-types/front-types';
import { MainNavigation } from '../../../mobile-types/navigation.type';
import { useUserOrganizations } from '@requests/organization';
import { Colors, PrimaryColor } from '@styles/colors';
import { typographyStyles } from '@styles/typography';
import { useOrganizationStore } from '@zustand/organization.store';
import { useUserStore } from '@zustand/user.store';

import { OrganizationsListHeader } from './OrganizationsListHeader';

const imageWidth = Dimensions.get('screen').width * 0.5;

export const OrganizationsList = () => {
  const userName = useUserStore((state) => state.user?.name);
  const adminOrganizations = useOrganizationStore((state) => state.adminOrganizations);
  const userOrganizations = useOrganizationStore((state) => state.userOrganizations);

  const setSelectedOrganization = useOrganizationStore((state) => state.setSelectedOrganization);

  const { navigate } = useMainNavigation();
  const { t } = useTranslation();

  const { isLoading, isError } = useUserOrganizations();

  const { userItems, adminItems } = useMemo(
    () => ({
      userItems: userOrganizations.map((org) => ({
        id: org.id,
        title: org.title,
        description: org.description ?? '',
        color: org.color as PrimaryColor,
      })),
      adminItems: adminOrganizations.map((org) => ({
        id: org.id,
        title: org.title,
        description: org.description ?? '',
        color: org.color as PrimaryColor,
      })),
    }),
    [userOrganizations, adminOrganizations]
  );

  const onSeeAllPress = (permission: Permission) => () => {
    navigate(MainNavigation.ALL_ORGANIZATIONS, {
      roleFilter: permission,
      approveFilter: Approvement.ACCEPTED,
    });
  };

  const onOrganizationPress = (id: string) => {
    const currentOrganization =
      adminOrganizations.find((org) => org.id === id) ??
      userOrganizations.find((org) => org.id === id);
    if (!currentOrganization) return;
    setSelectedOrganization(currentOrganization);
    navigate(MainNavigation.ORGANIZATION_DETAILS, { organizationId: id });
  };

  const onIconPress = (item: (typeof userItems)[0]) => {
    console.log('Pressed into item with title:', item.title);
  };

  return (
    <>
      <If value={isLoading}>
        <ActivityIndicator color={Colors.PRIMARY} size={64} style={styles.loader} />
      </If>
      <If value={!isLoading && !isError}>
        <View style={styles.mainPageContainer}>
          <OrganizationsListHeader navigate={navigate} userName={userName} />
          <OrganizationsSearch
            blurOnFocus
            onFocus={() => navigate(MainNavigation.ALL_ORGANIZATIONS, {})}
          />
          <If value={adminOrganizations.length > 0}>
            <CarouselListItems
              seeAll={t('main.home.see-all')}
              items={adminItems}
              title={t('main.home.admin')}
              onIconPress={onIconPress}
              onItemPress={onOrganizationPress}
              onSeeAllPress={onSeeAllPress(Permission.WRITE)}
            />
          </If>
          <If value={userOrganizations.length > 0}>
            <CarouselListItems
              seeAll={t('main.home.see-all')}
              items={userItems}
              title={t('main.home.user')}
              onIconPress={onIconPress}
              onItemPress={onOrganizationPress}
              onSeeAllPress={onSeeAllPress(Permission.READ)}
            />
          </If>
          <If value={adminOrganizations.length === 0 && userOrganizations.length === 0}>
            <View style={styles.imageContainer}>
              <Image
                source={require('@assets/empty_page.png')}
                resizeMode='contain'
                width={imageWidth}
                style={styles.image}
              />
              <Text style={[typographyStyles.medium, { textAlign: 'center' }]}>
                {t('main.home.empty')}
              </Text>
              <Button
                rounded
                disabled={false}
                title={t('main.home.button')}
                size={Size.LARGE}
                onPress={() => navigate(MainNavigation.CREATE_ORGANIZATION)}
              />
            </View>
          </If>
        </View>
      </If>
    </>
  );
};

const styles = StyleSheet.create({
  mainPageContainer: {
    paddingVertical: 48,
    rowGap: 24,
    paddingHorizontal: '7.5%',
    width: '100%',
  },
  loader: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 24,
    height: '75%',
  },
  image: {
    width: imageWidth,
    aspectRatio: 1,
    height: 'auto',
  },
});
