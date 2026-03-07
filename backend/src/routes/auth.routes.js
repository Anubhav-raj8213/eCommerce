import express from 'express';
import {register, login, logout, refreshToken} from "../controllers/auth.controllers.js";
import {body} from "express-validator";

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


export default router;