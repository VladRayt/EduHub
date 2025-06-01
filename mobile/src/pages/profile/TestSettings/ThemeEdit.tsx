import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IconButton } from '@components/IconButton';
import { If } from '@components/If';
import { AnimatedInput } from '@components/Input';
import { t } from '@config/i18next';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

type Props = {
  theme: string;
  onSave: (value: string) => void | Promise<void>;
};

export const ThemeEdit = ({ theme, onSave }: Props) => {
  const [newTheme, setNewTheme] = useState<string>(theme);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleIconPress = () => {
    if (!isEdit) setIsEdit(true);
    if (isEdit) {
      setIsEdit(false);
      onSave(newTheme);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.previewContainer}>
        <Text style={[typographyStyles.large, styles.textColor, { flex: 1 }]}>
          {t('profile.test-details.theme')}
        </Text>
        <IconButton
          iconColor={Colors.DARK_GRAY}
          iconName={isEdit ? 'save' : 'edit'}
          iconLib='Feather'
          onPress={handleIconPress}
        />
        <If value={isEdit}>
          <IconButton
            iconColor={Colors.DARK_GRAY}
            iconName={'x'}
            iconLib='Feather'
            onPress={() => setIsEdit(false)}
          />
        </If>
      </View>
      <If value={!isEdit}>
        <Text style={[typographyStyles.xl, styles.textColor]}>{newTheme}</Text>
      </If>
      <If value={isEdit}>
        <View style={styles.inputContainer}>
          <AnimatedInput
            placeholder={t('profile.test-details.theme-placeholder')}
            onChangeText={setNewTheme}
            value={newTheme}
          />
        </View>
      </If>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    columnGap: 12,
  },
  previewContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 12,
    width: '100%',
  },
  inputContainer: { flex: 1, width: '100%', marginTop: 12 },
  textColor: {
    color: Colors.DARK_GRAY,
  },
});
