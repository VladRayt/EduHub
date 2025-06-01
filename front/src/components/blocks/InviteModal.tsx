import { PropsWithChildren, useState } from 'react';

import { useTranslations } from 'next-intl';

import { Permission } from '@/@types/front';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Props = PropsWithChildren<{
  open: boolean;
  organizationId: string;
  handleConfirm: (email: string, permission: Permission) => void | Promise<void>;
  handleCancel: () => void | Promise<void>;
}>;

const permissionValues = [
  { value: Permission.READ, name: 'User' },
  { value: Permission.WRITE, name: 'Admin' },
];

export const InviteModal = ({ open, handleConfirm, handleCancel }: Props) => {
  const [memberEmail, setMemberEmail] = useState<string>('');
  const [memberPermission, setMemberPermission] = useState<Permission | null>(null);

  const t = useTranslations('invite-modal');
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          placeholder='name@example.com'
          value={memberEmail}
          onChange={(e) => setMemberEmail(e.target.value)}
        />
        <Select onValueChange={(value) => setMemberPermission(value as Permission)}>
          <SelectTrigger>
            <SelectValue placeholder={t('permission-pl')} />
          </SelectTrigger>
          <SelectContent>
            {permissionValues.map(({ value, name }) => (
              <SelectItem key={value} value={value}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            disabled={!memberEmail.length || !memberPermission}
            onClick={() => handleConfirm(memberEmail, memberPermission!)}
          >
            {t('accept')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
