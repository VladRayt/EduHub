'use client';

import { useRef } from 'react';

import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';

import { If } from '@/components/ui/if';
import { useUpdatePassword } from '@/requests/auth';
import { useAuthDataStore } from '@/store/auth.store';
import { useUserStore } from '@/store/user.store';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';

function RestorePassword() {
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const { locale = 'en' } = useParams();
  const router = useRouter();

  const t = useTranslations('auth.restore-password');

  const error = useUserStore((state) => state.error);
  const setError = useUserStore((state) => state.setError);

  const code = useAuthDataStore((state) => state.code);
  const email = useAuthDataStore((state) => state.email);
  const { resetPassword } = useUpdatePassword();

  if (!email || !code) router.push('/' + locale + '/sign-in');

  const handleSignUp = async (e) => {
    e.preventDefault();

    const password = passwordRef.current?.value;
    const passwordConfirm = passwordConfirmRef.current?.value;

    const emailExp = new RegExp(/^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, 'gm');

    if (!email || !emailExp.test(email)) {
      return setError('Email is invalid');
    }

    if (!password || password.length < 8) {
      return setError('Password is invalid');
    }

    if (passwordConfirm !== password) {
      return setError('Passwords are not the same');
    }

    if (!code) {
      return setError('Code is not valid');
    }

    await resetPassword({ email, password, code });
    if (error) return;

    return router.push('/' + locale + '/home');
  };

  return (
    <div className='bg-white dark:bg-gray-700 py-8 px-6 shadow rounded-lg sm:px-10'>
      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h2>
        <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'> {t('description')}</p>
      </div>
      <form className='mb-0 space-y-6'>
        <Input ref={passwordRef} id='password' placeholder={t('password-pl')} />
        <Input ref={passwordConfirmRef} id='password_confirm' placeholder={t('confirm-pl')} />
        <div>
          <If value={!!error}>
            <span className='text-sm text-red-700 dark:text-red-300 text-center'>{error}</span>
          </If>
          <Button className='w-full text-white' onClick={handleSignUp} variant={'destructive'}>
            {t('title')}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default RestorePassword;
