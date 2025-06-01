import { useEffect } from 'react';

import { PrimaryColor } from '@/lib/utils';
import { Approvement, OrganizationUser, Permission, ResponseStatus } from '@/@types/front';
import { useOrganizationStore } from '@store/organization.store';
import { useUserStore } from '@store/user.store';
import { skipToken } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';

import { frontClient, getQueryClient } from './trpc/client';

const organizationListKey = getQueryKey(frontClient.organization.getOrganizationsList);
const organizationMembersKey = getQueryKey(frontClient.organization.getUsersFromOrganization);

export const useOrganizationDetails = (id: string) => {
  const { userId, setOrganizationUser } = useUserStore((state) => ({
    userId: state.user?.id,
    setOrganizationUser: state.setOrganizationUser,
  }));

  const { setSelectedOrganization, setError } = useOrganizationStore((state) => ({
    setSelectedOrganization: state.setSelectedOrganization,
    setError: state.setError,
  }));

  const { data, isFetching, isError, refetch, status } =
    frontClient.organization.getOrganizationsById.useQuery({
      id,
    });

  useEffect(() => {
    if (status === 'error') {
      setError('Something went wrong.');
    } else if (status === 'success') {
      if (data?.error) {
        setError(data?.error);
      } else if (data?.data) {
        const currentUser = data.data.members?.find((member) => member.userId === userId);
        if (!currentUser) {
          return setError('User do not have any permission');
        }
        setOrganizationUser(currentUser);
        setSelectedOrganization(data.data);
      }
    }
  }, [isFetching]);

  return { refetch, isLoading: isFetching, isError };
};

export const useUserOrganizations = () => {
  const userId = useUserStore((state) => state.user?.id);

  const { setUserOrganizations, setAdminOrganizations, setUnapprovedOrganizations, setError } =
    useOrganizationStore((state) => ({
      setUserOrganizations: state.setUserOrganizations,
      setAdminOrganizations: state.setAdminOrganizations,
      setUnapprovedOrganizations: state.setUnapprovedOrganizations,
      setError: state.setError,
    }));

  const { data, isFetching, isError, refetch, status } =
    frontClient.organization.getOrganizationsList.useQuery(
      userId
        ? {
            id: userId,
            page: 1,
            limit: 100,
          }
        : skipToken
    );

  useEffect(() => {
    if (status === 'error') {
      setError('Something went wrong.');
    } else if (status === 'success') {
      if (data?.error) {
        setError(data?.error);
      } else if (data?.data) {
        const userOrganization = data.data.filter((org) => {
          const currentUser = org.members?.find((member) => member.userId === userId);
          if (!currentUser) return false;
          return (
            currentUser.permission === Permission.READ &&
            currentUser.approvement === Approvement.ACCEPTED
          );
        });
        const adminOrganizations = data.data.filter((org) => {
          const currentUser = org.members?.find((member) => member.userId === userId);
          if (!currentUser) return false;
          return (
            currentUser?.permission === Permission.WRITE &&
            currentUser.approvement === Approvement.ACCEPTED
          );
        });
        const unapprovedOrganizations = data.data.filter((org) => {
          const currentUser = org.members?.find((member) => member.userId === userId);
          return currentUser && currentUser.approvement === Approvement.PENDING;
        });

        setAdminOrganizations(adminOrganizations),
          setUserOrganizations(userOrganization),
          setUnapprovedOrganizations(unapprovedOrganizations);
      }
    }
  }, [isFetching]);

  return { refetch, isLoading: isFetching, isError };
};

export const useCreateOrganization = () => {
  const queryClient = getQueryClient();
  const userId = useUserStore((state) => state.user?.id);
  const { adminOrganizations, setAdminOrganizations, setSelectedOrganization, setError } =
    useOrganizationStore((state) => state);

  const {
    mutateAsync: mutateOrganization,
    isError,
    isPending,
  } = frontClient.organization.createOrganization.useMutation();

  const createOrganization = async ({
    title,
    color,
    description,
  }: {
    title: string;
    color: PrimaryColor;
    description: string;
  }) => {
    try {
      if (!userId) return;
      const { data: organization, error } = await mutateOrganization({
        title,
        userId,
        color,
        description,
      });

      if (error || !organization) {
        setError(error ?? 'Error with organization creating.');
        return;
      }
      queryClient.invalidateQueries({ queryKey: organizationListKey });
      setSelectedOrganization(organization);
      setAdminOrganizations([...adminOrganizations, organization]);
      return organization.id;
    } catch (error: any) {
      setError(error?.message ?? error);
    }
  };
  return {
    createOrganization,
    isError,
    isLoading: isPending,
  };
};

export const useUpdateOrganization = () => {
  const queryClient = getQueryClient();
  const { updateLocalOrganization, setError } = useOrganizationStore((state) => ({
    updateLocalOrganization: state.updateLocalOrganization,
    setError: state.setError,
  }));

  const {
    mutateAsync: mutateOrganization,
    isError,
    isPending,
  } = frontClient.organization.updateOrganization.useMutation();

  const updateOrganization = async ({
    organizationId,
    title,
    color,
    description,
  }: {
    organizationId: string;
    title: string;
    color: string;
    description: string;
  }) => {
    try {
      const { data: organization, error } = await mutateOrganization({
        organizationId,
        organizationData: {
          title,
          color,
          description,
        },
      });

      if (error || !organization) {
        setError(error ?? 'Error with organization updating.');
        return;
      }
      queryClient.invalidateQueries({ queryKey: organizationListKey });
      updateLocalOrganization(organization, 'adminOrganizations');
    } catch (error: any) {
      setError(error?.message ?? error);
    }
  };
  return {
    updateOrganization,
    isError,
    isLoading: isPending,
  };
};

