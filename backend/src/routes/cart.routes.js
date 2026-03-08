import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import {addToCart, removeAllFromCart, updateQuantity, getAllAddedProducts} from "../controllers/cart.controllers.js"
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/", authMiddleware, getAllAddedProducts);
router.post("/", authMiddleware, addToCart);
router.delete("/:id", authMiddleware, removeAllFromCart);
router.patch("/:id",authMiddleware, updateQuantity);






export default router;