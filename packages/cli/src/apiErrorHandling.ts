import debuggers, { DebugNamespaces } from './debug';
import { NonVerboseError } from './errors';

const debug = debuggers[DebugNamespaces.UPLOAD];

type ApiError = {
  message: string;
};

export class InvalidSecretError extends NonVerboseError {
  constructor() {
    super('Your secret is not valid, did you misspell it?');
  }
}

export function handleApiError(err) {
  if (!err.response) {
    return;
  }

  debug('API error data', err.response?.data);
  if (err.response.status === 400 && hasInvalidSecretError(err.response.data.errors)) {
    throw new InvalidSecretError();
  }
}

function hasInvalidSecretError(errors: ApiError[]) {
  return !!errors.find(error => error.message.includes('Repository not found'));
}
