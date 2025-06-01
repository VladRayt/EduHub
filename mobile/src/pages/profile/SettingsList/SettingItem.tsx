import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { useProfileNavigation } from '@hooks/useTypedNavigation';
import { ProfileNavigation } from '../../../mobile-types/navigation.type';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

type Props = {
  title: string;
  iconName: string;
  screenName: ProfileNavigation;
};

export const SettingItem = ({ title, screenName, iconName }: Props) => {
  const { navigate } = useProfileNavigation();
  return (
    <TouchableOpacity style={styles.card} onPress={() => navigate(screenName, {} as any)}>
      <Icon color={Colors.DARK_GRAY} size={22} name={iconName} />
      <Text style={styles.textStyle}>{title}</Text>
      <Icon color={Colors.DARK_GRAY} name='chevron-right' size={22} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    columnGap: 24,
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textStyle: {
    flex: 1,
    ...typographyStyles.medium,
  },
});
