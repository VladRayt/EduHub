import { PropsWithChildren, useRef } from 'react';

import { useTranslations } from 'next-intl';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { If } from '../ui/if';
import { FullPageSpinner } from '../ui/spinner';

type Props = PropsWithChildren<{
  open: boolean;
  handleConfirm: (
    title: string,
    theme: string,
    description: string,
    count: number,
    additionalInformation: string
  ) => void | Promise<void>;
  handleCancel: () => void | Promise<void>;
  isLoading: boolean;
}>;
export const CreateTestModal = ({ open, handleConfirm, handleCancel, isLoading }: Props) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const themeRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const infoRef = useRef<HTMLTextAreaElement>(null);
  const countRef = useRef<HTMLInputElement>(null);

  const t = useTranslations('test-modal');

  const handleCreateTest = () => {
    const title = titleRef.current?.value;
    const theme = themeRef.current?.value;
    const description = descriptionRef.current?.value;
    const count = countRef.current?.value;
    const additionalInformation = infoRef.current?.value;

    if (!title || !theme || !description || !count || !+count) return;

    handleConfirm(title, theme, description, +count, additionalInformation ?? '');
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <If value={isLoading}>
          <FullPageSpinner />
        </If>
        <If value={!isLoading}>
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('title')}</AlertDialogTitle>
              <AlertDialogDescription>{t('description')}</AlertDialogDescription>
            </AlertDialogHeader>
            <label className='block space-y-2'>
              <p className='text-md font-medium'>{t('name')}</p>
              <Input placeholder={t('name-pl')} ref={titleRef} />
            </label>
            <label className='block space-y-2'>
              <p className='text-md font-medium'>{t('theme')}</p>
              <Input placeholder={t('theme-pl')} ref={themeRef} />
            </label>
            <label className='block space-y-2'>
              <p className='text-md font-medium'>{t('test-description')}</p>
              <Textarea placeholder={t('test-description-pl')} ref={descriptionRef} />
            </label>
            <label className='block space-y-2'>
              <p className='text-md font-medium'>{t('info')}</p>
              <Textarea placeholder={t('info-pl')} ref={infoRef} />
            </label>
            <label className='block space-y-2'>
              <p className='text-md font-medium'>{t('questions')}</p>
              <Input type='number' placeholder={t('questions-pl')} ref={countRef} />
            </label>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>{t('cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleCreateTest}>{t('accept')}</AlertDialogAction>
            </AlertDialogFooter>
          </>
        </If>
      </AlertDialogContent>
    </AlertDialog>
  );
};
