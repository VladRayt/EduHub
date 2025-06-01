import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@components/Avatar';
import { IconButton } from '@components/IconButton';
import { t } from '@config/i18next';
import { OrganizationUser, Permission } from '../../../mobile-types/front-types';
import { Colors } from '@styles/colors';
import { typographyStyles } from '@styles/typography';

type Props = {
  memberList: OrganizationUser[];
  onRemoveMember: (memberId: string) => void | Promise<void>;
  onAddMember: () => void;
  userId: string;
};

export const MembersEdit = ({ memberList, onRemoveMember, onAddMember, userId }: Props) => {
  const renderItem = (item: OrganizationUser, index: number) => (
    <View style={styles.memberItem} key={`${item.userId}-${index}`}>
      <View style={styles.memberCardBlock}>
        <Avatar
          name={
            item.userId === userId
              ? item.user!.name + t('profile.organization-details.me')
              : item.user!.name
          }
          darkName
        />
        <View
          style={[
            {
              paddingHorizontal: 12,
              borderRadius: 8,
              backgroundColor:
                item.permission === Permission.WRITE ? Colors.GREEN + '30' : Colors.RED + '30',
            },
          ]}
        >
          <Text
            style={[
              typographyStyles.medium,
              { color: item.permission === Permission.WRITE ? Colors.GREEN : Colors.RED },
            ]}
          >
            {item.permission === Permission.WRITE
              ? t('profile.organization-details.admin')
              : t('profile.organization-details.user')}
          </Text>
        </View>
      </View>
      <View style={styles.memberCardBlock}>
        <Text style={typographyStyles.medium}>{item.user!.email}</Text>
        <IconButton
          disabled={item.userId === userId}
          iconLib='Feather'
          iconName='trash-2'
          iconColor={Colors.DARK_GRAY}
          onPress={() => onRemoveMember(item.userId)}
        />
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.settingNameStyle}>{t('profile.organization-details.members')}</Text>
        <IconButton
          iconLib='Feather'
          iconName='plus'
          iconColor={Colors.DARK_GRAY}
          onPress={onAddMember}
        />
      </View>
      <View style={styles.memberContainer}>{memberList.map(renderItem)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginTop: 8,
    marginBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  settingNameStyle: {
    flex: 1,
    ...typographyStyles.large,
    color: Colors.DARK_GRAY,
  },
  memberContainer: { paddingHorizontal: 4 },
  memberItem: {
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
    rowGap: 12,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  memberCardBlock: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
