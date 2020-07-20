import { Question, Answer } from './types';
import { getSelectDisplayableValue } from './getSelectDisplayableValue';

export function getDisplayableValue(question: Answer | Question) {
  switch (question.type) {
    case 'select':
      return getSelectDisplayableValue(question);
    case 'input':
    default:
      return (question as Answer).answer || question.default;
  }
}
