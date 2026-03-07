import jwt from "jsonwebtoken";
import {User} from "../models/index.js"

const authMiddleware = async(req,res,next) => {
    try{
        console.log("authmiddleware called");
        const accessToken = req.cookies.accessToken;
        if(!accessToken) return res.status(401).json({
            message: "Unauthorized"
        })
        const decoded = jwt.verify(accessToken,process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if(!user) return res.status(401).json({
            message: "Unauthorized"
        })
        req.user = user;
        next();
    }
    catch(error){
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ 
                message: "Access token expired", 
                code: "TOKEN_EXPIRED" // Send a code so the frontend knows to refresh
            });
        }
        
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

export default authMiddleware;