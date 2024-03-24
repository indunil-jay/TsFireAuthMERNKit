declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      MONGODB_CONNECTION: string;
      MONGODB_PASSWOR: string;
      MONGODB_USER: string;
      PORT: number;
    }
  }
}
