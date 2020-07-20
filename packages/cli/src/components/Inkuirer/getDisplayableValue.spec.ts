import { getDisplayableValue } from './getDisplayableValue';

describe('type: input', () => {
  test('Show default value when answer is not available', () => {
    const value = getDisplayableValue({
      default: 'a',
      type: 'input',
      name: 'abc',
      message: 'set a',
    });
    expect(value).toBe('a');
  });

  test('Show answer when available', () => {
    const value = getDisplayableValue({
      default: 'a',
      type: 'input',
      name: 'abc',
      message: 'set a',
      answer: 'b',
    });
    expect(value).toBe('b');
  });
});

describe('type: select', () => {
  test('Show default value when answer is not available', () => {
    const value = getDisplayableValue({
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
    const value = getDisplayableValue({
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
});
