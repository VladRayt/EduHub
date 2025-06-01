'use client';

import { useRef } from 'react';

import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';

import { If } from '@/components/ui/if';
import { useRestorationCodeEmail } from '@/requests/auth';
import { useAuthDataStore } from '@/store/auth.store';
import { useUserStore } from '@/store/user.store';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';

function ForgotPassword() {
  const emailRef = useRef<HTMLInputElement>(null);
  const { locale = 'en' } = useParams();
  const error = useUserStore((state) => state.error);
  const setError = useUserStore((state) => state.setError);

  const t = useTranslations('auth.forgot-password');

  const setEmail = useAuthDataStore((state) => state.setEmail);

  const router = useRouter();
  const { sendCode } = useRestorationCodeEmail();

  const handleSendEmail = async (e) => {
    e.preventDefault();

    const email = emailRef.current?.value;

    const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, 'gm');

    if (!email || !emailRegex.test(email)) {
      return setError('Email is invalid');
    }
    setEmail(email);
    await sendCode({ email });
    if (error) return;

    return router.push('/' + locale + '/verification-code?forgot_password=true');
  };

  return (
    <div className='bg-white dark:bg-gray-700 py-8 px-6 shadow rounded-lg sm:px-10'>
      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h2>
        <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>{t('description')}</p>
      </div>
      <form className='mb-0 space-y-6'>
        <Input ref={emailRef} id='email' placeholder='name@example.com' />
        <div>
          <If value={!!error}>
            <span className='text-sm text-red-700 dark:text-red-300 text-center'>{error}</span>
          </If>
          <Button className='w-full text-white' onClick={handleSendEmail} variant={'destructive'}>
            {t('button')}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
