import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    desc:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true,
        min:[0, "Price cannot be negative"]
    },
    category:{
        type: String,
        required: true
    },
    isFeatured:{
        type: Boolean,
        default: false
    },
    quantity:{
        type: Number,
        required: true,
        min:[0, "Quantity cannot be negative"]
    },
    image:{
        type: String,
        required: true
    },
    
},{timestamps:true})

productSchema.methods.toggleFeatured = async function(){
    this.isFeatured = !this.isFeatured;
    return await this.save();
}

const Product = mongoose.model("Product", productSchema);

export default Product;