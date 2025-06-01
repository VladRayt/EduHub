import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, StyleSheet, View } from 'react-native';

import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';
import { getRandomTip, tips } from '@utils/tips';

export const LoadingScreen = () => {
  const [currentTip, setCurrentTip] = useState<string>(getRandomTip());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setCurrentTip(getRandomTip(tips.indexOf(currentTip)));
    const tipInterval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start(() => {
        setCurrentTip(getRandomTip(tips.indexOf(currentTip)));
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 2000);
    return () => clearInterval(tipInterval);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={64} color={Colors.PRIMARY} />
      <Animated.Text style={[styles.textStyle, { opacity: fadeAnim }]}>{currentTip}</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 24,
  },
  textStyle: {
    ...typographyStyles.large,
    textAlign: 'center',
  },
});
