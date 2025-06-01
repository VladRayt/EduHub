'use client';

import { useRef, useState } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { If } from '@/components/ui/if';
import { useSignUp } from '@/requests/auth';
import { useAuthDataStore } from '@/store/auth.store';
import { useUserStore } from '@/store/user.store';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';

function SignIn() {
  const [step, setStep] = useState<1 | 2>(1);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const error = useUserStore((state) => state.error);
  const setError = useUserStore((state) => state.setError);

  const t = useTranslations('auth.sign-up');
  const locale = useLocale();

  const name = useAuthDataStore((state) => state.name);
  const email = useAuthDataStore((state) => state.email);

  const setName = useAuthDataStore((state) => state.setName);
  const setEmail = useAuthDataStore((state) => state.setEmail);
  const setPassword = useAuthDataStore((state) => state.setPassword);

  const router = useRouter();
  const { createUser } = useSignUp();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (step === 1) {
      setName(nameRef.current?.value ?? '');
      setEmail(emailRef.current?.value ?? '');
      const emailRegex = new RegExp(/^[A-Za-z0-9_!#$%&'*+/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/, 'gm');

      if (!emailRef.current?.value || !emailRegex.test(emailRef.current?.value)) {
        return setError('Email is invalid');
      }
      return setStep(2);
    }

    const password = passwordRef.current?.value;
    const passwordConfirm = passwordConfirmRef.current?.value;

    if (!password || password.length < 8) {
      return setError('Password is invalid');
    }

    if (passwordConfirm !== password) {
      return setError('Passwords are not the same');
    }
    setEmail(email ?? '');
    setPassword(password);
    await createUser({
      email: email ?? '',
      password,
      name: name ?? '',
    });

    if (error) return;

    return router.push(`/${locale}/verification-code`);
  };

  return (
    <div className='bg-white dark:bg-gray-700 py-8 px-6 shadow rounded-lg sm:px-10'>
      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h2>
        <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>{t('description')}</p>
      </div>
      <form className='mb-0 space-y-6'>
        <If value={step === 1}>
          <Input ref={nameRef} id='name' placeholder={t('name-pl')} />
          <Input ref={emailRef} id='email' placeholder='name@example.com' />
        </If>
        <If value={step === 2}>
          <Input ref={passwordRef} id='password' type='password' placeholder={t('password-pl')} />
          <Input
            ref={passwordConfirmRef}
            type='password'
            id='password_confirm'
            placeholder={t('confirm-pl')}
          />
        </If>
        <div>
          <If value={!!error}>
            <span className='text-sm text-red-700 dark:text-red-300 text-center'>{error}</span>
          </If>
          <Button className='w-full text-white' onClick={handleSignUp} variant={'destructive'}>
            {step === 1 ? t('button-one') : t('button-two')}
          </Button>
        </div>
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-300' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-white text-gray-500 dark:bg-gray-700'>{t('sub')}</span>
          </div>
        </div>
        <div>
          <Link href={`${locale}/sign-in`}>
            <Button variant={'link'} className='w-full border border-gray-300 shadow-sm'>
              {t('sign-in')}
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
