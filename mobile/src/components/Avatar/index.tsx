import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

type Props = {
  name: string;
  darkName?: boolean;
};

export const Avatar = ({ name = 'Guest', darkName }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{name[0].toUpperCase()}</Text>
      </View>
      <Text style={darkName ? styles.darkAvatarName : styles.avatarName}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    columnGap: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    backgroundColor: Colors.SECONDARY,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  avatarText: {
    color: Colors.LIGHT_GRAY,
    fontSize: 20,
  },
  avatarName: {
    color: Colors.LIGHT_GRAY,
    ...typographyStyles.medium,
  },
  darkAvatarName: {
    color: Colors.DARK_GRAY,
    ...typographyStyles.medium,
  },
});
