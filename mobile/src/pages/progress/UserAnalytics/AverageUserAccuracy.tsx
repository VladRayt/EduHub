import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import { typographyStyles } from '@styles/typography';

type Props = {
  name: string;
  accuracyAverageData: { value: number; label: string; color: string }[]; // Changed color type to string
};

export const AverageUserAccuracy = ({ name, accuracyAverageData }: Props) => {
  return (
    <>
      <Text style={typographyStyles.xl}>{name}</Text>
      <View style={styles.container}>
        <PieChart data={accuracyAverageData} donut initialAngle={45} radius={75} />
        <View style={styles.legendContainer}>
          {accuracyAverageData.map((accuracy) => (
            <View key={accuracy.label} style={styles.legendItem}>
              <View style={[styles.colorIndicator, { backgroundColor: accuracy.color }]} />
              <Text style={styles.label}>{accuracy.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  legendContainer: {
    marginLeft: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    marginRight: 16,
  },
  label: {
    ...typographyStyles.medium,
  },
});
