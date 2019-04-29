import withDeployValidator from './withDeployValidator';

let wrappedAction;
let action;
let tempProcess;

function storeProcess() {
  tempProcess = { ...process.env };
}

function restoreProcess() {
  process.env = tempProcess;
}

beforeEach(storeProcess);

beforeEach(() => {
  action = jest.fn();
  wrappedAction = withDeployValidator(action);
  process.env.BOJAGI_SECRET = 'some_secret';
});

afterEach(restoreProcess);

test('fail because of missing commit', () => {
  expect(() =>
    wrappedAction({
      commit: undefined
    })
  ).toThrowErrorMatchingSnapshot();
});

test('fail because of missing secret', () => {
  process.env.BOJAGI_SECRET = undefined;
  expect(() =>
    wrappedAction({
      commit: 'abc123'
    })
  ).toThrowErrorMatchingSnapshot();
});

test('succeed and call action with args', () => {
  action.mockReturnValueOnce('action_result');
  const result = wrappedAction({
    commit: 'abc123'
  });
  expect(result).toBe('action_result');
});
