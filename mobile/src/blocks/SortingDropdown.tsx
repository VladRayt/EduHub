import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Sorting } from '../mobile-types/front-types';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';
import { getIconNameBySorting, getTitleBySorting } from '@utils/sorting';

type Props = {
  onChange: (sorting: Sorting) => void;
  defaultSorting?: Sorting;
};

export const SortingDropdown = ({ defaultSorting, onChange }: Props) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const { t } = useTranslation();

  const data = useMemo(() => {
    return Object.values(Sorting).map((method) => ({
      label: getTitleBySorting(method, t),
      value: method,
    }));
  }, [t]);

  const renderLabel = () => {
    if (defaultSorting || isFocused) {
      return (
        <Text style={[styles.label, (defaultSorting ?? isFocused) && { color: Colors.PRIMARY }]}>
          {t('sorting.title')}
        </Text>
      );
    }
    return null;
  };

  return (
    <View>
      {renderLabel()}
      <Dropdown
        value={data.find((item) => item.value === defaultSorting)}
        data={data}
        placeholder={!isFocused ? t('sorting.title') : '...'}
        placeholderStyle={styles.textStyle}
        selectedTextStyle={styles.textStyle}
        renderLeftIcon={() => <Icon name={getIconNameBySorting(defaultSorting)} size={22} />}
        labelField={'label'}
        valueField={'value'}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={({ value }) => onChange(value)}
        style={isFocused || defaultSorting ? styles.dropdownButtonFocused : styles.dropdownButton}
        renderItem={(item, selected) => {
          return (
            <View style={selected ? styles.dropdownItemSelected : styles.dropdownItem}>
              <Icon
                name={getIconNameBySorting(item.value)}
                size={22}
                style={styles.iconContainer}
              />
              <Text style={styles.textStyle}>{item.label}</Text>
            </View>
          );
        }}
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
    flex: 1,
  },
  iconContainer: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
