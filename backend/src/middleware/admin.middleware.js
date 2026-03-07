import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const adminMiddleware = async(req,res,next) => {
    try {
        const user = req.user;
        if(user && user.role === "admin") next();
        return res.status(403).json({
            message: "Forbidden access, only admin can access this route"
        })
    } catch (error) {
        console.error("Admin Middleware Error:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export default adminMiddleware;