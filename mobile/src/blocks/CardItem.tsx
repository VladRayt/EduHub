import React from 'react';
import { Animated, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

import { IconButton } from '@components/IconButton';
import { If } from '@components/If';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

type Props = {
  onPress: () => void;
  backgroundColor: string;
  title: string;
  description: string;
  showIcon?: boolean;
  style?: Record<string, string | number>;
  onIconPress?: () => void;
};

export const CardItem = (props: Props) => {
  const { backgroundColor, title, description, onPress, showIcon, onIconPress, style } = props;
  return (
    <TouchableOpacity
      style={[styles.itemContainer, { backgroundColor }, style]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.itemTextWrapper}>
        <Animated.Text style={styles.itemTitle}>{title}</Animated.Text>
        <Animated.Text style={styles.itemDescription}>{description}</Animated.Text>
      </View>
      {/* <If value={Boolean(showIcon)}>
        <IconButton onPress={onIconPress} iconLib='Feather' iconName='more-horizontal' />
      </If> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderRadius: 12,
    width: '100%',
    height: 180,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemTextWrapper: {
    rowGap: 12,
  },
  itemTitle: {
    ...typographyStyles.xl2,
    color: Colors.LIGHT_GRAY,
  },
  itemDescription: {
    ...typographyStyles.medium,
    color: Colors.LIGHT_GRAY,
  },
});
