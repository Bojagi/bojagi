import { ValidationError } from '../errors';

export function uploadValidator(config) {
  if (!config.commit) {
    throw new ValidationError('Please add a commit in your arguments (e.g. --commit f9xa5a7)');
  }

  if (!process.env.BOJAGI_SECRET) {
    throw new ValidationError(
      'Please define an environment variable called "BOJAGI_SECRET" that holds the repository secret'
    );
  }
}
