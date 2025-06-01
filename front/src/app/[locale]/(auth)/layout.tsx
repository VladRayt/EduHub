import React, { PropsWithChildren } from 'react';

import { getTranslations } from 'next-intl/server';

export default async function AuthLayout(props: PropsWithChildren<{}>) {
  const t = await getTranslations();
  return (
    <div className='flex h-screen bg-gray-100 dark:bg-gray-900'>
      <div className='w-1/2 bg-black p-12 text-white flex flex-col justify-around'>
        <div>
          <h1 className='mt-12 text-4xl font-bold'>{t('auth.auth-text')}</h1>
        </div>
        <div>
          <blockquote className='italic'>{t('auth.auth-description')}</blockquote>
          <p className='mt-4'>{t('auth.auth-author')}</p>
        </div>
      </div>
      <div className='w-1/2 flex items-center justify-center p-12'>
        <div className='w-full max-w-md h-[448px]'>{props.children}</div>
      </div>
    </div>
  );
}
