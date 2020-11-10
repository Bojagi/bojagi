export default function setEnv() {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
  process.env.BROWSERSLIST_IGNORE_OLD_DATA = process.env.BROWSERSLIST_IGNORE_OLD_DATA || 'true';
  if (process.env.DEBUG) {
    process.env.CI = 'true';
  }
}
