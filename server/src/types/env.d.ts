declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: number;
    CLERK_PUBLISHABLE_KEY: string;
    CLERK_SECRET_KEY: string;
    DATABASE_URL: string;
    GEMINI_API_KEY: string;
    CLIPDROP_API_KEY: string;
    ClOUDINARY_CLOUD_NAME: string;
    ClOUDINARY_API_KEY: string;
    ClOUDINARY_API_SECERT: string;
  }
}
