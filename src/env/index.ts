import * as dotenv from 'dotenv';
import { join } from 'path';

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const path = join(process.cwd(), IS_PRODUCTION ? '.env.prod' : '.env.dev');
dotenv.config({ path });

export const {
  PORT = 3000,
  DOMAIN = '',
  NODE_ENV = 'development',
  MONGODB_PORT = 11049,
  MONGODB_USER = '',
  MONGODB_PASS = '',
  MONGODB_HOST = '',
  MONGODB_DATABASE = '',
} = process.env;

export const MONGODB_ATLAS_URL = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}${MONGODB_HOST}/${MONGODB_DATABASE}`;
export const MONGODB_URL = process.env.MONGODB_PORT ? `mongodb://localhost:${MONGODB_PORT}` : MONGODB_ATLAS_URL;
