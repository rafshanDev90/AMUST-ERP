import express from "express";


const router = express.Router();

router.post("/clerk", express.raw({ type: "application/json" }), async (req, res) => {
    console.log("Received webhook from Clerk");
    return res.status(200).json({recived: true});

});

export default router;