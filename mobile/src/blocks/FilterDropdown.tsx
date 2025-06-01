import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Feather';

import { Approvement, Permission } from '../mobile-types/front-types';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';
import { getIconNameByFilter, getTitleByFilter } from '@utils/filtering';

type Props = {
  onChange: (sorting: Approvement | Permission) => void;
  defaultFilter?: Approvement | Permission;
};

export const FilterDropdown = ({ defaultFilter, onChange }: Props) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const { t } = useTranslation();

  const data = useMemo(() => {
    const permissionData = Object.values(Permission).map((method) => ({
      label: getTitleByFilter(method, t),
      value: method,
    }));

    const approvementData = Object.values(Approvement)
      .map((method) => ({
        label: getTitleByFilter(method, t),
        value: method,
      }))
      .filter((item) => item.value !== Approvement.ACCEPTED);

    return [...approvementData, ...permissionData];
  }, [t]);

  const renderLabel = () => {
    if (defaultFilter || isFocused) {
      return (
        <Text style={[styles.label, (defaultFilter || isFocused) && { color: Colors.PRIMARY }]}>
          {t('filter.title')}
        </Text>
      );
    }
    return null;
  };

  return (
    <View>
      {renderLabel()}
      <Dropdown
        value={data.find((item) => item.value === defaultFilter)}
        data={data}
        placeholder={!isFocused ? t('filter.title') : '...'}
        placeholderStyle={styles.textStyle}
        selectedTextStyle={styles.textStyle}
        renderLeftIcon={() => <Icon name={getIconNameByFilter(defaultFilter)} size={22} />}
        labelField={'label'}
        valueField={'value'}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={isFocused || defaultFilter ? styles.dropdownButtonFocused : styles.dropdownButton}
        renderItem={(item, selected) => {
          return (
            <View style={selected ? styles.dropdownItemSelected : styles.dropdownItem}>
              <Icon name={getIconNameByFilter(item.value)} size={22} />
              <Text style={typographyStyles.medium}>{item.label}</Text>
            </View>
          );
        }}
        onChange={({ value }) => onChange(value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownItem: {
    flexDirection: 'row',
    columnGap: 12,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownItemSelected: {
    flexDirection: 'row',
    columnGap: 12,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.BACKGROUND,
  },
  dropdownButton: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  dropdownButtonFocused: {
    height: 50,
    borderColor: Colors.PRIMARY,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  label: {
    position: 'absolute',
    backgroundColor: Colors.BACKGROUND,
    left: 20,
    top: -8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  textStyle: {
    ...typographyStyles.medium,
    paddingLeft: 12,
  },
});
