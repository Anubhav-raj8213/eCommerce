import {User, Product, Coupon, Order} from "../models/index.js";
import stripe from "../config/stripe.js";


const createCheckoutSession = async (req, res) => {
    try {
        const {products} = req.body;
        const {couponCode} = req.body;
        const user = req.user;
        if(!user) return res.status(401).json({
            message: "Unauthorized"
        })
        if(!Array.isArray(products) || products.length === 0) return res.status(400).json({
            message: "No products selected"
        })
        let totalAmount = 0;
        let lineItems = products.map(product => {
            let amount = product.price * 100;
            let quantity = products.quantity;
            totalAmount += amount*quantity;
            return {
                priceData : {
                    currency: "inr",
                    product_data: {
                        name: product.name,
                        images: [product.image]
                    },
                    unit_amount: amount
                }
            }
        })
        
        let coupon = null;
        if(!couponCode && totalAmount >= 20000){
            coupon = await createNewCoupon(user._id);
            couponCode = coupon.code
        }
        
        if(couponCode){
            coupon = await Coupon.findOne({code:couponCode, isActive:true});
            if(!coupon || coupon.userId != user._id || coupon.expiresAt < new Date()) return res.status(404).json({
                message: "Coupon not found"
            })
            totalAmount = Math.round(totalAmount - (totalAmount*(coupon.discountPercentage/100)));
        }

        const session = await stripe.checkout.sessions.create({
            paymentMethodTypes: ["card", "paypal", "upi"],
            lineItems,
            mode: "payment",
            successUrl:"http://localhost:3000/purchase-success?session_id={CHECKOUT SESSION ID)",
            cancelUrl: "http://localhost:3000/cancel",
            discount: coupon ? [
                {
                    coupon: await createCoupon(coupon.discountPercentage)
                },
            ]:[],
            metaData: {
                userId: user._id,
                couponCode: coupon ? coupon.code : ""
            }
        })

        if(totalAmount >= 20000) await createNewCoupon(user._id);
    } catch (error) {
        console.error("Error creating checkout session:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function createCoupon(discountPercentage){
    const coupon = await stripe.coupons.create({
        percent_off: discountPercentage,
        duration: "once"
    })
    return coupon.id;
}

async function createNewCoupon(userId){
    const coupon = await coupon.create({
        code:"GIFT"+Math.random().toString(36).substring(7),
        discountPercentage: 10,
        expiresAt: new Date(Date.now() + 30*24*60*60*1000),
        userId
    })
    return coupon;
}

const paymentVerification = async (req, res) => {

}

export {
    createCheckoutSession,
    paymentVerification
}