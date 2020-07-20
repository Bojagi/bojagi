import * as React from 'react';
import SelectInput from 'ink-select-input';
import { Question } from './types';

type SelectQuestionProps = {
  question: Question;
  onAnswer: (answer: string) => void;
};

export function SelectQuestion({ question, onAnswer }: SelectQuestionProps) {
  const setAnswer = React.useCallback(
    item => {
      onAnswer(item.value);
    },
    [onAnswer]
  );

  const initialIndex =
    question.items && question.items.findIndex(q => q.value === question.default);

  return <SelectInput items={question.items} onSelect={setAnswer} initialIndex={initialIndex} />;
}
