const express = require('express');
const Notice = require('../models/Notice');
const auth = require('../middleware/auth');

const router = express.Router();

/* ============================
   CREATE NOTICE (Admin + Teacher)
=============================== */
router.post("/", auth(["admin", "teacher"]), async (req, res) => {
  try {
    const { title, message, audience, className, eventDate } = req.body;

    const notice = await Notice.create({
      title,
      message,
      audience,      // students | parents | teachers | all
      className,
      eventDate,
      createdBy: req.user.id
    });

    return res.json(notice);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* ============================
   GET NOTICES (Role Based)
=============================== */
router.get("/", auth(), async (req, res) => {
  try {
    const role = req.user.role;

    let q = [{ audience: "all" }];

    if (role === "teacher") q.push({ audience: "teachers" });
    if (role === "student") q.push({ audience: "students" });
    if (role === "parent") q.push({ audience: "parents" });

    if (role === "admin") {
      return res.json(await Notice.find().sort({ createdAt: -1 }));
    }

    const list = await Notice.find({ $or: q }).sort({ createdAt: -1 });
    res.json(list);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================
   DELETE NOTICE (Admin + Teacher)
=============================== */
router.delete("/:id", auth(["admin", "teacher"]), async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    return res.json({ message: "Notice deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
