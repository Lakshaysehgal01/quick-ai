import express from "express";
import { checkPremium } from "../Middleware/auth.js";
import {
  generateArticle,
  generateBlogTitle,
  generateImage,
  removeBackground,
} from "../Controller/ai.controller.js";
const aiRouter = express.Router();

aiRouter.post("/generate-article", checkPremium, generateArticle);
aiRouter.post("/generate-blog-title", checkPremium, generateBlogTitle);
aiRouter.post("/generate-image", checkPremium, generateImage);
aiRouter.post("/remove-background", checkPremium, removeBackground);

export default aiRouter;
