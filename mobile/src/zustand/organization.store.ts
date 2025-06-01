import { create } from 'zustand';

import { Organization, OrganizationUser, Permission } from '../mobile-types/front-types';

const initialState = {
  selectedOrganization: null,
  userOrganizations: [],
  adminOrganizations: [],
  unapprovedOrganizations: [],
  members: [],
  error: null,
};

interface IOrganizationStore {
  selectedOrganization: Organization | null;
  userOrganizations: Organization[];
  adminOrganizations: Organization[];
  unapprovedOrganizations: Organization[];
  members: OrganizationUser[];
  error: string | null;
  setUserOrganizations: (userOrganizations: Organization[]) => void;
  setAdminOrganizations: (adminOrganizations: Organization[]) => void;
  setUnapprovedOrganizations: (unapprovedOrganizations: Organization[]) => void;
  setSelectedOrganization: (organization: Organization | null) => void;
  addOrganization: (
    organization: Organization,
    permission: Permission,
    isUnapproved: boolean
  ) => void;
  updateLocalOrganization: (
    organization: Organization,
    field: keyof Pick<
      IOrganizationStore,
      'adminOrganizations' | 'userOrganizations' | 'unapprovedOrganizations'
    >
  ) => void;
  setMembers: (members: OrganizationUser[]) => void;
  addMember: (member: OrganizationUser) => void;
  removeMember: (member: OrganizationUser) => void;
  deleteOrganizationTest: (testId: number) => void;
  setError: (error: string) => void;
  clear: () => void;
}

//load main page - set workspaces for permissions
//on select workspace -> load details -> set seletedWorkspace

export const useOrganizationStore = create<IOrganizationStore>((set, get) => ({
  ...initialState,
  setUserOrganizations: (userOrganizations) => set({ userOrganizations, error: null }),
  setAdminOrganizations: (adminOrganizations) => set({ adminOrganizations, error: null }),
  setUnapprovedOrganizations: (unapprovedOrganizations) =>
    set({ unapprovedOrganizations, error: null }),
  setSelectedOrganization: (organization) => {
    set({ selectedOrganization: organization, error: null });
  },
  addOrganization: (organization, permission, isUnapproved) => {
    if (isUnapproved) {
      return set({
        unapprovedOrganizations: [...get().unapprovedOrganizations, organization],
        error: null,
      });
    }
    if (permission === Permission.READ) {
      return set({
        adminOrganizations: [...get().adminOrganizations, organization],
        selectedOrganization: organization,
        error: null,
      });
    }
    return set({
      userOrganizations: [...get().userOrganizations, organization],
      selectedOrganization: organization,
      error: null,
    });
  },
  updateLocalOrganization: (organization, field) => {
    set({
      [field]: [
        ...get()[field].map((prevItem) =>
          prevItem.id === organization.id ? organization : prevItem
        ),
      ],
      selectedOrganization: organization,
      error: null,
    });
  },
  setMembers: (members) => set({ members }),
  addMember: (member) => {
    set({ members: [...get().members, member] });
  },
  removeMember: (member) => {
    const { adminOrganizations, members } = get();
    const updatedOrganizations = adminOrganizations.map((organization) => {
      if (organization.id === member.organizationId) {
        return {
          ...organization,
          members:
            organization && organization.members
              ? organization.members.filter((orgMember) => orgMember.userId !== member.userId)
              : [],
        };
      }
      return organization;
    });
    const updatedMembers = members.filter((orgMember) => orgMember.userId !== member.userId);

    set({ members: updatedMembers, adminOrganizations: updatedOrganizations });
  },
  deleteOrganizationTest: (testId) => {
    const { selectedOrganization } = get();
    if (!selectedOrganization) return;
    set({
      selectedOrganization: {
        ...selectedOrganization,
        tests: selectedOrganization.tests?.filter((test) => test.id !== testId),
      },
    });
  },
  setError: (error: string) => set({ error }),
  clear: () => set({ ...initialState, error: null }),
}));
