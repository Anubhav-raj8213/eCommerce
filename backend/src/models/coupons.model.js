import mongoose from "mongoose";

const couponsSchema = new mongoose.Schema({
    code:{
        type: String,
        required: true,
        unique: true
    },
    discountPercentage:{
        type: Number,
        required: true,
        min: [0, "Discount percentage cannot be negative"],
        max: [100, "Discount percentage cannot be greater than 100"]
    },
    expiresAt:{
        type: Date,
        required: true
    },
    isActive:{
        type: Boolean,
        default: true
    },
    userId:{
        type:mongoose.Schema.type.objectId,
        ref: "User"
    }
}, {
    timestamps: true
})

const Coupon = mongoose.model("Coupon", couponsSchema)


export default Coupon;