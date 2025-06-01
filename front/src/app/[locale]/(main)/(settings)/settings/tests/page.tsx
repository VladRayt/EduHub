'use client';

import { ChangeEvent, useMemo } from 'react';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

import { TestCard } from '@/components/blocks/TestCard';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { If } from '@/components/ui/if';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sorting, Test } from '@/@types/front';
import { useWritableSearchParams } from '@/hooks/useWritableSearchParams';
import { getSortedArrayBySorting } from '@/lib/utils';
import { useUserTests } from '@/requests/test';
import { useTestStore } from '@/store/test.store';

const filterValues = (t: (keys: string) => string) => [
  { value: 'Completed', name: t('filter.completed') },
  { value: 'Created', name: t('filter.uncompleted') },
];

const sortingValues = (t: (keys: string) => string) => [
  { value: Sorting.A_Z, name: t('sorting.A_Z') },
  { value: Sorting.Z_A, name: t('sorting.Z_A') },
  { value: Sorting.ZERO_NINE, name: t('sorting.ZERO_NINE') },
  { value: Sorting.NINE_ZERO, name: t('sorting.NINE_ZERO') },
];

export default function Organizations() {
  const searchParamsSettings = useWritableSearchParams();
  const locale = useLocale();

  const filter = searchParamsSettings.searchParams.get('filter') as 'Created' | 'Completed';
  const sorting = (searchParamsSettings.searchParams.get('sorting') as Sorting) ?? Sorting.A_Z;
  const search = searchParamsSettings.searchParams.get('search');

  const { completed, created } = useTestStore((state) => state.userTests);
  const setSelectedTest = useTestStore((state) => state.setSelectedTest);

  const t = useTranslations();

  useUserTests();

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    searchParamsSettings.set('search', e.target.value);
  };

  const handleChangeFilter = (value: string) => {
    searchParamsSettings.set('filter', value);
  };

  const handleChangeSorting = (value: string) => {
    searchParamsSettings.set('sorting', value);
  };

  const { completedList, createdList } = useMemo(() => {
    const completedList: Test[] = getSortedArrayBySorting(
      sorting,
      completed.map((completed) => ({
        ...completed.test,
        userId: completed.userId,
        organizationId: completed.organizationId,
      })),
      'title',
      'questions',
      true
    ).filter((test) => (filter ? test.title.toLowerCase().includes(filter.toLowerCase()) : test));
    const createdList: Test[] = getSortedArrayBySorting(
      sorting,
      created,
      'title',
      'questions',
      true
    ).filter((test) => (filter ? test.title.toLowerCase().includes(filter.toLowerCase()) : test));
    return { completedList, createdList };
  }, [completed.length, created.length, filter, sorting, search]);
  console.log('🚀 ~ Organizations ~ completed:', filter);

  const isEmptyState = useMemo(() => {
    return (
      (completedList.length === 0 && filter === 'Created') ||
      (createdList.length === 0 && filter === 'Completed') ||
      (!filter && !createdList.length && !completedList.length)
    );
  }, [completedList, createdList]);

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-medium'>{t('profile.tests-list.title')}</h3>
        <p className='text-sm text-muted-foreground'>{t('profile.tests-list.description')}</p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <h4 className='text-lg font-medium'>{t('profile.tests-list.subtitle')}</h4>
        </CardHeader>
        <CardContent className='space-y-8'>
          <label className='block space-y-2'>
            <span className='text-gray-700'>{t('profile.tests-list.filters')}</span>
            <div className='flex flex-row gap-x-12'>
              <Input
                placeholder={t('profile.tests-list.search-pl')}
                onChange={handleChangeSearch}
                defaultValue={search ?? ''}
              />
              <Select onValueChange={handleChangeFilter} defaultValue={filter ?? undefined}>
                <SelectTrigger>
                  <SelectValue placeholder={t('profile.tests-list.filter-pl')} />
                </SelectTrigger>
                <SelectContent>
                  {filterValues(t).map(({ value, name }) => (
                    <SelectItem key={value} value={value}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={handleChangeSorting} defaultValue={sorting}>
                <SelectTrigger>
                  <SelectValue placeholder={t('profile.tests-list.sorting-pl')} />
                </SelectTrigger>
                <SelectContent>
                  {sortingValues(t).map(({ value, name }) => (
                    <SelectItem key={value} value={value}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className='text-gray-600 text-sm'>{t('profile.tests-list.filters-description')}</p>
          </label>
          <div className='space-y-8'>
            <label className='block space-y-2'>
              <If value={!!(completed.length && filter !== 'Created')}>
                <h4 className='text-lg font-medium'>{t('profile.tests-list.completed')}</h4>
                <div className='w-full grid auto-cols-auto gap-8'>
                  {completedList.map((test) => (
                    <Link key={test.id} href={`/${locale}/progress/test/${test.id}`}>
                      <TestCard
                        title={test.title}
                        theme={test.theme}
                        description={test.description ?? ''}
                        onCardClick={() => setSelectedTest(test)}
                      />
                    </Link>
                  ))}
                </div>
              </If>
              <If value={!!(created.length && filter !== 'Completed')}>
                <h4 className='text-lg font-medium'>{t('profile.tests-list.created')}</h4>
                <div className='w-full grid auto-cols-auto gap-4'>
                  {createdList.map((test) => (
                    <Link key={test.id} href={`/${locale}/settings/tests/${test.id}`}>
                      <TestCard
                        title={test.title}
                        theme={test.theme}
                        description={test.description ?? ''}
                        onCardClick={() => setSelectedTest(test)}
                      />
                    </Link>
                  ))}
                </div>
              </If>
              <If value={isEmptyState}>
                <div className='w-full flex flex-col items-center justify-center'>
                  {t('profile.tests-list.empty')}
                </div>
              </If>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
