import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import i18next from '@config/i18next';
import { typographyStyles } from '@styles/typography';

export const About = () => {
  const t = i18next.t;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profile.about.title')}</Text>
      <Text style={styles.description}>{t('profile.about.welcome')}</Text>
      <Text style={styles.description}>{t('profile.about.mission')}</Text>
      <Text style={styles.description}>{t('profile.about.thanks')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: '7.5%',
    flex: 1,
  },
  title: {
    ...typographyStyles.xl,
    marginBottom: 16,
  },
  description: {
    ...typographyStyles.medium,
    marginBottom: 16,
  },
});
