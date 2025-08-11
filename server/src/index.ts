import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import aiRouter from "./Routes/ai.routes.js";
import userRouter from "./Routes/user.routes.js";
dotenv.config({ quiet: true });

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.use(requireAuth());
app.use("/api/v1/ai", aiRouter);
app.use("/api/v1/user", userRouter);

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
