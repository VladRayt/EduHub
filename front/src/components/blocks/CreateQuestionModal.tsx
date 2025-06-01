import { PropsWithChildren, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import { Answer } from '@/@types/front';

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
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';

type Props = PropsWithChildren<{
  open: boolean;
  handleConfirm: (
    title: string,
    answers: Omit<Answer, 'id' | 'questionId'>[]
  ) => void | Promise<void>;
  handleCancel: () => void | Promise<void>;
}>;
export const CreateQuestionModal = ({ open, handleConfirm, handleCancel }: Props) => {
  const [correctAnswer, setCorrectAnswer] = useState<string>('1');

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const answerOneRef = useRef<HTMLInputElement>(null);
  const answerTwoRef = useRef<HTMLInputElement>(null);
  const answerThreeRef = useRef<HTMLInputElement>(null);
  const answerFourRef = useRef<HTMLInputElement>(null);

  const t = useTranslations('question-modal');

  const handleCreateTest = () => {
    const title = titleRef.current?.value;
    const answerOne = answerOneRef.current?.value;
    const answerTwo = answerTwoRef.current?.value;
    const answerThree = answerThreeRef.current?.value;
    const answerFour = answerFourRef.current?.value;
    if (!title || !answerOne || !answerTwo || !answerThree || !answerFour) return;

    const answersList = [
      { title: answerOne, isCorrect: +correctAnswer === 1 },
      { title: answerTwo, isCorrect: +correctAnswer === 2 },
      { title: answerThree, isCorrect: +correctAnswer === 3 },
      { title: answerFour, isCorrect: +correctAnswer === 4 },
    ];
    handleConfirm(title, answersList);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription>{t('description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <label className='block space-y-2'>
          <p className='text-md font-medium'>{t('name')}</p>
          <Textarea placeholder={t('name-pl')} ref={titleRef} />
        </label>
        {[answerOneRef, answerTwoRef, answerThreeRef, answerFourRef].map((ref, index) => (
          <>
            <label className='block space-y-2'>
              <p className='text-md font-medium'>
                {t('question')} №{index + 1}
              </p>
              <Input placeholder={t('answer-title')} ref={ref} />
            </label>
          </>
        ))}
        <label className='block space-y-2'>
          <p className='text-md font-medium'>{t('correct-answer')}</p>
          <RadioGroup defaultValue='1' onValueChange={setCorrectAnswer} value={correctAnswer}>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='1' id='r1' />
              <Label htmlFor='r1'>1</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='2' id='r2' />
              <Label htmlFor='r2'>2</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='3' id='r3' />
              <Label htmlFor='r3'>3</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='4' id='r4' />
              <Label htmlFor='r4'>4</Label>
            </div>
          </RadioGroup>
        </label>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleCreateTest}>{t('accept')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
