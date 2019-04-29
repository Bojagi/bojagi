import { emojiMesage } from '../utils/terminalUtils';

export class ValidationError extends Error {
  hideStackTrace: boolean = true;
}

export default function withDeployValidator(action) {
  return args => {
    if (!args.commit) {
      renderError();
      throw new ValidationError(
        'Please add a commit in your arguments (e.g. --commit f9xa5a7)'
      );
    }

    if (!process.env.BOJAGI_SECRET) {
      renderError();
      throw new ValidationError(
        'Please define an environment variable called "BOJAGI_SECRET" that holds the repository secret'
      );
    }

    return action(args);
  };
}

function renderError() {
  emojiMesage(
    '❌',
    'Your Inputs are not valid, please check the message below 👇',
    false,
    false
  );
}
