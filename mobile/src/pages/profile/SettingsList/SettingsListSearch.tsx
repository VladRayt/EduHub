import { StyleSheet, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { Colors } from '@styles/colors';

type Props = {
  onChange: (value: string) => void | Promise<void>;
  placeholder: string;
};

export const SettingsListSearch = ({ onChange, placeholder }: Props) => {
  return (
    <View style={styles.containerStyles}>
      <TextInput
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.DARK_GRAY}
      />
      <Icon name='search' size={32} color={Colors.DARK_GRAY} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyles: {
    backgroundColor: Colors.LIGHT_GRAY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    flexBasis: 48,
    paddingHorizontal: 12,
  },
});
