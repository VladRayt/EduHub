'use client';

import React, { useCallback, useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

import { CreateTestModal } from '@/components/blocks/CreateTestModal';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FullPageSpinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWritableSearchParams } from '@/hooks/useWritableSearchParams';
import { useOrganizationDetails, useOrganizationMemberList } from '@/requests/organization';
import {
  useCompletedTestDetails,
  useCreateTest,
  useOrganizationTests,
  useTestDetails,
} from '@/requests/test';
import { useOrganizationStore } from '@/store/organization.store';
import { useTestStore } from '@/store/test.store';
import { useUserStore } from '@/store/user.store';
import { PersonIcon } from '@radix-ui/react-icons';

import { CompletedTab } from './CompletedTab';
import { SelectedTestPreview } from './SelectedTestPreview';
import { UncompletedTab } from './UncompletedTab';

export default function OrganizationDetails() {
  const [createModalState, setCreateModalState] = useState<boolean>(false);

  const { organizationId, locale = 'en' } = useParams();
  const searchParamsSettings = useWritableSearchParams();
  const testId = +(searchParamsSettings.searchParams.get('testId') ?? 0);
  const isCompleted = searchParamsSettings.searchParams.get('isCompleted') === 'true';

  const selectedOrganizationId = Array.isArray(organizationId) ? organizationId[0] : organizationId;

  const userId = useUserStore((state) => state.user?.id);
  const selectedOrganization = useOrganizationStore((state) => state.selectedOrganization);
  const organizationMembers = useOrganizationStore((state) => state.members);

  const completedTests = useTestStore((state) => state.completedTests);
  const uncompletedTests = useTestStore((state) => state.workspaceTests);
  const testLength = useTestStore((state) => state.testLength);

  const t = useTranslations('main.organization-details');

  useOrganizationDetails(selectedOrganizationId);
  useOrganizationMemberList(selectedOrganizationId);
  const { isLoading: isLoadingTests } = useOrganizationTests(selectedOrganizationId);
  useTestDetails(isCompleted ? null : testId);
  useCompletedTestDetails(isCompleted ? testId : null);

  const { createTest, isLoading } = useCreateTest(selectedOrganizationId);

  const handleCreateTest = useCallback(
    async (
      title: string,
      theme: string,
      description: string,
      count: number,
      additionalInformation: string
    ) => {
      const testId = await createTest({
        title,
        theme,
        description,
        questionLength: count,
        additionalInformation,
      });
      if (!testId) return;
      searchParamsSettings.set('testId', `${testId}`);
      setCreateModalState(false);
    },
    [searchParamsSettings.searchParams]
  );

  const selectedTest = useMemo(() => {
    if (!testId) return null;
    const selectedCompletedTest = completedTests.find((test) => test.testId === testId);
    return selectedCompletedTest
      ? selectedCompletedTest.test ?? null
      : uncompletedTests.find((test) => test.id === testId) ?? null;
  }, [completedTests.length, uncompletedTests.length, testId]);

  if (!selectedOrganization) return <FullPageSpinner />;

  return (
    <>
      <main
        className={`grid flex-1 items-start gap-4 px-8 md:gap-8 ${selectedTest && 'lg:grid-cols-3 xl:grid-cols-3'}`}
      >
        <div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Card className='sm:col-span-2' x-chunk='dashboard-05-chunk-0'>
              <CardHeader className='pb-3'>
                <CardTitle>{selectedOrganization.title}</CardTitle>
                <CardDescription className='max-w-lg text-balance leading-relaxed'>
                  {selectedOrganization?.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => setCreateModalState(true)}>{t('button-create')}</Button>
              </CardFooter>
            </Card>
            <Card x-chunk='dashboard-05-chunk-1'>
              <CardHeader className='pb-2'>
                <CardDescription className='w-full flex flex-row gap-x-2 items-end'>
                  <PersonIcon className='w-6 h-6' />
                  {`${organizationMembers.length} ${t('members')}`}
                </CardDescription>
                <CardTitle className='text-xl'>
                  {t('author')}: {selectedOrganization.authorName}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card x-chunk='dashboard-05-chunk-2'>
              <CardHeader className='pb-2'>
                <CardDescription>{`${testLength} ${t('tests')}`}</CardDescription>
                <CardTitle className='text-xl'>
                  {t('left', { count: uncompletedTests.length })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-xs text-muted-foreground'>
                  {t('completed-count', { completed: completedTests.length, all: testLength })}
                </div>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue='uncompleted'>
            <div className='flex items-center justify-center md:justify-start'>
              <TabsList>
                <TabsTrigger value='uncompleted'>{t('uncompleted')}</TabsTrigger>
                <TabsTrigger value='completed'> {t('completed')}</TabsTrigger>
              </TabsList>
            </div>
            <UncompletedTab
              isLoading={isLoadingTests}
              searchParams={searchParamsSettings}
              tests={uncompletedTests}
              testId={testId}
            />
            <CompletedTab
              isLoading={isLoadingTests}
              searchParams={searchParamsSettings}
              tests={completedTests}
              testId={testId}
            />
          </Tabs>
        </div>
        <SelectedTestPreview
          locale={Array.isArray(locale) ? locale[0] : locale}
          testId={testId}
          userId={userId}
          isCompleted={isCompleted}
        />
      </main>
      <CreateTestModal
        isLoading={isLoading}
        open={createModalState}
        handleConfirm={handleCreateTest}
        handleCancel={() => setCreateModalState(false)}
      />
    </>
  );
}
