import { useMemo } from 'react';
import { GestureResponderEvent, StyleSheet, TouchableHighlight } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { Colors } from '@styles/colors';

type Props = {
  iconLib: 'Feather' | 'FontAwesome5';
  iconName: string;
  onPress?: (event: GestureResponderEvent) => Promise<void> | void;
  iconColor?: Colors;
  blurHexColor?: Colors;
  disabled?: boolean;
};

export function IconButton(props: Props) {
  const { iconName, onPress, iconColor, blurHexColor, iconLib, disabled } = props;
  const Icon = useMemo(() => {
    switch (iconLib) {
      case 'Feather':
        return FeatherIcon;
      case 'FontAwesome5':
        return FontAwesome5;
    }
  }, [iconLib]);
  return (
    <TouchableHighlight
      disabled={disabled}
      onPress={onPress}
      style={styles.buttonContainer}
      underlayColor={(blurHexColor ?? Colors.BLACK) + '20'}
    >
      <Icon name={iconName} size={32} color={iconColor ?? Colors.LIGHT_GRAY} />
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
