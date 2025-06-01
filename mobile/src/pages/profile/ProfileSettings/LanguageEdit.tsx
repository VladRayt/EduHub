import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { changeLanguage } from 'i18next';

import { Button } from '@components/Button';
import i18next from '@config/i18next';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';
import { getLocale, setLocale } from '@utils/locale';

export const LanguageEdit = () => {
  const [currentLocale, setCurrentLocale] = useState<string>(getLocale());

  const handleSelectLanguage = (locale: string) => {
    setLocale(locale);
    setCurrentLocale(locale);
    i18next.changeLanguage(locale);
    changeLanguage(locale);
  };

  return (
    <View>
      <Text style={[typographyStyles.large, styles.textColor]}>
        {i18next.t('profile.profile.change-language')}
      </Text>
      <View style={styles.inputContainer}>
        <Button
          title='🇬🇧 English'
          onPress={() => handleSelectLanguage('en')}
          style={currentLocale === 'en' && styles.selectedLng}
        />
        <Button
          title='🇺🇦 Українська'
          onPress={() => handleSelectLanguage('ua')}
          style={currentLocale === 'ua' && styles.selectedLng}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    rowGap: 12,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'red',
  },
  textColor: {
    color: Colors.DARK_GRAY,
  },
  selectedLng: {
    opacity: 0.8,
  },
});
