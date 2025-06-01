import React, { useCallback, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { DeleteModal } from '@blocks/DeleteModal';
import { IconButton } from '@components/IconButton';
import { useMainProfileNavigation } from '@hooks/useTypedNavigation';
import { Organization, Permission } from '../../../mobile-types/front-types';
import {
  BottomTabsRoutes,
  MainNavigation,
  ProfileNavigation,
  ProfileRouteProps,
} from '../../../mobile-types/navigation.type';
import { StackActions } from '@react-navigation/native';
import {
  useAddOrganizationMember,
  useOrganizationDetails,
  useOrganizationMemberList,
  useRemoveOrganization,
  useRemoveOrganizationMember,
  useUpdateOrganization,
} from '@requests/organization';
import { Colors, PrimaryColor } from '@styles/colors';
import { typographyStyles } from '@styles/typography';
import { useOrganizationStore } from '@zustand/organization.store';
import { useUserStore } from '@zustand/user.store';

import { ColorEdit } from './ColorEdit';
import { DescriptionEdit } from './DescriptionEdit';
import { InviteModal } from './InviteModal';
import { MembersEdit } from './MembersEdit';
import { TitleEdit } from './TitleEdit';

type Props = ProfileRouteProps<ProfileNavigation.ORGANIZATION>;

export const OrganizationSettings = ({ route, navigation }: Props) => {
  const { organizationId, userToDelete } = route.params;
  const { setParams, setOptions, dispatch } = navigation;
  const { navigate } = useMainProfileNavigation();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showMemberDelete, setShowMemberDelete] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const userId = useUserStore((state) => state.user?.id);
  const members = useOrganizationStore((state) => state.members);

  const organization = useOrganizationStore((state) => state.selectedOrganization);
  const { updateOrganization } = useUpdateOrganization();
  const { removeOrganizationMember } = useRemoveOrganizationMember();
  const { deleteOrganization, isError: isDeleteError } = useRemoveOrganization();
  const { addUserToOrganization } = useAddOrganizationMember();

  useOrganizationDetails(organizationId);
  useOrganizationMemberList(organizationId);

  useLayoutEffect(() => {
    setOptions({
      headerRight: () => (
        <IconButton
          iconLib='Feather'
          iconName='trash-2'
          iconColor={Colors.DARK_GRAY}
          onPress={() => {
            setShowDeleteConfirmation(true);
          }}
        />
      ),
    });
  }, []);

  const handleSave = useCallback(
    (key: keyof Omit<Organization, 'members' | 'tests'>) => async (value: string) => {
      if (!organization) return;
      const organizationDataForUpdate = {
        organizationId: organization.id,
        title: organization.title,
        color: organization.color as PrimaryColor,
        description: organization.description ?? '',
      };
      organization[key] = value;
      updateOrganization({
        ...organizationDataForUpdate,
        [key]: value,
      });
    },
    [organization]
  );

  const addUserForRemoving = (userToDelete: string) => {
    setShowMemberDelete(true);
    setParams({ userToDelete });
  };

  const handleCancel = () => {
    setShowMemberDelete(false);
    setShowDeleteConfirmation(false);
  };

  const handleRemoveUser = () => {
    if (!userToDelete) return;
    const currentUser = members.find((member) => member.userId === userToDelete);
    if (!currentUser) return;
    removeOrganizationMember(currentUser);
    handleCancel();
  };

  const handleRemoveOrganization = async () => {
    await deleteOrganization(organizationId);
    if (!isDeleteError) {
      handleCancel();
    }
  };

  const handleAddUser = (email: string) => {
    addUserToOrganization({
      email,
      organizationId,
      permission: Permission.READ,
    });
  };

  if (!organization) {
    dispatch(StackActions.popToTop());
    navigate(BottomTabsRoutes.WORKSPACES, {
      screen: MainNavigation.MAIN_LIST,
    });
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <TitleEdit title={organization.title} onSave={handleSave('title')} />
      <DescriptionEdit
        description={organization.description ?? ''}
        onSave={handleSave('description')}
      />
      <ColorEdit
        title={organization.title}
        description={organization.description ?? ''}
        initialColor={organization.color as PrimaryColor}
        onSave={handleSave('color')}
      />
      <MembersEdit
        memberList={members}
        onRemoveMember={addUserForRemoving}
        userId={userId ?? ''}
        onAddMember={() => setShowAddMember(true)}
      />
      <DeleteModal
        visible={showDeleteConfirmation || showMemberDelete}
        handleClose={handleCancel}
        handleAccept={showMemberDelete ? handleRemoveUser : handleRemoveOrganization}
      />
      <InviteModal
        visible={showAddMember}
        handleClose={() => setShowAddMember(false)}
        handleAccept={handleAddUser}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    rowGap: 24,
    height: '100%',
    paddingHorizontal: '7.5%',
    width: '100%',
  },
  bottomContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    marginBottom: 24,
    alignItems: 'center',
    rowGap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    ...typographyStyles.medium,
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  itemContainer: {
    borderRadius: 12,
    height: 180,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  itemTextWrapper: {
    flex: 1,
    rowGap: 12,
  },
  itemTitle: {
    ...typographyStyles.xl2,
    color: Colors.LIGHT_GRAY,
  },
  itemDescription: {
    ...typographyStyles.medium,
    color: Colors.LIGHT_GRAY,
  },
});
