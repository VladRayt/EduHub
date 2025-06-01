import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CardItem } from '@blocks/CardItem';
import { IconButton } from '@components/IconButton';
import { t } from '@config/i18next';
import { Colors, PrimaryColor } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

type Props = {
  title: string;
  description: string;
  initialColor: PrimaryColor;
  onSave: (value: string) => void | Promise<void>;
};

export const ColorEdit = ({ title, description, initialColor, onSave }: Props) => {
  const [newColor, setNewColor] = useState<PrimaryColor>(initialColor);
  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={[typographyStyles.large, styles.textColor, { flex: 1 }]}>
          {t('profile.organization-details.color')}
        </Text>
        <IconButton
          iconColor={Colors.DARK_GRAY}
          iconName={'save'}
          iconLib='Feather'
          onPress={() => onSave(newColor)}
        />
      </View>
      <View style={styles.colorContainer}>
        {Object.values(PrimaryColor).map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorItem,
              { backgroundColor: color, borderColor: newColor === color ? 'black' : 'transparent' },
            ]}
            onPress={() => setNewColor(color)}
          />
        ))}
      </View>
      <CardItem
        title={title}
        description={description}
        onPress={() => {}}
        showIcon={false}
        backgroundColor={newColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  textColor: {
    color: Colors.DARK_GRAY,
  },
  colorItem: {
    borderRadius: 25,
    width: 50,
    height: 50,
    borderWidth: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
