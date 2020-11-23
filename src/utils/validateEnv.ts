import { cleanEnv, port, str } from 'envalid';

export const validateEnv = (): void => {
  cleanEnv(process.env, {
    PORT: port(),
    MONGODB_USER: str(),
    MONGODB_PASS: str(),
    MONGODB_HOST: str(),
    MONGODB_DATABASE: str(),
  });
};
