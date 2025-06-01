import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { If } from '@components/If';
import { Colors, PrimaryColor } from '@styles/colors';

export enum Size {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  FULL = 'full',
}

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  rounded?: boolean;
  size?: Size;
  icon?: React.ReactNode;
  color?: PrimaryColor | Colors;
}

export const Button = (props: ButtonProps) => {
  const buttonStyles = useMemo(() => {
    let sizeStyles = {};
    switch (props.size) {
      case Size.SMALL:
        sizeStyles = { width: '33%' };
        break;
      case Size.MEDIUM:
        sizeStyles = { width: '50%' };
        break;
      case Size.LARGE:
        sizeStyles = { width: '75%' };
        break;
      case Size.FULL:
        sizeStyles = { width: '100%' };
        break;
      default:
        sizeStyles = { width: '50%' };
        break;
    }

    const disabledStyles = {
      pointerEvents: props?.disabled ? 'none' : ('auto' as 'none' | 'auto'),
      opacity: props?.disabled ? 0.3 : 1,
    };

    const borderRadiusStyle = props.rounded ? { borderRadius: 50 } : {};

    return {
      ...sizeStyles,
      ...disabledStyles,
      ...borderRadiusStyle,
      backgroundColor: props.color ?? Colors.PRIMARY,
    };
  }, [props.size, props.rounded, props.disabled, props.color]);

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyles, props?.style]}
      disabled={props.disabled}
      onPress={props.onPress}
    >
      <If value={!!props?.icon}>{props?.icon}</If>
      <Text style={styles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.WHITE,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
