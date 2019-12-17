import chalk from 'chalk';
import { emojiMessage, indentation } from './terminalUtils';

export default function(action) {
  return async args => {
    try {
      emojiMessage('👋', 'Welcome back!', true);
      await action(args);
      const timeMessage = args.steps
        ? chalk.gray(`Done in ${getDurationOfSteps(args.steps)}.`)
        : '';
      emojiMessage('🙌', `We're done! Have a nice day! ${timeMessage}`, true);
    } catch (err) {
      emojiMessage('🤷‍♀️', 'SORRY, WE FOUND AN ERROR', true);
      console.error(indentation(chalk.bold(err.message)));
      if (!err.hideStackTrace) {
        console.error(indentation(chalk.gray(`${err.stack}\n`)));
      }
      process.exit(1);
    }
  };
}

function getDurationOfSteps(steps) {
  const duration = Math.round((steps.stopRecording() / 1000000000) * 100) / 100;
  return `${duration}s`;
}
