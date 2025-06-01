import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CompletedTest } from '../mobile-types/front-types';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

type Props = {
  completedTest: CompletedTest;
  onPress: () => void | Promise<void>;
};

export const CompletedTestCard = ({ completedTest, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.title}>{completedTest.test?.title}</Text>
        <Text style={styles.theme}>{completedTest.test?.theme}</Text>
      </View>
      <Text style={styles.description}>{completedTest.test?.description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.WHITE,
    margin: 8,
    borderRadius: 10,
    padding: 16,
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
    alignItems: 'center',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  accuracy: {
    ...typographyStyles.medium,
    color: Colors.PRIMARY,
  },
});
