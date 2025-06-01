import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IconButton } from '@components/IconButton';
import { If } from '@components/If';
import { AnimatedInput } from '@components/Input';
import { t } from '@config/i18next';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

type Props = {
  userName: string;
  onSave: (value: string) => void | Promise<void>;
};

export const UserNameEdit = ({ userName, onSave }: Props) => {
  const [newName, setNewName] = useState<string>(userName);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleIconPress = () => {
    if (!isEdit) setIsEdit(true);
    if (isEdit) {
      setIsEdit(false);
      onSave(newName);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.previewContainer}>
        <Text style={[typographyStyles.large, styles.textColor, { flex: 1 }]}>
          {t('profile.profile.username')}
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
        <Text style={[typographyStyles.xl, styles.textColor]}>{newName}</Text>
      </If>
      <If value={isEdit}>
        <AnimatedInput
          placeholder={t('profile.profile.name')}
          onChangeText={setNewName}
          value={newName}
        />
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
