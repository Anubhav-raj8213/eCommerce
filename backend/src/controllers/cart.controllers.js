import { User, Product } from "../models/index.js";
import redis from "../config/redis.js";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import cloudinary from "../config/cloudinary.js";


const addToCart = async (req, res) => {
    try {
        const user = req.user;
        const productId = req.body.productId;
        const alreadyAdded = user.cartItems.find(item => item.product.toString() === productId);
        if (alreadyAdded) {
            {
                alreadyAdded.quantity++;
                await user.save();
                return res.status(200).json({
                    message: "Product added to cart successfully"
                })
            }
        }
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({
            message: "Product not found"
        })
        user.cartItems.push({
            product: product._id,
            quantity: 1
        })
        await user.save();
        return res.status(201).json({
            message: "Product added to cart successfully"
        })
    } catch (error) {
        console.error("Error adding product to cart:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const removeAllFromCart = async (req, res) => {
    try {
        const user = req.user;
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                message: "Product not found"
            })
        }
        user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);
        await user.save();
        return res.status(200).json({
            message: "Product removed from cart successfully"
        })
    } catch (error) {
        console.error("Error removing product from cart:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateQuantity = async (req, res) => {
    try {
        const user = req.user;
        const productId = req.params.id;
        const quantity = req.body.quantity;
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({
                message: "Product not found"
            })
        }
        const existInCart = user.cartItems.find(item => item.product === productId);
        if(!existInCart) return res.status(404).json({
            message: "Product not found in cart"
        })
        if(quantity === 0){
            user.cartItems = user.cartIems.map(item => item.product != productId);
            await user.save();
            return res.status(200).json({
                message: "Product removed from cart successfully"
            })
        }
        existInCart.quantity = quantity;
        await user.save();
        return res.status(200).json({
            message: "Product quantity updated successfully"
        })
    } catch (error) {
        
    }
}

const getAllAddedProducts = async (req, res) => {
    try {
        const user = req.user;
        const cartItems = user.cartItems;
        if(cartItems.isEmpty()) return res.status(404).json({
            message: "No products found in cart"
        })
        const products = await Product.find({
            _id: {
                $in: cartItems.map(item => item.product)
            }
        })
        const cartItemsWithProducts = products.map(item => {
            const cartItem = cartItems.find(cartItem => cartItem.product.toString() === item._id.toString());
            return {
                ...item.toObject(),
                quantity: cartItem.quantity
            }
        })
    } catch (error) {
        console.error("Error getting all added products:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export {
    addToCart,
    removeAllFromCart,
    updateQuantity,
    getAllAddedProducts
}