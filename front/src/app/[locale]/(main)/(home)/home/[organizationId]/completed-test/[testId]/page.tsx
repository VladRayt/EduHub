'use client';

import React, { useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FullPageSpinner } from '@/components/ui/spinner';
import { Question } from '@/@types/front';
import { cn } from '@/lib/utils';
import { useTestStore } from '@/store/test.store';

export default function CompletedTest() {
  const { organizationId, testId, locale = 'en' } = useParams();
  const router = useRouter();
  const selectedOrganizationId = Array.isArray(organizationId) ? organizationId[0] : organizationId;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const t = useTranslations('main.test');

  const selectedTest = useTestStore((state) => state.selectedCompletedTest?.test);
  const userAnswers = useTestStore((state) => state.selectedCompletedTest?.userAnswers);

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex !== 0) {
      return setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex !== (selectedTest?.questions?.length ?? 0) - 1) {
      return setCurrentQuestionIndex((prev) => prev + 1);
    }
    router.push(`/${locale}/home/${selectedOrganizationId}?testId=${testId}&isCompleted=true`);
  };

  const activeQuestion = useMemo(
    () => selectedTest?.questions?.[currentQuestionIndex] as Question,
    [currentQuestionIndex]
  );

  if (!selectedTest)
    return router.push(
      `/${locale}/home/${selectedOrganizationId}?testId=${testId}&isCompleted=true`
    );
  if (!activeQuestion) return <FullPageSpinner />;

  return (
    <main className='flex flex-col flex-1 items-center justify-center'>
      <h3 className='text-2xl font-bold'>
        {t('test')}: {selectedTest.title}
      </h3>
      <p className='mb-4 font-semibold'>
        {t('theme')}: {selectedTest.theme}
      </p>
      <div className='w-full h-full sm:w-[500px] lg:h-[60vh]'>
        <div className='w-full border-2 border-gray-700 dark:border-gray-100 rounded-xl p-6 bg-white dark:bg-gray-800 max-h-[100%] overflow-y-auto'>
          <div className='h-full flex flex-col items-start gap-y-4'>
            <h3 className='text-xl font-bold'>
              {t('question')} {currentQuestionIndex + 1}/{selectedTest.questions?.length ?? 0}
            </h3>
            <h3 className='text-3xl font-bold'>{activeQuestion.title}</h3>
            <RadioGroup
              disabled
              value={`${userAnswers?.find?.((answer) => answer.questionId === activeQuestion.id)?.answerId}`}
              className='w-full gap-y-4'
            >
              {(activeQuestion.answers ?? []).map((answer, index) => (
                <div
                  key={`question-${answer.id}`}
                  className={cn(
                    'flex items-center space-x-2 bg-card rounded-xl h-12 px-6',
                    answer.isCorrect
                      ? 'outline outline-offset-2 outline-2 outline-green-400'
                      : 'outline outline-offset-2 outline-2 outline-red-400'
                  )}
                >
                  <RadioGroupItem value={`${answer.id}`} id={`r${index + 1}`} />
                  <Label htmlFor={`r${index + 1}`}>{answer.title}</Label>
                </div>
              ))}
            </RadioGroup>
            <div className='flex flex-row items-center justify-between w-full'>
              <Button disabled={currentQuestionIndex == 0} onClick={handlePreviousQuestion}>
                {t('button-back')}
              </Button>
              <Button className='self-end' onClick={handleNextQuestion}>
                {currentQuestionIndex !== (userAnswers?.length ?? 0) - 1
                  ? t('button-next')
                  : t('button-return')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
