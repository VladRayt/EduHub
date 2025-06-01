import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Feather';

import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';
import { getIconNameByFilter } from '@utils/filtering';

type Props = {
  onChange: (filter: 'Completed' | 'Uncompleted') => void;
  defaultFilter?: 'Completed' | 'Uncompleted';
};

export const CompletedDropdown = ({ defaultFilter, onChange }: Props) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const { t } = useTranslation();

  const data: { value: 'Completed' | 'Uncompleted'; label: string }[] = useMemo(() => {
    return [
      {
        label: t('filter.uncompleted'),
        value: 'Uncompleted',
      },
      {
        label: t('filter.completed'),
        value: 'Completed',
      },
    ];
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

  const renderItem = (
    item: { value: 'Completed' | 'Uncompleted'; label: string },
    selected: boolean | undefined
  ) => {
    return (
      <View style={selected ? styles.dropdownItemSelected : styles.dropdownItem}>
        <Icon name={getIconNameByFilter(item.value)} size={22} />
        <Text style={typographyStyles.medium}>{item.label}</Text>
      </View>
    );
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
        renderItem={renderItem}
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
