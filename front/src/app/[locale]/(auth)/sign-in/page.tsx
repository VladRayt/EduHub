'use client';

import { useRef } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { If } from '@/components/ui/if';
import { useRestorationCodeEmail, useSignIn } from '@/requests/auth';
import { useAuthDataStore, useAuthStore } from '@/store/auth.store';
import { useUserStore } from '@/store/user.store';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';

export default function SignIn() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { locale = 'en' } = useParams();

  const { signIn } = useSignIn();
  const { sendCode } = useRestorationCodeEmail();

  const t = useTranslations('auth.sign-in');

  const error = useUserStore((state) => state.error);
  const setError = useUserStore((state) => state.setError);
  const refreshToken = useAuthStore((state) => state.accessToken);
  const setEmail = useAuthDataStore((state) => state.setEmail);
  const setPassword = useAuthDataStore((state) => state.setPassword);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    const emailExp = new RegExp(/^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, 'gm');

    if (!email || !emailExp.test(email)) {
      return setError('Email is invalid');
    }

    if (!password || password.length < 8) {
      return setError('Password is invalid');
    }

    // if (refreshToken) {
    await signIn({
      email,
      password,
    });
    router.push('/' + locale + '/home');
    // }

    // await sendCode({ email });

    // if (error) return;
    // setEmail(email);
    // setPassword(password);
    // return router.push('/' + locale + '/verification-code');
  };

  return (
    <div className='bg-white dark:bg-gray-700 py-8 px-6 shadow rounded-lg sm:px-10'>
      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h2>
        <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>{t('description')}</p>
      </div>
      <form className='mb-0 space-y-6'>
        <Input id='email' placeholder='name@example.com' ref={emailRef} />
        <Input id='password' type='password' placeholder={t('password-pl')} ref={passwordRef} />
        <div>
          <If value={!!error}>
            <span className='text-sm text-red-700 dark:text-red-300 text-center'>{error}</span>
          </If>
          <Button onClick={handleSignIn} className='w-full' variant={'destructive'}>
            {t('button')}
          </Button>
        </div>
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-300' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-white dark:bg-gray-700 text-gray-500'>{t('sub')}</span>
          </div>
        </div>
        <div>
          <Link href={'/' + locale + '/sign-up'}>
            <Button variant={'link'} className='w-full border border-gray-300 shadow-sm'>
              {t('sign-up')}
            </Button>
          </Link>
        </div>
      </form>
      <Link href={'/' + locale + '/forgot-password'} className='mt-6 text-xs text-gray-500'>
        {t('forgot-password')}
      </Link>
    </div>
  );
}
