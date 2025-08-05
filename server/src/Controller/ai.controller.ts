import { clerkClient, getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const client = new PrismaClient({});

export const generateArticle = async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized User",
      });
      return;
    }
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;
    console.log(free_usage);
    if (typeof free_usage !== "number") {
      console.log("Free usage not defined");
      res.status(500).json({
        message: "Internal Server Error",
      });
      return;
    }
    if (plan != "premium" && free_usage >= 10) {
      res.status(429).json({
        message: "Free usage limit reached. Upgrade to premium to continue.",
      });
      return;
    }
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });
    const content = response.choices[0]?.message.content;

    await client.creation.create({
      data: {
        userId: userId,
        prompt: prompt,
        content: content as string,
        type: "article",
      },
    });
    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    res.status(201).json(content);
  } catch (error) {
    console.log("Error in generate-Article", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
