import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { Avatar } from '@components/Avatar';
import { t } from '@config/i18next';
import { typographyStyles } from '@styles/typography';

type Props = {
  title: string;
  description: string;
  membersLength: number;
  completedTests: number;
  allTests: number;
  name?: string;
};

export const DetailsHeader = (props: Props) => {
  const {
    name = t('main.organization-details.default-username'),
    title,
    description,
    membersLength,
    completedTests,
    allTests,
  } = props;

  const completionPercentage = allTests > 0 ? Math.round((completedTests / allTests) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar name={name} />
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metricCard}>
          <View style={styles.metricIconContainer}>
            <Icon name='users' size={20} color='#007AFF' />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>{membersLength}</Text>
            <Text style={styles.metricLabel}>{t('main.organization-details.members')}</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricIconContainer}>
            <Icon name='check-circle' size={20} color='#34C759' />
          </View>
          <View style={styles.metricContent}>
            <Text style={styles.metricValue}>
              {completedTests}/{allTests}
            </Text>
            <Text style={styles.metricLabel}>{t('main.organization-details.tests')}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    paddingHorizontal: 12,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: '5%',
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    ...typographyStyles.xl2,
    color: '#1C1C1E',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    ...typographyStyles.medium,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  metricIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  metricContent: {
    flex: 1,
  },
  metricValue: {
    ...typographyStyles.small,
    color: '#1C1C1E',
    fontWeight: '600',
    marginBottom: 4,
  },
  metricLabel: {
    ...typographyStyles.small,
    color: '#8E8E93',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 2,
  },
});
