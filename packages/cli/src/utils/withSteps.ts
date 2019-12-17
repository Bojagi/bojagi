import * as Steps from 'cli-step';

export default function withSteps(totalStepCount: number) {
  const steps = new Steps(totalStepCount);
  steps.startRecording();
  return action => args =>
    action({
      ...args,
      steps,
    });
}
