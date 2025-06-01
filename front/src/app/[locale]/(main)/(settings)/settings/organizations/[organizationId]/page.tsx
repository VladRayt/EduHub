'use client';

import { useCallback, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';

import { InviteModal } from '@/components/blocks/InviteModal';
import { OrganizationCard } from '@/components/blocks/OrganizationCard';
import { RemoveModal } from '@/components/blocks/RemoveModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { FullPageSpinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Permission } from '@/@types/front';
import { PrimaryColor, cn, primaryColorToClassName } from '@/lib/utils';
import {
  useAddOrganizationMember,
  useOrganizationDetails,
  useOrganizationMemberList,
  useRemoveOrganization,
  useRemoveOrganizationMember,
  useUpdateOrganization,
} from '@/requests/organization';
import { useOrganizationStore } from '@/store/organization.store';
import { useUserStore } from '@/store/user.store';
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';

export default function OrganizationSettings() {
  const { organizationId, locale = 'en' } = useParams();
  const userId = useUserStore((state) => state.user?.id);
  const organization = useOrganizationStore((state) => state.selectedOrganization);
  const membersList = useOrganizationStore((state) => state.members);

  const router = useRouter();
  const t = useTranslations('profile.organization-details');

  const [userToRemove, setUserToRemove] = useState<string | null>(null);
  const [removeModalState, setRemoveModalState] = useState<boolean>(false);
  const [inviteModalState, setInviteModalState] = useState<boolean>(false);

  const [newColor, setNewColor] = useState<PrimaryColor | undefined>(
    organization?.color as PrimaryColor
  );

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useOrganizationDetails(Array.isArray(organizationId) ? organizationId[0] : organizationId);
  useOrganizationMemberList(Array.isArray(organizationId) ? organizationId[0] : organizationId);

  const { updateOrganization } = useUpdateOrganization();
  const { addUserToOrganization } = useAddOrganizationMember();

  const { removeOrganizationMember } = useRemoveOrganizationMember();
  const { deleteOrganization } = useRemoveOrganization();

  const handleSave = useCallback(async () => {
    if (!organization) return;
    const organizationDataForUpdate = {
      organizationId: organization.id,
      title: organization.title,
      color: organization.color,
      description: organization.description ?? '',
    };
    organizationDataForUpdate.title = titleRef.current?.value || organizationDataForUpdate.title;
    organizationDataForUpdate.description =
      descriptionRef.current?.value || organizationDataForUpdate.description;
    organizationDataForUpdate.color = newColor ?? organizationDataForUpdate.color;
    updateOrganization(organizationDataForUpdate);
  }, [organization, newColor]);
  const handleAddUserToRemove = (memberId: string) => {
    setUserToRemove(memberId);
    setRemoveModalState(true);
  };
  const handleCancel = () => {
    setUserToRemove(null);
    setRemoveModalState(false);
    setInviteModalState(false);
  };
  const handleAcceptInvite = async (email: string, permission: Permission) => {
    const existingUser = membersList.find((member) => member.user?.email === email);
    if (existingUser) return handleCancel();
    await addUserToOrganization({
      organizationId: Array.isArray(organizationId) ? organizationId[0] : organizationId,
      permission,
      email,
    });
    handleCancel();
  };
  const handleAcceptRemove = async () => {
    if (userToRemove) {
      const removedUser = membersList.find((member) => member.userId === userToRemove);
      if (removedUser) {
        await removeOrganizationMember(removedUser);
      }
      setUserToRemove(null);
      setRemoveModalState(false);
    } else {
      setRemoveModalState(false);
      await deleteOrganization(Array.isArray(organizationId) ? organizationId[0] : organizationId);
      router.push('/' + locale + '/settings/organizations');
    }
  };

  if (!organization) return <FullPageSpinner />;

  return (
    <>
      <div className='space-y-6'>
        <div>
          <h3 className='text-lg font-medium'>
            {t('title')}: {organization.title}
          </h3>
          <p className='text-sm text-muted-foreground'>{t('description')}:</p>
        </div>
        <Separator />
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <h4 className='text-lg font-medium'>{t('subtitle')}:</h4>
            <Button variant='destructive' onClick={() => setRemoveModalState(true)}>
              {t('button-delete')}:
            </Button>
          </CardHeader>
          <CardContent className='space-y-8'>
            <label className='block space-y-2'>
              <span className='text-gray-700'>{t('name')}:</span>
              <Input placeholder={t('name-pl')} defaultValue={organization?.title} ref={titleRef} />
              <p className='text-gray-600 text-sm'>{t('name-description')}</p>
            </label>
            <label className='block space-y-2'>
              <span className='text-gray-700'>{t('org-description')}</span>
              <Textarea
                placeholder={t('org-description-pl')}
                defaultValue={organization?.description ?? ''}
                ref={descriptionRef}
              />
              <p className='text-gray-600 text-sm'>{t('org-description-description')}</p>
            </label>
            <label className='block space-y-2'>
              <span className='text-gray-700'>{t('color')}</span>
              <div className='flex flex-row gap-x-16'>
                <div className='w-1/3 flex flex-row justify-between align-start'>
                  {Object.values(PrimaryColor).map((color) => (
                    <div
                      onClick={() => setNewColor(color)}
                      key={color}
                      className={cn(
                        'w-12 h-12 border-2 rounded-full cursor-pointer hover:opacity-80',
                        primaryColorToClassName(color, 'bg'),
                        (newColor ?? organization.color) === color
                          ? 'border-black'
                          : 'border-transparent'
                      )}
                    />
                  ))}
                </div>
                <OrganizationCard
                  title={organization.title}
                  description={organization.description ?? ''}
                  color={newColor ?? (organization.color as PrimaryColor)}
                  membersLength={organization.members?.length ?? 0}
                  authorName={organization.authorName}
                />
              </div>
              <p className='text-gray-600 text-sm'>{t('color-description')}</p>
            </label>
            <Button onClick={handleSave}>{t('button-update')}</Button>
            <label className='block space-y-2'>
              <div className='w-full flex flex-row items-center justify-between'>
                <span className='text-gray-700'>{t('members')}</span>
                <Button onClick={() => setInviteModalState(true)} className='w-8 h-8 p-0'>
                  <PlusIcon className='w-5 h-5' />
                </Button>
              </div>
              <div className='max-h-[500px] overflow-y-auto py-2 space-y-2'>
                {membersList.map((member) => (
                  <div
                    key={member.userId}
                    className='flex flex-row justify-between items-center bg-card px-2 shadow-md rounded-lg h-12'
                  >
                    <div className='flex flex-row items-center gap-x-2'>
                      <div className='h-8 w-8 rounded-full leading-8 text-center bg-green-200'>
                        {member.user?.name ? member.user.name[0] : 'U'}
                      </div>
                      <span className='text-sm font-medium'>{member.user?.name ?? ''}</span>
                      <span className='text-sm font-medium'>
                        {userId === member.userId
                          ? (`${member.user?.email} (${t('me')})` ?? '')
                          : (member.user?.email ?? '')}
                      </span>
                      <Badge variant='outline'>
                        {member.permission === Permission.READ ? 'User' : 'Admin'}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => handleAddUserToRemove(member.userId)}
                      className='w-8 h-8 p-0'
                      variant='ghost'
                      disabled={userId === member.userId}
                    >
                      <TrashIcon className='w-5 h-5' />
                    </Button>
                  </div>
                ))}
              </div>
              <p className='text-gray-600 text-sm'>{t('members-description')}</p>
            </label>
          </CardContent>
        </Card>
      </div>
      <RemoveModal
        open={removeModalState}
        handleCancel={handleCancel}
        handleConfirm={handleAcceptRemove}
      />
      <InviteModal
        organizationId={Array.isArray(organizationId) ? organizationId[0] : organizationId}
        open={inviteModalState}
        handleCancel={handleCancel}
        handleConfirm={handleAcceptInvite}
      />
    </>
  );
}
