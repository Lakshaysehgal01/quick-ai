/// <reference types="@clerk/express/env" />
import { Express } from "express";
declare global {
  namespace Express {
    interface Request {
      free_usage?: number;
      plan?: "free" | "premium";
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }
  }
}

export {};
