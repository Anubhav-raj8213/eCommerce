import {User, Product} from "../models/index.js"
import redis from "../config/redis.js";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import cloudinary from "../config/cloudinary.js";




const getAllProducts = async(req,res) => {
    try {
        const products = await Product.find({});
        return res.status(200).json({
            products
        })
    } catch (error) {
        console.error("Error getting all products:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getFeaturedProducts = async(req,res) => {
    try {
        const stored = await redis.get(`featuredProducts`);
        if(stored){
            const products = JSON.parse(stored);
            return res.status(200).json({
                products
            })
        }
        const products = await Product.find({isFeatured:true}).lean();
        if(!products) return res.status(404).json({
            message: "No featured products found"
        });
        await redis.set(`featuredProducts`, JSON.stringify(products));
        return res.status(200).json({
            products
        });
    } catch (error) {
        console.error("Error getting featured products:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const addProduct = async(req,res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({
            errors: errors.array()
        })
        const {name,desc,price,category,quantity,image} = req.body;
        let cloudinaryResponse = null;
        if(image){
            cloudinaryResponse = await cloudinary.uploader.upload(image,{folders:"products"})
        }
        const product = await Product.create({
            name,
            desc,
            price,
            category,
            quantity,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : ""
        })
        return res.status(201).json({
            message: "Product added successfully",
            product
        })
    } catch (error) {
        console.error("Error adding product:", error.message);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const deleteProduct = async(req,res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product) return res.status(404).json({
            message: "Product not found"
        })
        const publicid = product.image.split("/").pop().split("*")[0];
        try {
            await cloudinary.uploader.destroy(publicid);
            console.log("Image deleted from cloudinary");
        } catch (error) {
            console.log("Error deleting image from cloudinary:", error.message);
        }
        await Product.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: "Product deleted successfully"
        })
    } catch (error) {
        console.log("Error deleting product:", error.message);
        return res.status(500).json({
            message: "Internal Server Error while deleting product"
        })
    }
}

const getRecommendations = async(req,res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: { size: 5 }
            },
            {
                  $project: { 
                    name: 1, 
                    desc: 1, 
                    price: 1, 
                    image: 1, 
                    _id: 1
                }
            }
        ]);
        return res.json(products);
    } catch (error) {
        console.error("Error getting recommendations:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


const getProductsByCategory = async(req,res) => {
    try {
        const category = req.params.category;
        const products = await Product.find({category});
        if(!products) return res.status(404).json({
            message: "No products found"
        })
        return res.status(200).json({
            products
        })
    } catch (error) {
        console.log("Error getting products by category:", error.message);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


const toggleFeatured = async(req,res) => {
    try {
        const product = await Product.findById(req.params.id);
        product.toggleFeatured();
        await updateFeaturedProductsCache();
        return res.status(200).json({
            message: "Product toggled successfully"
        })
    } catch (error) {
        console.error("Error toggling featured product:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateFeaturedProductsCache = async function(){
        try {
            const featuredProducts = await Product.find({isFeatured:true}).lean();
            await redis.set(`featuredProducts`, JSON.stringify(featuredProducts));
        } catch (error) {
            console.error("Error updating featured products cache:", error.message);
            throw error;
        }
}

export { 
    getAllProducts,
    getFeaturedProducts,
    addProduct,
    deleteProduct,
    getRecommendations,
    getProductsByCategory,
    toggleFeatured
 };