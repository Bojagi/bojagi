import { camelCaseToSpaces } from './camelCaseToSpaces';

test('Put space before one capital character', () => {
  const result = camelCaseToSpaces('HelloWorld');
  expect(result).toBe('Hello World');
});

test('Put spaces before all capital character', () => {
  const result = camelCaseToSpaces('HelloWorldAndMore');
  expect(result).toBe('Hello World And More');
});

test('Capitalize first character', () => {
  const result = camelCaseToSpaces('helloWorld');
  expect(result).toBe('Hello World');
});

test('Put spaces also before numbers and after', () => {
  const result = camelCaseToSpaces('hello123456789world');
  expect(result).toBe('Hello 123456789 World');
});

test('Put spaces also before numbers at the end', () => {
  const result = camelCaseToSpaces('hello50');
  expect(result).toBe('Hello 50');
});
