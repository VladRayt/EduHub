import React from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { If } from '@/components/ui/if';
import { Separator } from '@/components/ui/separator';
import { FullPageSpinner } from '@/components/ui/spinner';
import { useTestStore } from '@/store/test.store';

type Props = {
  testId: number;
  isCompleted: boolean;
  locale: string;
  userId?: string;
};

export const SelectedTestPreview = ({ testId, isCompleted, userId, locale }: Props) => {
  const selectedTest = useTestStore((state) => state.selectedTest);
  const selectedCompletedTest = useTestStore((state) => state.selectedCompletedTest);
  const completedTestCopy = {
    ...selectedCompletedTest,
    ...selectedCompletedTest?.test,
  };

  const t = useTranslations('main.organization-details');

  const currentTest = isCompleted ? completedTestCopy : selectedTest;
  if (!currentTest && testId) return <FullPageSpinner />;
  if (!currentTest) return null;

  return (
    <If value={!!testId}>
      <Card className='overflow-hidden' x-chunk='dashboard-05-chunk-4'>
        <CardHeader className='flex flex-row items-center justify-between bg-muted/50 space-y-0'>
          <CardTitle className='text-lg'>Test: {currentTest.title}</CardTitle>
          <Link
            href={
              isCompleted
                ? `${currentTest.organizationId}/completed-test/${currentTest.id}`
                : `${currentTest.organizationId}/test-completing/${currentTest.id}`
            }
          >
            <Button size='sm' variant='outline' className='h-8 gap-1'>
              <span className='lg:sr-only xl:not-sr-only xl:whitespace-nowrap'>
                {isCompleted || currentTest.userId === userId
                  ? t('button-review')
                  : t('button-start')}
              </span>
            </Button>
          </Link>
        </CardHeader>
        <CardContent className='p-6 text-sm'>
          <div className='grid gap-3'>
            <div className='font-semibold'>{t('details')}</div>
            <ul className='grid gap-3'>
              <li className='flex items-center justify-between'>
                <span className='text-muted-foreground'>{t('theme')}:</span>
                <span>{currentTest.theme}</span>
              </li>
              <li className='flex items-center justify-between'>
                <span className='text-muted-foreground'>{t('questions')}:</span>
                <span>{currentTest.questions?.length ?? 0}</span>
              </li>
              <li className='flex items-center justify-between'>
                <span className='text-muted-foreground'>{t('users')}:</span>
                <span>{currentTest.usersThatComplete?.length ?? 0}</span>
              </li>
            </ul>
            <Separator className='mt-2 mb-4' />
          </div>
          <div className='flex flex-col gap-4'>
            <div className='font-semibold'>{t('description')}</div>
            <p>{currentTest.description || 'No description provided.'}</p>
          </div>
        </CardContent>
      </Card>
    </If>
  );
};
