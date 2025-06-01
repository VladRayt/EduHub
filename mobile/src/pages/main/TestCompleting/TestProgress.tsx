import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { Colors } from '@styles/colors';

type Props = {
  questionsLength: number;
  isQuestionActive: boolean;
  currentQuestionIndex: number;
};

export const TestProgress = (props: Props) => {
  const { questionsLength, isQuestionActive, currentQuestionIndex } = props;
  const filledWidth = (currentQuestionIndex / questionsLength) * 100;
  const backgroundColor = isQuestionActive ? Colors.YELLOW : Colors.GREEN;
  return (
    <View style={styles.backgroundContainer}>
      <Animated.View
        style={[
          styles.viewStyle,
          {
            width: `${filledWidth}%`,
            backgroundColor,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    backgroundColor: Colors.DARK_GRAY,
    width: '100%',
    height: 12,
    borderRadius: 4,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  viewStyle: {
    height: '100%',
    borderRadius: 4,
  },
});
