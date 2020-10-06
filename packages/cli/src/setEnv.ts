export default function setEnv() {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  if (process.env.DEBUG) {
    process.env.CI = 'true';
  }
}
