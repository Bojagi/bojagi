import * as React from 'react';
import TextInput from 'ink-text-input';
import { Question } from './types';

type InputQuestionProps = {
  question: Question;
  onAnswer: (answer: string) => void;
};
export function InputQuestion({ question, onAnswer }: InputQuestionProps) {
  const [currentValue, setCurrentValue] = React.useState<any>('');
  const setAnswer = React.useCallback(() => {
    const answer = currentValue === '' ? question.default : currentValue;
    setCurrentValue('');
    onAnswer(answer);
  }, [currentValue, onAnswer, question]);

  return <TextInput value={currentValue} onChange={setCurrentValue} onSubmit={setAnswer} />;
}
