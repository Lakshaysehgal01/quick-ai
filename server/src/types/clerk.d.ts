/// <reference types="@clerk/express/env" />

declare global {
  namespace Express {
    interface Request {
      free_usage?: number;
      plan?: "free" | "premium";
    }
  }
}

export {};
