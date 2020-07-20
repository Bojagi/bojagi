import { Question, Answer } from './types';

export function getSelectDisplayableValue(answer: Answer | Question) {
  if (answer.items) {
    const hasAnswer = !!(answer as Answer).answer;
    const foundItem = answer.items.find(item =>
      hasAnswer ? item.value === (answer as Answer).answer : item.value === answer.default
    );
    return foundItem ? foundItem.label : '';
  }

  return '';
}
