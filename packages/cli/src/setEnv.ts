export default function setEnv() {
  process.env.NODE_ENV = process.env.NODE_ENV || 'production';
}
