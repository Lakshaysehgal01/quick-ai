import { clerkClient, getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import axios from "axios";
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";
import pdf from "pdf-parse";
import client from "../lib/db.js";
const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

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
    const formattedPrompt = `Write an article on the topic: ${prompt}`;
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: formattedPrompt,
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

export const generateBlogTitle = async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized User",
      });
      return;
    }
    const { prompt } = req.body;
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
    const formattedPrompt = `Generate a Blog Title on the topic: ${prompt}`;
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: formattedPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });
    const content = response.choices[0]?.message.content;

    await client.creation.create({
      data: {
        userId: userId,
        prompt: prompt,
        content: content as string,
        type: "blog-title",
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
    console.log("Error in generate-blog-title", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const generateImage = async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized User",
      });
      return;
    }
    const { prompt, publish, category } = req.body;
    const plan = req.plan;
    if (plan != "premium") {
      res.status(403).json({
        message: "This feature is only available for premium subscriptions",
      });
      return;
    }
    const formData = new FormData();
    const formattedPrompt = `Generate a ${category}-style image of: ${prompt}`;
    formData.append("prompt", formattedPrompt);
    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );
    const base64 = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;
    const uploadedResponse = await cloudinary.uploader.upload(base64, {
      folder: "ai_photos",
    });
    const image_url = uploadedResponse.secure_url;
    await client.creation.create({
      data: {
        userId: userId,
        prompt: prompt,
        content: image_url,
        type: "image",
        publish: publish ?? false,
      },
    });
    res.status(201).json({ message: image_url });
  } catch (error) {
    console.log("Error in generate-image", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const removeBackground = async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized User",
      });
      return;
    }
    const image = req.file;
    if (!image) {
      res.status(400).json({
        message: "Image not provided in rmove background",
      });
      return;
    }
    const plan = req.plan;
    if (plan != "premium") {
      res.status(403).json({
        message: "This feature is only available for premium subscriptions",
      });
      return;
    }

    const uploadedResponse = await cloudinary.uploader.upload(image?.path, {
      folder: "bg_removal",
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });
    const image_url = uploadedResponse.secure_url;
    await client.creation.create({
      data: {
        userId: userId,
        prompt: "Remove background from image",
        content: image_url,
        type: "image",
      },
    });
    res.status(201).json({ message: image_url });
  } catch (error) {
    console.log("Error in remove-background", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const removeImageObject = async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized User",
      });
      return;
    }
    const { object } = req.body;
    const image = req.file;
    if (!image) {
      res.status(400).json({
        message: "Image not provided in remove background",
      });
      return;
    }
    const plan = req.plan;
    if (plan != "premium") {
      res.status(403).json({
        message: "This feature is only available for premium subscriptions",
      });
      return;
    }

    const uploadedResponse = await cloudinary.uploader.upload(image.path, {
      folder: "object_removal",
    });
    const image_id = uploadedResponse.public_id;
    const image_url = cloudinary.url(image_id, {
      transformation: [
        {
          effect: `gen_remove:${object}`,
        },
      ],
      resource_type: "image",
    });
    await client.creation.create({
      data: {
        userId: userId,
        prompt: `Removed ${object} from image`,
        content: image_url,
        type: "image",
      },
    });
    res.status(201).json({ message: image_url });
  } catch (error) {
    console.log("Error in remove-object ", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const reviewResume = async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;
    if (!userId) {
      res.status(401).json({
        message: "Unauthorized User",
      });
      return;
    }
    const resume = req.file;
    if (!resume) {
      res.status(400).json({
        message: "Resume not provided",
      });
      return;
    }
    const plan = req.plan;
    if (plan != "premium") {
      res.status(403).json({
        message: "This feature is only available for premium subscriptions",
      });
      return;
    }
    if (resume.size > 5 * 1024 * 1024) {
      return res.status(413).json({
        message: "Resume file size exceeds the allowed size (5mb)",
      });
    }
    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}`;
    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    const content =
      response.choices[0]?.message.content ?? "No feedback generated. ";
    await client.creation.create({
      data: {
        userId: userId,
        prompt: `Review the uploaded Resume`,
        content: content as string,
        type: "Resume-Review",
      },
    });
    res.status(201).json({ message: content as string });
  } catch (error) {
    console.log("Error in resume-review controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
