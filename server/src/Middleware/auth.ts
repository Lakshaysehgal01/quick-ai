import { clerkClient, getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";

// this is a middlewar to check user has a premiumPlan
export const checkPremium = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized User",
      });
      return;
    }

    const hasPremiumPlan = await auth.has({ plan: "premium" });
    const user = await clerkClient.users.getUser(userId);

    if (!hasPremiumPlan && user.privateMetadata.free_usage) {
      req.free_usage = user.privateMetadata.free_usage as number;
    } else {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: 0,
        },
      });
      req.free_usage = 0;
    }
    req.plan = hasPremiumPlan ? "premium" : "free";
    next();
  } catch (error) {
    console.error("Error in checkPremium middleware:", error);
    res.status(500).json({
      message: "Internal server Error",
    });
  }
};
