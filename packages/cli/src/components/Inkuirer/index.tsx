import * as React from 'react';
import { Text, Color, Box } from 'ink';
import { InputQuestion } from './InputQuestionProps';
import { SelectQuestion } from './SelectQuestion';
import { Question, Answer } from './types';
import { getDisplayableValue } from './getDisplayableValue';

export * from './types';

export type InkuirerProps = {
  questions: Question[];
  onCompletion: (answers: any) => void;
};

export function Inkuirer({ questions, onCompletion }: InkuirerProps) {
  const [answers, setAnswers] = React.useState<Answer[]>([]);
  const currentQuestion = questions[answers.length];

  const handleAnswer = React.useCallback(
    (answer: any) => {
      setAnswers([
        ...answers,
        {
          ...currentQuestion,
          answer,
        },
      ]);
    },
    [answers, currentQuestion]
  );

  React.useEffect(() => {
    if (!currentQuestion) {
      onCompletion(
        answers.reduce(
          (acc, answer) => ({
            ...acc,
            [answer.name]: answer.answer,
          }),
          {}
        )
      );
    }
  }, [answers, currentQuestion, onCompletion]);

  return (
    <>
      {answers.map(answer => (
        <Box marginBottom={1} key={answer.name}>
          <Box marginRight={1}>
            <Text>
              <Color gray>{answer.message}:</Color>
            </Text>
          </Box>
          <Text>{getDisplayableValue(answer)}</Text>
        </Box>
      ))}
      {currentQuestion && (
        <Box flexDirection="column">
          <Box marginBottom={1}>
            <Text>
              {currentQuestion.message} <Color gray>({getDisplayableValue(currentQuestion)})</Color>
            </Text>
          </Box>
          {currentQuestion.type === 'input' && (
            <InputQuestion question={currentQuestion} onAnswer={handleAnswer} />
          )}
          {currentQuestion.type === 'select' && (
            <SelectQuestion question={currentQuestion} onAnswer={handleAnswer} />
          )}
        </Box>
      )}
    </>
  );
}