export const useRemoveOrganization = () => {
  const queryClient = getQueryClient();

  const { adminOrganizations, setSelectedOrganization, setAdminOrganizations, setError } =
    useOrganizationStore((state) => ({
      adminOrganizations: state.adminOrganizations,
      setSelectedOrganization: state.setSelectedOrganization,
      setAdminOrganizations: state.setAdminOrganizations,
      setError: state.setError,
    }));

  const {
    mutateAsync,
    isPending: isLoading,
    isError,
  } = frontClient.organization.deleteOrganization.useMutation();

  const deleteOrganization = async (id: string) => {
    try {
      const { status, error } = await mutateAsync({ id });
      if (status === ResponseStatus.FAILURE || error || !status) {
        throw new Error(error ?? 'Member is not removed');
      }
      queryClient.invalidateQueries({ queryKey: organizationListKey });
      setAdminOrganizations(adminOrganizations.filter((organization) => organization.id !== id));
      setSelectedOrganization(null);
    } catch (error: any) {
      setError(error?.message ?? error);
    }
  };

  return { deleteOrganization, isLoading, isError };
};

export const useOrganizationMemberList = (organizationId: string) => {
  const { setMembers, setError } = useOrganizationStore((state) => ({
    setMembers: state.setMembers,
    setError: state.setError,
  }));

  const { data, isFetching, isError, refetch, status } =
    frontClient.organization.getUsersFromOrganization.useQuery({
      id: organizationId,
      page: 1,
      limit: 100,
    });

  useEffect(() => {
    if (status === 'error') {
      setError('Something went wrong.');
    } else if (status === 'success') {
      if (data?.error) {
        setError(data.error);
      } else if (data?.data) {
        setMembers(data?.data);
      }
    }
  }, [isFetching]);

  return {
    refetch,
    isError,
    isLoading: isFetching,
  };
};

export const useAddOrganizationMember = () => {
  const queryClient = getQueryClient();

  const { updateLocalOrganization, addMember, setError } = useOrganizationStore((state) => ({
    updateLocalOrganization: state.updateLocalOrganization,
    addMember: state.addMember,
    setError: state.setError,
  }));

  const {
    mutateAsync: createUser,
    isError: isErrorCreating,
    isPending: isPendingCreating,
  } = frontClient.user.createUserWithEmail.useMutation();

  const {
    mutateAsync: addToOrganization,
    isError: isErrorAdding,
    isPending: isPendingAdding,
  } = frontClient.organization.addUserToOrganization.useMutation();

  const {
    mutateAsync: acceptToOrganization,
    isError: isErrorAccepting,
    isPending: isPendingAccepting,
  } = frontClient.organization.acceptUserToOrganization.useMutation();

  const addUserToOrganization = async ({
    organizationId,
    email,
    permission,
  }: {
    organizationId: string;
    email: string;
    permission: Permission;
  }) => {
    try {
      const { data: newUser, error: userError } = await createUser({
        email,
      });
      if (userError || !newUser) {
        setError(userError ?? 'Error with organization updating.');
        return;
      }

      const { data: updatedOrganization, error: organizationError } = await addToOrganization({
        userId: newUser.id,
        organizationId,
        permission,
      });
      if (organizationError || !updatedOrganization) {
        setError(organizationError ?? 'Error with organization updating.');
        return;
      }
      updateLocalOrganization(updatedOrganization, 'adminOrganizations');

      const { data: newOrganizationUser, error: organizationUserError } =
        await acceptToOrganization({
          userId: newUser.id,
          organizationId,
          approvement: Approvement.ACCEPTED,
        });
      if (!newOrganizationUser || organizationUserError) {
        setError(organizationUserError ?? 'Error with organization updating.');
        return;
      }
      queryClient.invalidateQueries({ queryKey: organizationMembersKey });
      addMember(newOrganizationUser as OrganizationUser);
    } catch (error: any) {
      setError(error?.message ?? error);
    }
  };
  return {
    addUserToOrganization,
    isError: isErrorAccepting || isErrorAdding || isErrorCreating,
    isLoading: isPendingAccepting || isPendingAdding || isPendingCreating,
  };
};

export const useRemoveOrganizationMember = () => {
  const queryClient = getQueryClient();
  const { removeMember, setError } = useOrganizationStore((state) => ({
    removeMember: state.removeMember,
    setError: state.setError,
  }));

  const {
    mutateAsync,
    isPending: isLoading,
    isError,
  } = frontClient.organization.removeUserFromOrganization.useMutation();

  const removeOrganizationMember = async (member: OrganizationUser) => {
    const { organizationId, userId, permission, approvement } = member;
    try {
      const { status, error } = await mutateAsync({ organizationId, userId });
      if (status === ResponseStatus.FAILURE || error || !status) {
        throw new Error(error ?? 'Member is not removed');
      }
      queryClient.invalidateQueries({ queryKey: organizationMembersKey });
      removeMember({
        organizationId,
        userId,
        permission,
        approvement,
      });
    } catch (error: any) {
      setError(error?.message ?? error);
    }
  };

  return { removeOrganizationMember, isLoading, isError };
};
