import express from "express";
import { checkPremium } from "../Middleware/auth.js";
import {
  generateArticle,
  generateBlogTitle,
  generateImage,
  removeBackground,
  removeImageObject,
  reviewResume,
} from "../Controller/ai.controller.js";
import { upload } from "../lib/multer.js";
const aiRouter = express.Router();

aiRouter.post("/generate-article", checkPremium, generateArticle);
aiRouter.post("/generate-blog-title", checkPremium, generateBlogTitle);
aiRouter.post("/generate-image", checkPremium, generateImage);
aiRouter.post("/remove-image-background",upload.single("image") ,checkPremium, removeBackground);
aiRouter.post("/remove-image-object",upload.single("image") ,checkPremium, removeImageObject);
aiRouter.post("/resume-review",upload.single("resume") ,checkPremium, reviewResume);

export default aiRouter;
