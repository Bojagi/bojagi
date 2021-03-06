import * as React from 'react';

export type QuestionType = 'input' | 'select';

export type QuestionSelectItem<T = any> = {
  label: string;
  value: T;
};

export type Question<T = any> = {
  type: QuestionType;
  name: string;
  message: React.ReactNode;
  default: T;
  items?: QuestionSelectItem[];
};

export type Answer<T = any> = Question<T> & {
  answer: T;
};
