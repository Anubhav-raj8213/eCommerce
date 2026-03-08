import express from "express";
import { createCheckoutSession, paymentVerification } from "../controllers/payment.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-checkout-session", authMiddleware, createCheckoutSession);
router.post("/verify-payment", authMiddleware, paymentVerification);

export default router;
