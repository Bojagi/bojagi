import { StepRunnerStep } from '../../containers/StepRunner';
import { cleanTempFolder } from '../../utils/writeFile';

export type CleanupStepOutput = {};

export const cleanupStep: StepRunnerStep<CleanupStepOutput> = {
  action: async () => {
    await cleanTempFolder();
    return {};
  },
  emoji: 'woman_in_lotus_position' as any,
  name: 'cleanup',
  messages: {
    running: () => 'Cleaning up Bojagi temp folder',
    success: () => 'Cleaned up Bojagi temp folder',
    error: () => 'Error cleaning up Bojagi temp folder',
  },
};
