import express from "express";
import { checkPremium } from "../Middleware/auth.js";
import { generateArticle } from "../Controller/ai.controller.js";
const aiRouter = express.Router();

aiRouter.post("/generate-article", checkPremium, generateArticle);

export default aiRouter;
