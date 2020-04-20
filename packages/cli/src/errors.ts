/* eslint-disable max-classes-per-file */

export class NonVerboseError extends Error {
  hideStackTrace: boolean = true;
}

export class ValidationError extends NonVerboseError {}
