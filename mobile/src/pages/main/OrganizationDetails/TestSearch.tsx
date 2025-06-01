import { StyleSheet, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { IconButton } from '@components/IconButton';
import { t } from '@config/i18next';
import { Colors } from '@styles/colors';

type Props = {
  onChange: (value: string) => void | Promise<void>;
  onClearSearch: () => void;
};

export const TestSearch = ({ onChange, onClearSearch }: Props) => {
  return (
    <View style={styles.containerStyles}>
      <View style={[styles.containerStyles, styles.textInputStyles]}>
        <Icon name='search' size={32} />
        <TextInput
          onChangeText={onChange}
          placeholder={t('main.home.organization-details.search')}
          placeholderTextColor={Colors.DARK_GRAY}
        />
      </View>
      <View style={{ marginLeft: 'auto' }}>
        <IconButton
          onPress={onClearSearch}
          iconColor={Colors.DARK_GRAY}
          iconLib='Feather'
          iconName='arrow-left'
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyles: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInputStyles: {
    backgroundColor: Colors.LIGHT_GRAY,
    paddingHorizontal: 6,
    borderRadius: 12,
    height: 60,
    justifyContent: 'flex-start',
    columnGap: 16,
  },
});
