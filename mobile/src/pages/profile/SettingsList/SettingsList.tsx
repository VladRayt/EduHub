import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { ProfileNavigation } from '../../../mobile-types/navigation.type';
import { FlashList } from '@shopify/flash-list';
import { iconNameByRoute, settingNameByRoute } from '@utils/getSettingNameByRoute';

import { SettingItem } from './SettingItem';
import { SettingsListSearch } from './SettingsListSearch';

const getInitialState = (t: (keys: string) => string) => {
  return Object.entries(settingNameByRoute(t)).flatMap((entry) => {
    const [key, value] = entry as [ProfileNavigation, string];
    return {
      title: value,
      screenName: key,
      iconName: iconNameByRoute[key] as string,
    };
  });
};

export const SettingsList = () => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState<string>('');

  const filteredItems = useMemo(
    () =>
      getInitialState(t).filter((item) =>
        searchValue.length ? item.title.includes(searchValue) : item
      ),
    [searchValue, t]
  );
  return (
    <View style={styles.container}>
      <SettingsListSearch onChange={setSearchValue} placeholder={t('profile.list.search')} />
      <FlashList
        contentContainerStyle={styles.settingList}
        data={filteredItems}
        estimatedItemSize={40}
        renderItem={({ item }) => <SettingItem {...item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: '7.5%',
    paddingVertical: 16,
  },
  settingList: {
    paddingTop: 24,
  },
});
