import express from "express";
import {clerkMiddleware} from "@clerk/express";
import webhookRoutes from "./routes/webhook.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

connectDB();

dotenv.config();

const app = express();

app.use(clerkMiddleware());
app.use("/api/webhook", webhookRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})