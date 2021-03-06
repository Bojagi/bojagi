import { DownloadPreviewClientStepOutput } from './index';

export function getSuccessMessage(output: DownloadPreviewClientStepOutput) {
  if (output.newClientDownload && output.localDevEtag && output.hemingwayEtag) {
    return 'Preview client updated';
  }
  if (output.newClientDownload) {
    return 'Preview client downloaded';
  }
  return 'Your client is up-to-date';
}
