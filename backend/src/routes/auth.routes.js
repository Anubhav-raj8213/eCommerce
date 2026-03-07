import express from 'express';
import {register, login, logout, refreshToken, getProfile} from "../controllers/auth.controllers.js";
import {body} from "express-validator";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long")
],
     register);
router.post("/login",[
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required")
], login);
router.post("/logout", logout);
router.post("/refreshToken", refreshToken);
router.get("/profile", authMiddleware, getProfile);


export default router;