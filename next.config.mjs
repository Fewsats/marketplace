import dotenv from 'dotenv';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : process.env.NODE_ENV === 'staging'
      ? '.env.staging'
      : '.env.development';
dotenv.config({ path: envFile });

const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
  },
};

export default nextConfig;
