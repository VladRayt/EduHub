import { PropsWithChildren, useCallback, useState } from 'react';

import { useTranslations } from 'next-intl';

import { PrimaryColor, cn, primaryColorToClassName } from '@/lib/utils';

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
import { OrganizationCard } from './OrganizationCard';

type Props = PropsWithChildren<{
  open: boolean;
  userName: string;
  handleConfirm: (
    title: string,
    organizationColor: PrimaryColor,
    description: string
  ) => void | Promise<void>;
  handleCancel: () => void | Promise<void>;
}>;
export const CreateOrganizationModal = ({ open, userName, handleConfirm, handleCancel }: Props) => {
  const [title, setTitle] = useState<string>('Organization title');
  const [description, setDescription] = useState<string>('Organization description');
  const [organizationColor, setOrganizationColor] = useState<PrimaryColor>(PrimaryColor.CrimsonRed);

  const t = useTranslations('organization-modal');

  const handleCreateTest = () => {
    if (!title || !organizationColor || !description) return;
    handleConfirm(title, organizationColor, description);
  };

  const handleChangeValue = useCallback(
    (value: 'title' | 'description') =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (value === 'title') {
          return setTitle(e.target.value);
        }
        return setDescription(e.target.value);
      },
    []
  );

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <label className='block space-y-2'>
          <p className='text-md font-medium'>{t('name')}</p>
          <Input placeholder={t('name-pl')} value={title} onChange={handleChangeValue('title')} />
        </label>
        <label className='block space-y-2'>
          <p className='text-md font-medium'>{t('org-description')}</p>
          <Textarea
            placeholder={t('org-description-pl')}
            value={description}
            onChange={handleChangeValue('description')}
          />
        </label>
        <label className='block space-y-2'>
          <span className='text-gray-700'>{t('color')}</span>
          <div className='flex flex-row justify-between items-center'>
            <div className='grid grid-cols-2 align-center gap-6'>
              {Object.values(PrimaryColor).map((color) => (
                <div
                  onClick={() => setOrganizationColor(color)}
                  key={color}
                  className={cn(
                    'w-12 h-12 border-2 rounded-full cursor-pointer hover:opacity-80',
                    primaryColorToClassName(color, 'bg'),
                    organizationColor === color
                      ? 'border-black dark:border-white'
                      : 'border-transparent'
                  )}
                />
              ))}
            </div>
            <OrganizationCard
              title={title}
              description={description}
              color={organizationColor}
              membersLength={1}
              authorName={userName}
            />
          </div>
        </label>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleCreateTest}>{t('accept')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
