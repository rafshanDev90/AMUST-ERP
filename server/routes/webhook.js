import express from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import User from "../models/user.model.js";

const router = express.Router();

router.post("/clerk", express.raw({ type: "application/json" }), async (req, res) => {
  let event;

  try {
    event = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SECRET,
    });
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  const { type, data } = event;

  try {
    switch (type) {
      case "user.created":
        await User.create({
          clerkId: data.id,
          email: data.email_addresses?.[0]?.email_address || "",
          name: [data.first_name, data.last_name].filter(Boolean).join(" "),
        });
        break;

      case "user.updated":
        await User.findOneAndUpdate(
          { clerkId: data.id },
          {
            email: data.email_addresses?.[0]?.email_address || "",
            name: [data.first_name, data.last_name].filter(Boolean).join(" "),
          },
          { new: true }
        );
        break;

      case "user.deleted":
        await User.findOneAndDelete({ clerkId: data.id });
        break;

      default:
        break;
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
