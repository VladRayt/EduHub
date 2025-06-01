'use client';

import { ChangeEvent, useMemo, useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import { CreateOrganizationModal } from '@/components/blocks/CreateOrganizationModal';
import { OrganizationCard } from '@/components/blocks/OrganizationCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { If } from '@/components/ui/if';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Approvement, Organization, Permission, Sorting } from '@/@types/front';
import { useWritableSearchParams } from '@/hooks/useWritableSearchParams';
import { PrimaryColor, getSortedArrayBySorting } from '@/lib/utils';
import { useCreateOrganization, useUserOrganizations } from '@/requests/organization';
import { useOrganizationStore } from '@/store/organization.store';
import { useUserStore } from '@/store/user.store';

const filterValues = (t: (keys: string) => string) => [
  { value: Permission.WRITE, name: t('filter.WRITE') },
  { value: Permission.READ, name: t('filter.READ') },
  { value: Approvement.ACCEPTED, name: t('filter.ACCEPTED') },
  { value: Approvement.PENDING, name: t('filter.PENDING') },
];

const sortingValues = (t: (keys: string) => string) => [
  { value: Sorting.A_Z, name: t('sorting.A_Z') },
  { value: Sorting.Z_A, name: t('sorting.Z_A') },
  { value: Sorting.ZERO_NINE, name: t('sorting.ZERO_NINE') },
  { value: Sorting.NINE_ZERO, name: t('sorting.NINE_ZERO') },
];

export default function Organizations() {
  const searchParamsSettings = useWritableSearchParams();
  const locale = useLocale();
  const [createModalState, setCreateModalState] = useState<boolean>(false);

  const filter = searchParamsSettings.searchParams.get('filter') as Approvement & Permission;
  const sorting = (searchParamsSettings.searchParams.get('sorting') as Sorting) ?? Sorting.A_Z;
  const search = searchParamsSettings.searchParams.get('search');

  const userName = useUserStore((state) => state.user?.name);

  const adminOrganizations = useOrganizationStore((state) => state.adminOrganizations);
  const userOrganizations = useOrganizationStore((state) => state.userOrganizations);
  const unapprovedOrganizations = useOrganizationStore((state) => state.unapprovedOrganizations);
  const setSelectedOrganization = useOrganizationStore((state) => state.setSelectedOrganization);

  const t = useTranslations();

  useUserOrganizations();
  const { createOrganization } = useCreateOrganization();

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    searchParamsSettings.set('search', e.target.value);
  };

  const handleChangeFilter = (value: string) => {
    searchParamsSettings.set('filter', value);
  };

  const handleChangeSorting = (value: string) => {
    searchParamsSettings.set('sorting', value);
  };

  const handleCreateOrganization = async (
    title: string,
    color: PrimaryColor,
    description: string
  ) => {
    await createOrganization({
      title,
      color,
      description,
    });
    setCreateModalState(false);
  };

  const { adminList, userList, unapprovedList } = useMemo(() => {
    const adminList: Organization[] = getSortedArrayBySorting(
      sorting,
      adminOrganizations,
      'title',
      'members',
      true
    ).filter((org) => (search ? org.title.toLowerCase().includes(search.toLowerCase()) : org));
    let userList: Organization[] = [];
    let unapprovedList: Organization[] = [];

    if (filter !== Permission.WRITE) {
      userList = getSortedArrayBySorting(
        sorting,
        userOrganizations,
        'title',
        'members',
        true
      ).filter((org) => (search ? org.title.toLowerCase() === search.toLowerCase() : org));
      unapprovedList = getSortedArrayBySorting(
        sorting,
        unapprovedOrganizations,
        'title',
        'members',
        true
      ).filter((org) => (search ? org.title.toLowerCase() === search.toLowerCase() : org));
    }
    return { adminList, userList, unapprovedList };
  }, [
    adminOrganizations.length,
    userOrganizations.length,
    unapprovedOrganizations.length,
    filter,
    sorting,
    search,
  ]);

  const isEmptyState = useMemo(() => {
    return (
      unapprovedList.length === 0 &&
      filter !== Approvement.ACCEPTED &&
      userList.length === 0 &&
      (filter !== Permission.WRITE || filter === Approvement.ACCEPTED) &&
      adminList.length === 0 &&
      (!filter || filter !== Permission.READ || filter === Approvement.ACCEPTED)
    );
  }, [adminList, userList, unapprovedList]);

  return (
    <>
      <div className='space-y-6'>
        <div>
          <h3 className='text-lg font-medium'>{t('profile.organizations-list.title')}</h3>
          <p className='text-sm text-muted-foreground'>
            {t('profile.organizations-list.description')}
          </p>
        </div>
        <Separator />
        <Card>
          <CardHeader>
            <div className='flex flex-row items-center justify-between'>
              <h4 className='text-lg font-medium'>{t('profile.organizations-list.subtitle')}</h4>
              <Button onClick={() => setCreateModalState(true)}>
                {t('profile.organizations-list.button-create')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-8'>
            <label className='block space-y-2'>
              <span className='text-gray-700'>{t('profile.organizations-list.filters')}</span>
              <div className='flex flex-row gap-x-12'>
                <Input
                  placeholder={t('profile.organizations-list.search-pl')}
                  onChange={handleChangeSearch}
                  defaultValue={search ?? ''}
                />
                <Select onValueChange={handleChangeFilter} defaultValue={filter ?? undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('profile.organizations-list.filter-pl')} />
                  </SelectTrigger>
                  <SelectContent>
                    {filterValues(t).map(({ value, name }) => (
                      <SelectItem key={value} value={value}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={handleChangeSorting} defaultValue={sorting}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('profile.organizations-list.sorting-pl')} />
                  </SelectTrigger>
                  <SelectContent>
                    {sortingValues(t).map(({ value, name }) => (
                      <SelectItem key={value} value={value}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className='text-gray-600 text-sm'>
                {t('profile.organizations-list.filters-description')}
              </p>
            </label>
            <div className='space-y-8'>
              <label className='block space-y-2'>
                <If
                  value={
                    !!(
                      adminList.length &&
                      (!filter || filter !== Permission.READ) &&
                      filter !== Approvement.PENDING
                    )
                  }
                >
                  <h4 className='text-lg font-medium'>{t('profile.organizations-list.admin')}</h4>
                  <div className='w-full grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 justify-items-center gap-8'>
                    {adminList.map((organization) => (
                      <Link
                        key={organization.id}
                        href={`/${locale}/settings/organizations/${organization.id}`}
                      >
                        <OrganizationCard
                          title={organization.title}
                          authorName={organization.authorName}
                          color={organization.color as PrimaryColor}
                          membersLength={organization.members?.length ?? 0}
                          description={organization.description ?? ''}
                          onCardClick={() => setSelectedOrganization(organization)}
                        />
                      </Link>
                    ))}
                  </div>
                </If>
                <If
                  value={
                    !!userList.length &&
                    (!filter || filter !== Permission.WRITE) &&
                    filter !== Approvement.PENDING
                  }
                >
                  <h4 className='text-lg font-medium'>{t('profile.organizations-list.user')}</h4>
                  <div className='w-full grid auto-cols-auto gap-4'>
                    {userList.map((organization) => (
                      <OrganizationCard
                        key={organization.id}
                        title={organization.title}
                        authorName={organization.authorName}
                        color={organization.color as PrimaryColor}
                        membersLength={organization.members?.length ?? 0}
                        description={organization.description ?? ''}
                      />
                    ))}
                  </div>
                </If>
                <If
                  value={!!(unapprovedList.length && (!filter || filter !== Approvement.ACCEPTED))}
                >
                  <h4 className='text-lg font-medium'>{t('profile.organizations-list.pending')}</h4>
                  <div className='w-full grid auto-cols-auto gap-4'>
                    {unapprovedList.map((organization) => (
                      <OrganizationCard
                        key={organization.id}
                        title={organization.title}
                        authorName={organization.authorName}
                        color={organization.color as PrimaryColor}
                        membersLength={organization.members?.length ?? 0}
                        description={organization.description ?? ''}
                      />
                    ))}
                  </div>
                </If>
                <If value={isEmptyState}>
                  <div className='w-full flex flex-col items-center justify-center'>
                    {t('profile.organizations-list.empty')}
                  </div>
                </If>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
      <CreateOrganizationModal
        open={createModalState}
        handleConfirm={handleCreateOrganization}
        userName={userName ?? ''}
        handleCancel={() => setCreateModalState(false)}
      />
    </>
  );
}
