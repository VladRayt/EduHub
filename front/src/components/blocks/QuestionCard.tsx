import React from 'react';

import { Answer } from '@/@types/front';
import { TrashIcon } from '@radix-ui/react-icons';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

type Props = {
  title: string;
  answers: Answer[];
  onRemoveQuestion: () => void;
};

export const QuestionCard = (props: Props) => {
  return (
    <Accordion type='single' collapsible className='w-full'>
      <AccordionItem value='item-1'>
        <AccordionTrigger>
          <div className='flex flex-row gap-x-4 items-center'>
            <span>{props.title}</span>
            <Button onClick={props.onRemoveQuestion} className='w-8 h-8 p-0'>
              <TrashIcon className='w-5 h-5' />
            </Button>
          </div>
        </AccordionTrigger>
        <AccordionContent className='space-y-4'>
          {props.answers.map((answer) => (
            <div className='flex flex-row items-center justify-between' key={`answer-${answer.id}`}>
              <span>{answer.title}</span>
              <Badge
                variant='outline'
                className={
                  answer.isCorrect ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
                }
              >
                {answer.isCorrect ? 'True' : 'False'}
              </Badge>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
