import { useCallback, useEffect } from 'react';

import { Approvement, OrganizationUser, Permission, ResponseStatus } from '../mobile-types/front-types';
import { useFocusEffect } from '@react-navigation/native';
import { queryClient, trpc } from '@requests/RequestContext';
import { PrimaryColor } from '@styles/colors';
import { skipToken } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { useOrganizationStore } from '@zustand/organization.store';
import { useUserStore } from '@zustand/user.store';

const organizationListKey = getQueryKey(trpc.organization.getOrganizationsList);
const organizationDetailsKey = getQueryKey(trpc.organization.getOrganizationsById);
const organizationMembersKey = getQueryKey(trpc.organization.getUsersFromOrganization);

export const useOrganizationDetails = (id: string) => {
  const userId = useUserStore((state) => state.user?.id);
  const setOrganizationUser = useUserStore((state) => state.setOrganizationUser);
  const setSelectedOrganization = useOrganizationStore((state) => state.setSelectedOrganization);
  const setError = useOrganizationStore((state) => state.setError);

  const { data, isFetching, isError, refetch, status } =
    trpc.organization.getOrganizationsById.useQuery(
      id
        ? {
          id,
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
  const setAdminOrganizations = useOrganizationStore((state) => state.setAdminOrganizations);
  const setUserOrganizations = useOrganizationStore((state) => state.setUserOrganizations);
  const setUnapprovedOrganizations = useOrganizationStore(
    (state) => state.setUnapprovedOrganizations
  );

  const setError = useOrganizationStore((state) => state.setError);
  const { data, isFetching, isError, refetch, status } =
    trpc.organization.getOrganizationsList.useQuery(
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

  useFocusEffect(
    useCallback(() => {
      userId && refetch();
    }, [userId])
  );

  return { refetch, isLoading: isFetching, isError };
};

export const useCreateOrganization = () => {
  const userId = useUserStore((state) => state.user?.id);
  const { adminOrganizations, setAdminOrganizations, setSelectedOrganization, setError } =
    useOrganizationStore((state) => state);

  const {
    mutateAsync: mutateOrganization,
    isError,
    isPending,
  } = trpc.organization.createOrganization.useMutation();

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
  const updateLocalOrganization = useOrganizationStore((state) => state.updateLocalOrganization);
  const setError = useOrganizationStore((state) => state.setError);

  const {
    mutateAsync: mutateOrganization,
    isError,
    isPending,
  } = trpc.organization.updateOrganization.useMutation();

  const updateOrganization = async ({
    organizationId,
    title,
    color,
    description,
  }: {
    organizationId: string;
    title: string;
    color: PrimaryColor;
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
  const adminOrganizations = useOrganizationStore((state) => state.adminOrganizations);
  const setSelectedOrganization = useOrganizationStore((state) => state.setSelectedOrganization);
  const setAdminOrganizations = useOrganizationStore((state) => state.setAdminOrganizations);
  const setError = useOrganizationStore((state) => state.setError);

  const {
    mutateAsync,
    isPending: isLoading,
    isError,
  } = trpc.organization.deleteOrganization.useMutation();

  const deleteOrganization = async (id: string) => {
    try {
      const { status, error } = await mutateAsync({ id });
      if (status === ResponseStatus.FAILURE || error || !status) {
        throw new Error(error ?? 'Member is not removed');
      }
      setAdminOrganizations(adminOrganizations.filter((organization) => organization.id !== id));
      setSelectedOrganization(null);
      queryClient.invalidateQueries({
        queryKey: organizationDetailsKey,
      });
      queryClient.invalidateQueries({
        queryKey: organizationListKey,
      });
      queryClient.invalidateQueries({
        queryKey: organizationDetailsKey,
      });
    } catch (error: any) {
      setError(error?.message ?? error);
    }
  };

  return { deleteOrganization, isLoading, isError };
};

export const useOrganizationMemberList = (organizationId: string) => {
  const setMembers = useOrganizationStore((state) => state.setMembers);
  const setError = useOrganizationStore((state) => state.setError);

  const { data, isFetching, isError, refetch, status } =
    trpc.organization.getUsersFromOrganization.useQuery(
      organizationId
        ? {
          id: organizationId,
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
        setError(data.error);
      } else if (data?.data) {
        setMembers(data?.data);
      }
    }
  }, [status]);

  return {
    refetch,
    isError,
    isLoading: isFetching,
  };
};

export const useAddOrganizationMember = () => {
  const addMember = useOrganizationStore((state) => state.addMember);
  const updateLocalOrganization = useOrganizationStore((state) => state.updateLocalOrganization);
  const setError = useOrganizationStore((state) => state.setError);

  const {
    mutateAsync: createUser,
    isError: isErrorCreating,
    isPending: isPendingCreating,
  } = trpc.user.createUserWithEmail.useMutation();

  const {
    mutateAsync: addToOrganization,
    isError: isErrorAdding,
    isPending: isPendingAdding,
  } = trpc.organization.addUserToOrganization.useMutation();

  const {
    mutateAsync: acceptToOrganization,
    isError: isErrorAccepting,
    isPending: isPendingAccepting,
  } = trpc.organization.acceptUserToOrganization.useMutation();

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
  const removeMember = useOrganizationStore((state) => state.removeMember);
  const setError = useOrganizationStore((state) => state.setError);

  const {
    mutateAsync,
    isPending: isLoading,
    isError,
  } = trpc.organization.removeUserFromOrganization.useMutation();

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
