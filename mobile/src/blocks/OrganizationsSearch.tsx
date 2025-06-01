import { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { t } from '@config/i18next';

import { Colors } from '@styles/colors';

type Props = {
  onChange?: (value: string) => void | Promise<void>;
  onFocus?: () => void | Promise<void>;
  blurOnFocus?: boolean;
};

export const OrganizationsSearch = ({ onChange, onFocus, blurOnFocus }: Props) => {
  const inputRef = useRef<TextInput>(null);

  const onInputFocus = () => {
    onFocus && onFocus();
    if (blurOnFocus) inputRef.current?.blur();
  };

  return (
    <View style={styles.containerStyles}>
      <TextInput
        ref={inputRef}
        onFocus={onInputFocus}
        onChangeText={onChange ? onChange : () => {}}
        placeholder={t('main.home.search')}
        placeholderTextColor={Colors.DARK_GRAY}
      />
      <Icon name='search' size={32} />
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
    flexBasis: 64,
    paddingHorizontal: 12,
  },
});
