import dotenv from 'dotenv';

// dotenv.config({ path: process.env.NODE_ENV === "production" ? '.env' : '.env.development' });
dotenv.config({ path: process.env.NODE_ENV === "production" ? '.env' : `.env.${process.env.NODE_ENV}` });

interface ENV_TYPES {
    PORT: number | string;
    DB_URL: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_URL_S: string;
    // JWT Details
    JWT_SECRET: string;
    JWT_EXPIRE_IN: string;

    MAIL: {
      HOST: string;
      USER_NAME: string;
      PASSWORD: string;
      PORT: string;
      SMTP_AUTH: boolean;
      SMTP_TLS: boolean;
  }

    AWS: {
        ACCESS_KEY: string;
        SECRET_KEY: string;
        BUCKET_NAME: string;
        REGION: string;
      };

}

export const ENV: ENV_TYPES = {
    // Service Config
    PORT: process.env.PORT ?? 3002,

    // DB Credentials
    DB_URL: process.env.DB_URL ?? "",
    DB_USERNAME: process.env.DB_USERNAME ?? "",
    DB_PASSWORD: process.env.DB_PASSWORD ?? "",
    DB_NAME: process.env.DB_NAME ?? "",
    DB_URL_S: process.env.DB_URL_S ?? "",
    // JWT Details
    JWT_SECRET: process.env.JWT_SECRET ?? "",
    JWT_EXPIRE_IN: process.env.JWT_EXPIRE_IN ?? "",

    AWS: {
        ACCESS_KEY: process.env.AWS_ACCESS_KEY ?? "",
        SECRET_KEY: process.env.AWS_SECRET_KEY ?? "",
        BUCKET_NAME: process.env.AWS_BUCKET_NAME ?? "",
        REGION: process.env.AWS_REGION ?? "",
      },

      MAIL: {
        HOST: process.env.MAIL_HOST ?? "",
        USER_NAME: process.env.MAIL_USER_NAME ?? "",
        PASSWORD: process.env.MAIL_PASSWORD ?? "",
        PORT: process.env.MAIL_PORT ?? "",
        SMTP_AUTH: Boolean(process.env.MAIL_SMTP_AUTH),
        SMTP_TLS: Boolean(process.env.MAIL_SMTP_TLS),
    },

}