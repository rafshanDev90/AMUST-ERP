import express from "express";
import protect from "../middleware/clerkAuth.js";

const router = express.Router();

router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});

export default router;
