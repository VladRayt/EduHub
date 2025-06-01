import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

type Props = {
  accuracyAverageData: {
    value: number;
    label?: string | undefined;
    color?: string;
    testId?: number | undefined;
  }[];
  width: number;
  title: string;
  onTestPress: (item: { label: string; userId: string; value: number }) => void;
};

export const UniqueTestAnalytics = ({ accuracyAverageData, onTestPress, title, width }: Props) => {
  return (
    <View style={styles.content}>
      <Text style={typographyStyles.xl}>{title}</Text>
      <View style={styles.container}>
        <LineChart
          data={accuracyAverageData}
          maxValue={100}
          width={width}
          onPress={onTestPress}
          color={Colors.PRIMARY}
          dataPointsColor={Colors.PRIMARY}
          curved
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: 24,
  },
  container: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
});
