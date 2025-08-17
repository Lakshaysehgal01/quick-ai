import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import client from "../lib/db.js";

export const getUserCreations = async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized User",
      });
      return;
    }
    const creations = await client.creation.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(201).json(creations);
  } catch (error) {
    console.log("Error in get user creation" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPublishedCreations = async (req: Request, res: Response) => {
  try {
    const creations = await client.creation.findMany({
      where: {
        publish: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(201).json(creations);
  } catch (error) {
    console.log("Error in get published creation" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleLikeCreation = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    if (!id) {
      res.status(400).json({
        message: "Creation id not provided",
      });
      return;
    }
    const auth = getAuth(req);
    const userId = auth.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized User",
      });
    }
    const creations = await client.creation.findUnique({
      where: {
        id: id,
      },
    });
    if (!creations) {
      return res.status(404).json({ message: "Creation not found" });
    }
    const currentLikes = creations.likedBy;
    const userIdStr = userId.toString();
    let updatedLikes;
    let message;
    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((user) => user !== userIdStr);
      message = "Creation unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation liked";
    }
    const updatedCreation = await client.creation.update({
      where: { id: id },
      data: { likedBy: updatedLikes },
    });
    res.status(201).json(message);
  } catch (error) {
    console.log("Error in like creation" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};
