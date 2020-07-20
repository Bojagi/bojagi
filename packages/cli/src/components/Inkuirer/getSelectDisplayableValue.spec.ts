import { getSelectDisplayableValue } from './getSelectDisplayableValue';

test('Show default value when answer is not available', () => {
  const value = getSelectDisplayableValue({
    default: 'a',
    type: 'select',
    name: 'abc',
    message: 'set a',
    items: [
      {
        label: 'a label',
        value: 'a',
      },
      {
        label: 'b label',
        value: 'b',
      },
    ],
  });
  expect(value).toBe('a label');
});

test('Show answer when available', () => {
  const value = getSelectDisplayableValue({
    default: 'a',
    type: 'select',
    name: 'abc',
    message: 'set a',
    answer: 'b',
    items: [
      {
        label: 'a label',
        value: 'a',
      },
      {
        label: 'b label',
        value: 'b',
      },
    ],
  });
  expect(value).toBe('b label');
});
