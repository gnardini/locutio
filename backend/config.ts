import dotenv from 'dotenv';

dotenv.config();

export const PUBLIC_APP_URL = 'https://locut.io';

export const PORT = process.env.PORT || 8080;
export const NODE_ENV = process.env.NODE_ENV ?? 'undefined';
export const IS_DEV_MODE = NODE_ENV === 'development';
export const JWT_SECRET = process.env.JWT_SECRET!;

export const DB_HOST = process.env.DB_HOST ?? 'localhost';
export const DB_NAME = process.env.DB_NAME ?? 'pathways_test';
export const DB_USERNAME = process.env.DB_USERNAME ?? 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD ?? 'postgres';
export const DB_RUN_MIGRATIONS = process.env.DB_RUN_MIGRATIONS === 'true';

export const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? '';
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? '';
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY ?? '';

export const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY ?? '';
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';
export const LLM_LOGGER_API_KEY = process.env.LLM_LOGGER_API_KEY ?? '';

export const GITHUB_CLIENT_ID = process.env.PUBLIC_ENV__GITHUB_CLIENT_ID ?? '';
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ?? '';
