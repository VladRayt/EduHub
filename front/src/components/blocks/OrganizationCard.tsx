import React from 'react';

import { useTranslations } from 'next-intl';

import { PrimaryColor, primaryColorToClassName } from '@/lib/utils';
import { PersonIcon } from '@radix-ui/react-icons';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type Props = {
  title: string;
  color: PrimaryColor;
  membersLength: number;
  authorName: string;
  description?: string;
  onCardClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const OrganizationCard = (props: Props) => {
  const t = useTranslations('main.organization-details');
  return (
    <Card
      className={`${primaryColorToClassName(props.color, 'bg')} hover:opacity-80 cursor-pointer w-[320px] break-all h-[200px] text-white`}
      onClick={props.onCardClick}
    >
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <p className='text-xs text-gray-100'>
          {t('author')}: {props.authorName}
        </p>
      </CardHeader>
      <CardContent className='flex flex-col justify-around gap-y-2'>
        <CardTitle className='text-xl font-bold'>{props.title}</CardTitle>
        <div className=' text-lg font-medium flex flex-row items-center gap-x-2'>
          <PersonIcon className='w-6 h-6' />
          {props.membersLength} {t('members')}
        </div>
        <p className='text-sm text-gray-100 line-clamp-2'>{props.description}</p>
      </CardContent>
    </Card>
  );
};
