import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  containerStyles: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: '10%',
    rowGap: 40,
  },
  textStyles: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 40,
    width: '75%',
    flexBasis: 200,
  },
  inputsContainerStyles: {
    flexShrink: 1,
    width: '75%',
    rowGap: 16,
  },
  buttonContainerStyles: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorStyles: {
    fontSize: 16,
    fontWeight: '500',
    color: 'red',
  },
});
