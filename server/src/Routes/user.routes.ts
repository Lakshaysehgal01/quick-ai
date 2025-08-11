import express from "express";
import {
  getPublishedCreations,
  getUserCreations,
  toggleLikeCreation,
} from "../Controller/user.controller.js";
import { checkPremium } from "../Middleware/auth.js";

const userRouter = express.Router();

userRouter.get("/get-user-creation", checkPremium, getUserCreations);

userRouter.get("/published-creation", checkPremium, getPublishedCreations);

userRouter.post("/toggle-like", checkPremium, toggleLikeCreation);

export default userRouter;
