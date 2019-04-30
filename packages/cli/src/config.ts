export type Config = {
  uploadApiUrl: string;
};

const config: Config = {
  uploadApiUrl: process.env.BOJAGI_API_URL || 'https://upload.bojagi.io'
};

export default config;
