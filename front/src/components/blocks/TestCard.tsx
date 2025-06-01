import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type Props = {
  title: string;
  theme: string;
  description?: string;
  isSelected?: boolean;
  onCardClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const TestCard = (props: Props) => {
  return (
    <Card
      onClick={props.onCardClick}
      className={`${props.isSelected ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-600'} hover:opacity-80 cursor-pointer w-full break-all h-[120px] text-white`}
    >
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-xl font-bold text-gray-700 dark:text-gray-100'>
          {props.title}
        </CardTitle>
        <p className='text-md font-medium flex flex-row items-center gap-x-2 text-gray-700 dark:text-gray-100'>
          {props.theme}
        </p>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-gray-700 dark:text-gray-100 line-clamp-2'>{props.description}</p>
      </CardContent>
    </Card>
  );
};
