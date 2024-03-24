declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      MONGODB_CONNECTION: string;
      MONGODB_PASSWOR: string;
      MONGODB_USER: string;
      PORT: number;
      JWT_SECRET: string;
      JWT_EXPIRE_TIME: string;
      JWT_COOKIE_EXPIRES_IN: string;
      NODE_ENV: string;
    }
  }
}
