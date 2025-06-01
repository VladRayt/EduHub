import React, {
  ForwardedRef,
  PropsWithChildren,
  forwardRef,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  Animated,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { If } from '@components/If';

interface AnimatedInputProps extends TextInputProps {
  placeholder: string;
  containerStyles?: StyleProp<ViewStyle>;
  inputStyles?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

type Props = PropsWithChildren<AnimatedInputProps>;

export const AnimatedInput = forwardRef(
  ({ placeholder, icon, ...props }: Props, ref: ForwardedRef<TextInput>) => {
    const labelPosition = useRef(new Animated.Value(!props.value ? 0 : 1)).current;

    const handleFocus = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        Animated.timing(labelPosition, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }).start();
        if (props.onFocus) {
          props.onFocus(e);
        }
      },
      [props.onFocus, labelPosition]
    );

    const handleBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        Animated.timing(labelPosition, {
          toValue: props.value ? 1 : 0,
          duration: 100,
          useNativeDriver: true,
        }).start();
        if (props.onBlur) {
          props.onBlur(e);
        }
      },
      [props.onBlur, labelPosition, ref, props.value]
    );

    const translateY = useMemo(
      () =>
        labelPosition.interpolate({
          inputRange: [0, 1],
          outputRange: [16, -10],
        }),
      [labelPosition]
    );

    return (
      <View style={[styles.container, props.containerStyles]}>
        <View style={styles.iconContainer}>
          <If value={!!icon}>{icon}</If>
        </View>
        <Animated.Text style={[styles.label, { transform: [{ translateY }] }]}>
          {placeholder}
        </Animated.Text>
        <TextInput
          ref={ref}
          style={[styles.input, props.inputStyles]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: '100%',
    position: 'relative',
    // borderWidth: 1,
    // borderColor: '#ccc',
  },
  iconContainer: {
    position: 'absolute',
    right: 0,
    top: 14,
    zIndex: 1,
  },
  label: {
    position: 'absolute',
    left: 10,
    fontSize: 16,
    color: '#888',
    zIndex: 0,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingRight: 30,
    fontSize: 16,
    zIndex: 0,
  },
});
