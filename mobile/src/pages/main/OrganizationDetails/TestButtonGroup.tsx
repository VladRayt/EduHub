import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Size } from '@components/Button';
import { IconButton } from '@components/IconButton';
import { If } from '@components/If';
import { t } from '@config/i18next';
import { Colors, PrimaryColor } from '@styles/colors';

type Props = {
  selectedTab: 'completed' | 'uncompleted';
  organizationColor: PrimaryColor | undefined;
  isAdmin: boolean;
  setSelectedTab: (value: 'completed' | 'uncompleted') => void;
  onSearchClick: () => void;
  onAddClick: () => void;
};

export const TestButtonGroup = (props: Props) => {
  const { selectedTab, organizationColor, isAdmin, setSelectedTab, onSearchClick, onAddClick } =
    props;

  const leftButtonStyle = [
    { borderTopLeftRadius: 50, borderBottomLeftRadius: 50 },
    {
      backgroundColor: selectedTab === 'uncompleted' ? organizationColor + '90' : organizationColor,
    },
  ];

  const rightButtonsStyle = [
    { borderTopRightRadius: 50, borderBottomRightRadius: 50 },
    {
      backgroundColor: selectedTab === 'completed' ? organizationColor + '90' : organizationColor,
    },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.leftIconContainer}>
        <IconButton
          iconLib='Feather'
          iconName='search'
          onPress={onSearchClick}
          iconColor={Colors.DARK_GRAY}
        />
      </View>
      <If value={!isAdmin}>
        <Button
          onPress={() => setSelectedTab('uncompleted')}
          title={t('main.organization-details.uncompleted')}
          size={Size.SMALL}
          style={leftButtonStyle}
        />
        <Button
          onPress={() => setSelectedTab('completed')}
          title={t('main.organization-details.completed')}
          size={Size.SMALL}
          style={rightButtonsStyle}
        />
      </If>
      <If value={isAdmin}>
        <Button
          title={t('main.organization-details.admin')}
          size={Size.MEDIUM}
          color={organizationColor}
          rounded
        />
      </If>
      <View style={styles.rightIconContainer}>
        <IconButton
          iconLib='Feather'
          iconName='plus'
          onPress={onAddClick}
          iconColor={Colors.DARK_GRAY}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 60 },
  leftIconContainer: { marginRight: 'auto' },
  rightIconContainer: { marginLeft: 'auto' },
});
