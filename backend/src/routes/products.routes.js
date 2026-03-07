import express from 'express';
import dotenv from 'dotenv';
import { getAllProducts, getFeaturedProducts, addProduct, deleteProduct } from '../controllers/products.controllers.js';
import {authMiddleware , adminMiddleware} from "../middleware/index.js";
dotenv.config();
import {body} from "express-validator";


const router = express.Router();

router.get("/",authMiddleware, adminMiddleware,getAllProducts);
router.get("/featured", getFeaturedProducts);
router.post("/addProduct",authMiddleware, adminMiddleware, [
    body("name").notEmpty().withMessage("Name is required"),
    body("desc").notEmpty().withMessage("Description is required"),
    body("price").notEmpty().withMessage("Price is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("quantity").notEmpty().withMessage("Quantity is required"),
    body("image").notEmpty().withMessage("Image is required"),
], addProduct);
router.delete("/:id",authMiddleware,adminMiddleware,deleteProduct);


export default router;