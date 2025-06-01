import React, { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import { TestCard } from '@/components/blocks/TestCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { If } from '@/components/ui/if';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';
import { CompletedTest } from '@/@types/front';
import { WritableSearchParamsType } from '@/hooks/useWritableSearchParams';
import { useTestStore } from '@/store/test.store';

type Props = {
  isLoading: boolean;
  searchParams: WritableSearchParamsType;
  tests: CompletedTest[];
  testId: number;
};

export const CompletedTab = (props: Props) => {
  const searchFilter = props.searchParams.searchParams.get('search');
  const testError = useTestStore((state) => state.error);
  const setSelectedTest = useTestStore((state) => state.setSelectedTest);

  const t = useTranslations('main.organization-details');

  const handleSelectTest = (test: CompletedTest) => {
    setSelectedTest(test, true);
    props.searchParams.setAll({
      testId: `${test.testId}`,
      isCompleted: 'true',
    });
  };

  const handleChangeSearchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.searchParams.set('search', e.target.value);
  };

  const filteredTests = useMemo(() => {
    return (props.tests ?? []).filter((test) =>
      searchFilter ? test.test?.title.includes(searchFilter) : true
    );
  }, [props.tests, searchFilter]);

  return (
    <TabsContent
      value='completed'
      className='overflow-y-auto md:max-h-[420px] lg:max-h-[520px] 2xl:max-h-[620px]'
    >
      <Card x-chunk='dashboard-05-chunk-3'>
        <CardHeader className='px-7'>
          <CardTitle>{t('completed-title')}</CardTitle>
          <CardDescription> {t('completed-description')}</CardDescription>
          <Input
            placeholder={t('search')}
            value={searchFilter ?? ''}
            onChange={handleChangeSearchFilter}
          />
        </CardHeader>
        <CardContent className='space-y-6'>
          <If value={props.isLoading && !testError}>
            {['1', '2', '3'].map((template) => (
              <div
                className='flex items-center justify-between bg-gray-200 dark:bg-gray-600 px-6 rounded-lg shadow-sm h-[120px] w-full'
                key={template}
              >
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-[250px]' />
                  <Skeleton className='h-4 w-[200px]' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-[250px]' />
                  <Skeleton className='h-4 w-[200px]' />
                </div>
              </div>
            ))}
          </If>
          <If value={!!testError}>
            <div className='flex items-center justify-center'>
              <p>{testError}</p>
            </div>
          </If>
          <If value={filteredTests.length === 0 && !testError}>
            <div className='flex items-center justify-center'>
              <p> {t('empty')}</p>
            </div>
          </If>
          <If value={filteredTests.length > 0}>
            {filteredTests.map((t) => (
              <TestCard
                key={t.testId}
                onCardClick={() => handleSelectTest(t)}
                title={t.test?.title ?? ''}
                theme={t.test?.theme ?? ''}
                description={t.test?.description}
                isSelected={t.testId === props.testId}
              />
            ))}
          </If>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
