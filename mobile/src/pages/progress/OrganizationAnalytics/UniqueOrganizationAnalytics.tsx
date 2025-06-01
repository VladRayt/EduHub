import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

import { typographyStyles } from '@styles/typography';

type Props = {
  accuracyAverageData: {
    value: number;
    label?: string | undefined;
    frontColor?: string;
    testId?: number | undefined;
  }[];
  width: number;
  title: string;
  onOrganizationPress: (item: { label: string; testId: number; value: number }) => void;
};

export const UniqueOrganizationAnalytics = (props: Props) => {
  return (
    <View style={styles.content}>
      <Text style={typographyStyles.xl}>{props.title}</Text>
      <View style={styles.container}>
        <BarChart
          data={props.accuracyAverageData}
          maxValue={100}
          width={props.width}
          onPress={props.onOrganizationPress}
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
