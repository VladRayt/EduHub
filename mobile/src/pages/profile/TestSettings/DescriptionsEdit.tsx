import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IconButton } from '@components/IconButton';
import { If } from '@components/If';
import { AnimatedTextArea } from '@components/TextArea';
import { t } from '@config/i18next';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

type Props = {
  description: string;
  onSave: (value: string) => void | Promise<void>;
};

export const DescriptionEdit = ({ description, onSave }: Props) => {
  const [newDescription, setNewDescription] = useState<string>(description);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleIconPress = () => {
    if (!isEdit) setIsEdit(true);
    if (isEdit) {
      setIsEdit(false);
      onSave(newDescription);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.previewContainer}>
        <Text style={[typographyStyles.large, styles.textColor, { flex: 1 }]}>
          {t('profile.test-details.description')}
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
        <Text style={[typographyStyles.xl, styles.textColor]}>{newDescription}</Text>
      </If>
      <If value={isEdit}>
        <View style={styles.inputContainer}>
          <AnimatedTextArea
            placeholder={t('profile.test-details.description-placeholder')}
            onChangeText={setNewDescription}
            value={newDescription}
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
