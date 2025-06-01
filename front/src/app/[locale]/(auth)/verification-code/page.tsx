'use client';

import { useRef } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';

import { If } from '@/components/ui/if';
import { useSignInWithCode } from '@/requests/auth';
import { useAuthDataStore } from '@/store/auth.store';
import { useUserStore } from '@/store/user.store';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';

export default function SignIn() {
  const userCodeRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const isForgotPassword = searchParams.get('forgot_password') ? true : false;

  const t = useTranslations('auth.verification-code');
  const locale = useLocale();

  const { signInWithCode } = useSignInWithCode();

  const email = useAuthDataStore((state) => state.email);
  const password = useAuthDataStore((state) => state.password);
  const setCode = useAuthDataStore((state) => state.setCode);

  const error = useUserStore((state) => state.error);
  const setError = useUserStore((state) => state.setError);

  if ((!email || !password) && !isForgotPassword) router.push(`${locale}/sign-in`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userCode = userCodeRef.current?.value;
    if (!userCode || !email) {
      return setError('User code is invalid');
    }
    if (!password && !isForgotPassword) {
      return setError('Password is invalid');
    }
    const isOneTimePassword = await signInWithCode({
      code: userCode,
      email,
      password: isForgotPassword ? '' : (password as string),
      isForgotPassword,
    });
    if (error) return;
    if (!isOneTimePassword && !isForgotPassword) {
      return router.push(`/${locale}/home`);
    }
    setCode(userCode);
    return router.push(`/${locale}/restore-password`);
  };

  return (
    <div className='bg-white dark:bg-gray-700 py-8 px-6 shadow rounded-lg sm:px-10'>
      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h2>
        <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>{t('description')}</p>
      </div>
      <form className='mb-0 space-y-6'>
        <Input ref={userCodeRef} id='verification_code' placeholder={t('code-pl')} />
        <div>
          <If value={!!error}>
            <span className='text-sm text-red-700 text-center'>{error}</span>
          </If>
          <Button variant={'destructive'} onClick={handleSubmit} className='w-full'>
            {t('button')}
          </Button>
        </div>
      </form>
    </div>
  );
}
