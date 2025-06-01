import React, { useTransition } from 'react';

import { useRouter } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = {
  locale: string;
  placeholder: string;
};

export const LanguageSwitcher = ({ locale, placeholder }: Props) => {
  const [isDisabled, startTransition] = useTransition();
  const router = useRouter();
  return (
    <Select
      onValueChange={(value) => {
        startTransition(() => {
          router.replace(`/${value}/settings/about`);
        });
      }}
      disabled={isDisabled}
      defaultValue={locale}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key={'en'} value={'en'}>
          🇬🇧 English
        </SelectItem>
        <SelectItem key={'ua'} value={'ua'}>
          🇺🇦 Українська
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
