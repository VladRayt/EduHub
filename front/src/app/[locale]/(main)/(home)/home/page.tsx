'use client';

import React, { useMemo, useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { CreateOrganizationModal } from '@/components/blocks/CreateOrganizationModal';
import { OrganizationCard } from '@/components/blocks/OrganizationCard';
import { If } from '@/components/ui/if';
import { FullPageSpinner } from '@/components/ui/spinner';
import { Approvement, Organization, Permission, Sorting } from '@/@types/front';
import { PrimaryColor, getSortedArrayBySorting } from '@/lib/utils';
import { useCreateOrganization, useUserOrganizations } from '@/requests/organization';
import { useOrganizationStore } from '@/store/organization.store';
import { useUserStore } from '@/store/user.store';

import { HomeFiltersSidebar } from './HomeFiltersSidebar';

// Section Header Component
const SectionHeader = ({
  title,
  count,
  icon,
  gradient,
}: {
  title: string;
  count: number;
  icon: string;
  gradient: string;
}) => (
  <div className='flex items-center justify-between mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg'>
    <div className='flex items-center gap-3'>
      <div
        className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center text-white text-xl shadow-lg`}
      >
        {icon}
      </div>
      <div>
        <h4
          className={`text-xl font-bold bg-gradient-to-r ${gradient
            .replace('bg-', '')
            .replace('to-', 'to-')
            .split(' ')
            .map((c) => c.replace('bg-', 'from-'))
            .join(' ')} bg-clip-text text-transparent`}
        >
          {title}
        </h4>
        <p className='text-sm text-gray-600'>
          {count} organization{count !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
    <div className='w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full animate-pulse'></div>
  </div>
);

// Empty State Component
const EmptyState = ({ message }: { message: string }) => (
  <div className='w-full flex flex-col items-center justify-center py-20 px-8'>
    <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center max-w-md mx-auto'>
      <div className='w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner'>
        <span className='text-4xl'>📂</span>
      </div>
      <h3 className='text-xl font-semibold text-gray-700 mb-3'>No Organizations Found</h3>
      <p className='text-gray-500 leading-relaxed'>{message}</p>
      <div className='mt-6 flex justify-center gap-2'>
        <div className='w-2 h-2 bg-gray-300 rounded-full animate-pulse'></div>
        <div
          className='w-2 h-2 bg-gray-300 rounded-full animate-pulse'
          style={{ animationDelay: '0.2s' }}
        ></div>
        <div
          className='w-2 h-2 bg-gray-300 rounded-full animate-pulse'
          style={{ animationDelay: '0.4s' }}
        ></div>
      </div>
    </div>
  </div>
);

// Grid Container Component
const OrganizationGrid = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`w-full grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 ${className}`}>
    {children}
  </div>
);

// Enhanced Organization Card Wrapper
const OrganizationCardWrapper = ({
  children,
  href,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) => {
  const cardContent = (
    <div
      className='transform hover:scale-105 transition-all duration-300 hover:shadow-2xl cursor-pointer group'
      onClick={onClick}
    >
      <div className='absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl'></div>
      <div className='relative'>{children}</div>
    </div>
  );

  return href ? (
    <Link href={href} className='block'>
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
};

export default function Home() {
  const [createModalState, setCreateModalState] = useState<boolean>(false);
  const { isLoading } = useUserOrganizations();
  const searchParams = useSearchParams();

  const locale = useLocale();

  const filter = searchParams.get('filter') as Approvement & Permission;
  const sorting = (searchParams.get('sorting') as Sorting) ?? Sorting.A_Z;
  const search = searchParams.get('search');

  const userName = useUserStore((state) => state.user?.name);

  const t = useTranslations('main.home');

  const userOrganizations = useOrganizationStore((state) => state.userOrganizations);
  const adminOrganizations = useOrganizationStore((state) => state.adminOrganizations);
  const unapprovedOrganizations = useOrganizationStore((state) => state.unapprovedOrganizations);

  const setSelectedOrganization = useOrganizationStore((state) => state.setSelectedOrganization);

  const { createOrganization } = useCreateOrganization();

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
    switch (filter) {
      case Approvement.PENDING:
        return !unapprovedList.length;
      case Approvement.ACCEPTED:
        return !userList.length && !adminList.length;
      case Permission.READ:
        return !userList.length;
      case Permission.WRITE:
        return !adminList.length;
      default:
        return !adminList.length && !userList.length && !unapprovedList.length;
    }
  }, [adminList, userList, unapprovedList]);

  if (isLoading) return <FullPageSpinner />;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100'>
      <div className='flex gap-8 p-8'>
        {/* Sidebar */}
        <aside className='w-1/5 flex-shrink-0'>
          <div className='sticky top-8'>
            <HomeFiltersSidebar handleOpenModal={() => setCreateModalState(true)} />
          </div>
        </aside>

        {/* Main Content */}
        <main className='flex-1 space-y-8'>
          {/* Welcome Header */}
          <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2'>
                  Welcome back{userName ? `, ${userName}` : ''}! 👋
                </h1>
                <p className='text-gray-600'>
                  Manage your organizations and discover new opportunities
                </p>
              </div>
              <div className='hidden md:flex items-center gap-4'>
                <div className='text-right'>
                  <p className='text-sm text-gray-500'>Total Organizations</p>
                  <p className='text-2xl font-bold text-gray-800'>
                    {adminList.length + userList.length + unapprovedList.length}
                  </p>
                </div>
                <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg'>
                  🏢
                </div>
              </div>
            </div>
          </div>

          {/* Admin Organizations */}
          <If
            value={
              !!(
                adminList.length &&
                (!filter || filter === Permission.WRITE || filter === Approvement.ACCEPTED)
              )
            }
          >
            <section className='space-y-4'>
              <SectionHeader
                title={t('admin')}
                count={adminList.length}
                icon='👑'
                gradient='bg-gradient-to-r from-amber-500 to-orange-600'
              />
              <OrganizationGrid>
                {adminList.map((organization) => (
                  <OrganizationCardWrapper
                    key={organization.id}
                    href={`/${locale}/home/${organization.id}`}
                    onClick={() => setSelectedOrganization(organization)}
                  >
                    <OrganizationCard
                      title={organization.title}
                      authorName={organization.authorName}
                      color={organization.color as PrimaryColor}
                      membersLength={organization.members?.length ?? 0}
                      description={organization.description ?? ''}
                      onCardClick={() => setSelectedOrganization(organization)}
                    />
                  </OrganizationCardWrapper>
                ))}
              </OrganizationGrid>
            </section>
          </If>

          {/* User Organizations */}
          <If
            value={
              !!userList.length &&
              (!filter || filter === Permission.READ || filter === Approvement.ACCEPTED)
            }
          >
            <section className='space-y-4'>
              <SectionHeader
                title={t('user')}
                count={userList.length}
                icon='👤'
                gradient='bg-gradient-to-r from-blue-500 to-cyan-600'
              />
              <OrganizationGrid>
                {userList.map((organization) => (
                  <OrganizationCardWrapper
                    key={organization.id}
                    href={`${locale}/home/${organization.id}`}
                    onClick={() => setSelectedOrganization(organization)}
                  >
                    <OrganizationCard
                      title={organization.title}
                      authorName={organization.authorName}
                      color={organization.color as PrimaryColor}
                      membersLength={organization.members?.length ?? 0}
                      description={organization.description ?? ''}
                      onCardClick={() => setSelectedOrganization(organization)}
                    />
                  </OrganizationCardWrapper>
                ))}
              </OrganizationGrid>
            </section>
          </If>

          {/* Pending Organizations */}
          <If value={!!(unapprovedList.length && (!filter || filter === Approvement.PENDING))}>
            <section className='space-y-4'>
              <SectionHeader
                title={t('pending')}
                count={unapprovedList.length}
                icon='⏳'
                gradient='bg-gradient-to-r from-yellow-500 to-amber-600'
              />
              <OrganizationGrid>
                {unapprovedList.map((organization) => (
                  <OrganizationCardWrapper key={organization.id} onClick={() => {}}>
                    <OrganizationCard
                      title={organization.title}
                      authorName={organization.authorName}
                      color={organization.color as PrimaryColor}
                      membersLength={organization.members?.length ?? 0}
                      description={organization.description ?? ''}
                    />
                  </OrganizationCardWrapper>
                ))}
              </OrganizationGrid>
            </section>
          </If>

          {/* Empty State */}
          <If value={isEmptyState}>
            <EmptyState message={t('empty')} />
          </If>
        </main>
      </div>

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        open={createModalState}
        userName={userName ?? ''}
        handleConfirm={handleCreateOrganization}
        handleCancel={() => setCreateModalState(false)}
      />
    </div>
  );
}
