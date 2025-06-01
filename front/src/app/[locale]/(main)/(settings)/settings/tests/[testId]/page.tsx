'use client';

import { useCallback, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';

import { CreateQuestionModal } from '@/components/blocks/CreateQuestionModal';
import { QuestionCard } from '@/components/blocks/QuestionCard';
import { RemoveModal } from '@/components/blocks/RemoveModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { FullPageSpinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Answer } from '@/@types/front';
import {
  useAddTestQuestion,
  useRemoveTest,
  useRemoveTestQuestion,
  useTestDetails,
  useUpdateTest,
} from '@/requests/test';
import { useTestStore } from '@/store/test.store';
import { PlusIcon } from '@radix-ui/react-icons';

export default function TestSettings() {
  const { testId, locale = 'en' } = useParams();
  const selectedTestId = Array.isArray(testId) ? +testId[0] : +testId;
  const [questionToRemove, setQuestionToRemove] = useState<number | null>(null);

  const router = useRouter();

  const [removeModalState, setRemoveModalState] = useState<boolean>(false);
  const [addModalState, setAddModalState] = useState<boolean>(false);

  const t = useTranslations('profile.test-details');

  const { updateTest } = useUpdateTest();
  const { addQuestion } = useAddTestQuestion();

  const { removeTest } = useRemoveTest();
  const { removeQuestion } = useRemoveTestQuestion();

  const selectedTest = useTestStore((state) => state.selectedTest);
  useTestDetails(selectedTestId);

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const themeRef = useRef<HTMLInputElement>(null);

  const handleSave = useCallback(async () => {
    if (!selectedTest) return;
    const testDataForUpdate = {
      testId: selectedTest.id,
      title: selectedTest.title,
      description: selectedTest.description,
      theme: selectedTest.theme,
    };
    selectedTest.title = titleRef.current?.value || testDataForUpdate.title;
    selectedTest.description = descriptionRef.current?.value || testDataForUpdate.description;
    selectedTest.theme = themeRef.current?.value || testDataForUpdate.theme;
    updateTest(testDataForUpdate);
  }, [selectedTest]);

  const handleAddQuestionToRemove = (questionId: number) => {
    setQuestionToRemove(questionId);
    setRemoveModalState(true);
  };
  const handleCancel = () => {
    setQuestionToRemove(null);
    setRemoveModalState(false);
    setAddModalState(false);
  };
  const handleAcceptAdd = (title: string, answers: Omit<Answer, 'id' | 'questionId'>[]) => {
    return addQuestion({
      testId: selectedTestId,
      title,
      answers,
    });
  };
  const handleAcceptRemove = async () => {
    if (questionToRemove) {
      await removeQuestion({
        testId: selectedTestId,
        questionId: questionToRemove,
      });
      handleCancel();
    } else {
      setRemoveModalState(false);
      if (!selectedTest) return;
      await removeTest({
        testId: selectedTestId,
        organizationId: selectedTest?.organizationId,
      });

      router.push('/' + locale + '/settings/tests');
    }
  };

  if (!selectedTest) return <FullPageSpinner />;

  return (
    <>
      <div className='space-y-6'>
        <div>
          <h3 className='text-lg font-medium'>
            {t('title')}: {selectedTest.title}
          </h3>
          <p className='text-sm text-muted-foreground'>{t('description')}</p>
        </div>
        <Separator />
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <h4 className='text-lg font-medium'>{t('subtitle')}</h4>
            <Button variant='destructive' onClick={() => setRemoveModalState(true)}>
              {t('button-delete')}
            </Button>
          </CardHeader>
          <CardContent className='space-y-8'>
            <label className='block space-y-2'>
              <span className='text-gray-700'>{t('name')}</span>
              <Input placeholder={t('name-pl')} defaultValue={selectedTest.title} ref={titleRef} />
              <p className='text-gray-600 text-sm'>{t('name-description')}</p>
            </label>
            <label className='block space-y-2'>
              <span className='text-gray-700'>{t('test-description')}</span>
              <Textarea
                placeholder={t('test-description-pl')}
                defaultValue={selectedTest.description}
                ref={descriptionRef}
              />
              <p className='text-gray-600 text-sm'>{t('test-description-description')}</p>
            </label>
            <label className='block space-y-2'>
              <span className='text-gray-700'>{t('theme')}</span>
              <Input placeholder={t('theme-pl')} defaultValue={selectedTest.theme} ref={themeRef} />
              <p className='text-gray-600 text-sm'>{t('theme-description')}</p>
            </label>
            <Button onClick={handleSave}>{t('button-update')}</Button>
            <label className='block space-y-2'>
              <div className='w-full flex flex-row items-center justify-between'>
                <span className='text-gray-700'>{t('questions')}</span>
                <Button onClick={() => setAddModalState(true)} className='w-8 h-8 p-0'>
                  <PlusIcon className='w-5 h-5' />
                </Button>
              </div>
              <div className='max-h-[500px] overflow-y-auto py-2 '>
                {selectedTest.questions?.map((question) => (
                  <QuestionCard
                    key={`question-${question.id}`}
                    title={question.title}
                    answers={question.answers ?? []}
                    onRemoveQuestion={() => handleAddQuestionToRemove(question.id)}
                  />
                ))}
              </div>
              <p className='text-gray-600 text-sm'>{t('questions-description')}</p>
            </label>
          </CardContent>
        </Card>
      </div>
      <RemoveModal
        open={removeModalState}
        handleCancel={handleCancel}
        handleConfirm={handleAcceptRemove}
      />
      <CreateQuestionModal
        open={addModalState}
        handleCancel={handleCancel}
        handleConfirm={handleAcceptAdd}
      />
    </>
  );
}
