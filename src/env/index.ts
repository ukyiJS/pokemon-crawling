import * as dotenv from 'dotenv';
import { join } from 'path';

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const path = join(process.cwd(), IS_PRODUCTION ? '.env.prod' : '.env.dev');
dotenv.config({ path });

export const {
  PORT = 3000,
  DOMAIN = '',
  NODE_ENV = 'development',
  IS_OFFLINE,
  MONGODB_PORT = 11049,
  MONGODB_ATLAS_USER = '',
  MONGODB_ATLAS_PASS = '',
  MONGODB_ATLAS_HOST = '',
  MONGODB_ATLAS_DATABASE = '',
} = process.env;

export const MODE = IS_PRODUCTION ? 'prod' : 'dev';

export const MONGODB_ATLAS_URL = `mongodb+srv://${MONGODB_ATLAS_USER}:${MONGODB_ATLAS_PASS}${MONGODB_ATLAS_HOST}/${MONGODB_ATLAS_DATABASE}`;
export const MONGODB_URL = process.env.MONGODB_PORT ? `mongodb://localhost:${MONGODB_PORT}` : MONGODB_ATLAS_URL;
