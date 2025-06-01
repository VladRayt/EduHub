'use client';

import { PropsWithChildren } from 'react';

import { FullPageSpinner } from '@/components/ui/spinner';
import { useUserDetails } from '@/requests/user';

import { HomeTopbar } from './HomeTopbar';

export default function HomeLayout(props: PropsWithChildren<{}>) {
  const { isLoading } = useUserDetails();

  if (isLoading) return <FullPageSpinner />;

  return (
    <div className='h-full flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900'>
      <header className='w-full flex justify-center'>
        <HomeTopbar />
      </header>
      <div className='flex flex-1 py-8'>{props.children}</div>
    </div>
  );
}
