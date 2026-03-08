import {User, Product, Coupon} from "../models/index.js";

const getCoupon = async(req,res) => {
    try {
        const user = req.user;
        const coupon = await Coupon.find({usserId:user._id, isActive:true});
        return res.status(200).json({
            coupon
        })
    } catch (error) {
        console.error("Error getting coupon:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const validateCoupon = async(req,res) => {
    try {
        const user = req.user;
        const {code} = req.body;
        const coupon = await Coupon.findOne({code,isActive:true});
        if(!coupon) return res.status(404).json({
            message: "Coupon not found"
        })
        if(coupon.userId != user._id) return res.status(403).json({
            message: "You are not authorized to use this coupon"
        })
        if(coupon.expiresAt < new Date()){
            return res.status(400).json({
                message: "Coupon has expired"
            })
        }
        return res.status(200).json({
            message: "Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage
        })
    } catch (error) {
        console.error("Error validating coupon:", error.message); 
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export {
    getCoupon,
    validateCoupon
}