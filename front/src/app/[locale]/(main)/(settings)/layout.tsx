import { getTranslations } from 'next-intl/server';

import { SettingsSidebar } from './SettingsSidebar';

const sidebarNavItems = (t: (keys: string) => string) => [
  {
    title: t('profile'),
    href: '/settings/profile',
  },
  {
    title: t('organizations-list'),
    href: '/settings/organizations',
  },
  {
    title: t('tests-list'),
    href: '/settings/tests',
  },
  {
    title: t('about'),
    href: '/settings/about',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
  const t = await getTranslations('profile.list');
  return (
    <div className='px-8 flex flex-col w-full space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0'>
      <aside className='lg:min-w-1/5'>
        <SettingsSidebar items={sidebarNavItems(t)} />
      </aside>
      <div className='flex-1'>{children}</div>
    </div>
  );
}
