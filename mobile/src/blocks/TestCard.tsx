import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Test } from '../mobile-types/front-types';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

type Props = {
  test: Test;
  onPress: () => void | Promise<void>;
};

export const TestCard = ({ test, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{test.title}</Text>
        <Text style={styles.theme}>{test.theme}</Text>
      </View>
      <Text style={styles.description}>{test.description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 8,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    padding: 16,
    margin: 8,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    ...typographyStyles.large,
    fontWeight: 'bold',
  },
  theme: {
    ...typographyStyles.small,
    color: Colors.DARK_GRAY,
  },
  description: {
    ...typographyStyles.medium,
  },
});
