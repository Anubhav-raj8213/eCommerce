import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {User} from "../models/index.js";
import { ExpressValidator, validationResult } from "express-validator";
import redis from "../config/redis.js";


const register = async(req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({
            errors: errors.array()
        })
        const {name,email,password} = req.body;
        const existingUser =await User.findOne({email});
        if(existingUser) return res.status(400).json({
            message: "User already exists"
        })
        const user = await User.create({
            email,
            name,
            password
        })
        
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            maxAge: 7*24*60*60*1000,
            sameSite:"strict",
            secure: true
        })

        res.cookie("accessToken", accessToken,{
            httpOnly: true,
            maxAge: 15*60*1000,
            sameSite:"strict",
            secure: true
        })

        await redis.set(`refreshToken:${user._id}`, refreshToken, "EX", 7*24*60*60)

        const userResponse = user.toObject();
        delete userResponse.password;

        

        return res.status(201).json({
            message: "User created successfully",
            userResponse,
            refreshToken,
            accessToken
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

const login = async(req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }
        const {email, password} = req.body;

        const user = await User.findOne({email}).select("+password");
        if(!user) return res.status(400).json({
            message: "Invalid email"
        })
        if(! await user.comparePassword(password)) return res.status(400).json({
            message: "Invalid password"
        })

        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();
        redis.set(`refreshToken:${user._id}`, refreshToken, "Ex", 7*24*60*60);

        const userResponse = user.toObject();
        delete userResponse.password;
        res.cookie("refreshToken", refreshToken, {
            httpOnly:true,
            maxAge: 7*24*60*60*1000,
            sameSite: "strict",
            secure: true
        })
        res.cookie("accessToken", accessToken, {
            httpOnly:true,
            maxAge: 15*60*1000,
            sameSite: "strict",
            secure: true
        })
        return res.status(200).json({
            message: "Logged in successfully",
            userResponse,
            refreshToken,
            accessToken
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

const logout = async(req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(200).json({
            message: "Logged out successfully"
        })
        const decoded = jwt.verify(refreshToken,process.env.JWT_SECRET);
        await redis.del(`refreshToken:${decoded.userId}`);
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        return res.status(200).json({
            message: "Logged out successfully"
        })
    }
    catch(error){
        console.log(error);
        req.clearCookie("refreshToken");
        req.clearCookie("accessToken");
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

const refreshToken = async(req,res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401).json({
            message: "Unauthorized"
        })
        const decoded = jwt.verify(refreshToken,process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json({
            message: "Unauthorized"
        })
        const stored = await redis.get(`refreshToken:${decoded.userId}`);
        if(!stored || stored !== refreshToken) return res.status(401).json({
            message: "Unauthorized"
        })
        const user = await User.findById(decoded.userId);
        if(!user) return res.status(401).json({
            message: "Unauthorized"
        })
        res.cookie("accessToken", user.generateAccessToken(), {
            httpOnly:true,
            maxAge: 15*60*1000,
            secure:true,
            sameSite: "strict"
        })
        return res.status(200).json({
            message: "Token refreshed successfully"
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

export {register, login, logout, refreshToken};

