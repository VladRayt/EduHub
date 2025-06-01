import { StyleSheet, Text, View } from 'react-native';

import { IconButton } from '@components/IconButton';
import { t } from '@config/i18next';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

type HeaderProps = {
  navigate: () => void;
  userName?: string;
};

export const OrganizationsListHeader = ({
  userName = t('main.home.default-username'),
  navigate,
}: HeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.welcomeSection}>
        <Text style={[typographyStyles.large, styles.welcomeText]}>{t('main.home.welcome')}</Text>
        <Text style={[typographyStyles.xl2, styles.userNameText]} numberOfLines={1}>
          {userName}
        </Text>
      </View>

      <View style={styles.actionSection}>
        <IconButton
          iconName='bell'
          iconColor={Colors.BLACK}
          iconLib='Feather'
          onPress={navigate}
          // style={styles.notificationButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    minHeight: 60,
  },
  welcomeSection: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 6,
    paddingRight: 16,
  },
  welcomeText: {
    opacity: 0.8,
  },
  userNameText: {
    fontWeight: '600',
    color: Colors.BLACK,
    letterSpacing: -0.2,
  },
  actionSection: {
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    padding: 8,
    borderRadius: 12,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
