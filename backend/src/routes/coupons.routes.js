import express from 'express';
import dotenv from 'dotenv';
dotenv.config();        
import cors from 'cors';
import {getCoupon, validateCoupon} from "../controllers/coupons.controllers.js";
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/", authMiddleware, getCoupon);
router.post("/", authMiddleware, validateCoupon);




export default router;