'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useParams } from 'next/navigation';

import { LanguageSwitcher } from '@/components/blocks/LanguageSwitcher';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { If } from '@/components/ui/if';
import { Separator } from '@/components/ui/separator';

export default function About() {
  const { locale = 'en' } = useParams();
  const { theme, setTheme, systemTheme } = useTheme();
  const t = useTranslations('profile.about');
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>{t('title')}</h3>
        <p className='text-sm text-muted-foreground'>{t('description')}</p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <h4 className='text-lg font-medium'>{t('subtitle')}</h4>
        </CardHeader>
        <CardContent className='space-y-8'>
          <label className='block space-y-2'>
            <h3 className='text-lg font-medium'>{t('welcome')} </h3>
            <span className='text-gray-700 dark:text-gray-100 '>{t('app-explore')}</span>
            <p className='text-gray-700 dark:text-gray-100  text-md'>{t('app-mission')}</p>
            <p className='text-gray-700 dark:text-gray-100  text-md'>{t('app-thanks')}</p>
          </label>
          <label className='block space-y-2'>
            <h3 className='text-lg font-medium'>{t('feature')}</h3>
            <ul className='list-disc list-inside text-md text-muted-foreground'>
              <li>{t('feature-1')}</li>
              <li>{t('feature-2')}</li>
              <li>{t('feature-3')}</li>
              <li>{t('feature-4')}</li>
              <li>{t('feature-5')}</li>
            </ul>
          </label>
          <label className='block space-y-2'>
            <h3 className='text-lg font-medium'>{t('appearance')}</h3>
            <div className='flex flex-row items-center justify-around'>
              <div
                onClick={() => setTheme('dark')}
                className={`space-y-2 cursor-pointer hover:opacity-80 p-6 rounded-lg ${theme === 'dark' && 'outline outline-offset-2 outline-2'}`}
              >
                <p className='text-gray-700 dark:text-gray-100 text-md'>{t('dark-theme')}</p>
                <div className='bg-gray-900 relative overflow-clip border-2 rounded-lg border-gray-700 h-40 w-64'>
                  <div className='absolute top-8 left-8 border-2 rounded-lg border-gray-700 h-40 w-64 flex flex-col'>
                    <div className='absolute top-8 left-8 flex flex-col gap-y-2 items-center w-full'>
                      <Separator className='h-1 bg-gray-700' />
                      <Separator className='h-1 bg-gray-700' />
                      <Separator className='h-1 bg-gray-700' />
                    </div>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setTheme('light')}
                className={`space-y-2 cursor-pointer hover:opacity-80 p-6 rounded-lg ${theme === 'light' && 'outline outline-offset-2 outline-2'}`}
              >
                <p className='text-gray-700 dark:text-gray-100 text-md'>{t('light-theme')}</p>
                <div className='bg-gray-100 relative overflow-clip border-2 rounded-lg border-gray-800 h-40 w-64'>
                  <div className='absolute top-8 left-8 border-2 rounded-lg border-gray-800 h-40 w-64 flex flex-col'>
                    <div className='absolute top-8 left-8 flex flex-col gap-y-2 items-center w-full'>
                      <Separator className='h-1 bg-gray-800' />
                      <Separator className='h-1 bg-gray-800' />
                      <Separator className='h-1 bg-gray-800' />
                    </div>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setTheme('system')}
                className={`space-y-2 cursor-pointer hover:opacity-80 p-6 rounded-lg ${theme === 'system' && 'outline outline-offset-2 outline-2'}`}
              >
                <If value={systemTheme === 'dark'}>
                  <p className='text-gray-700 dark:text-gray-100 text-md'>{t('system-theme')}</p>
                  <div className='bg-gray-900 relative overflow-clip border-2 rounded-lg border-gray-700 h-40 w-64'>
                    <div className='absolute top-8 left-8 border-2 rounded-lg border-gray-700 h-40 w-64 flex flex-col'>
                      <div className='absolute top-8 left-8 flex flex-col gap-y-2 items-center w-full'>
                        <Separator className='h-1 bg-gray-700' />
                        <Separator className='h-1 bg-gray-700' />
                        <Separator className='h-1 bg-gray-700' />
                      </div>
                    </div>
                  </div>
                </If>
                <If value={systemTheme === 'light'}>
                  <p className='text-gray-700 dark:text-gray-100 text-md'>{t('system-theme')}</p>
                  <div className='bg-gray-100 relative overflow-clip border-2 rounded-lg border-gray-800 h-40 w-64'>
                    <div className='absolute top-8 left-8 border-2 rounded-lg border-gray-800 h-40 w-64 flex flex-col'>
                      <div className='absolute top-8 left-8 flex flex-col gap-y-2 items-center w-full'>
                        <Separator className='h-1 bg-gray-800' />
                        <Separator className='h-1 bg-gray-800' />
                        <Separator className='h-1 bg-gray-800' />
                      </div>
                    </div>
                  </div>
                </If>
              </div>
            </div>
          </label>
          <label className='block space-y-2'>
            <h3 className='text-lg font-medium'>{t('language')}</h3>
            <div className='flex flex-row items-center justify-around'>
              <LanguageSwitcher
                placeholder={t('language-pl')}
                locale={Array.isArray(locale) ? locale[0] : locale}
              />
            </div>
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
