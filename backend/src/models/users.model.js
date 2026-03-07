import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        trim: true
    },
    password:{
        type: String,
        required: true,
        minlength:[6, "Password must be at least 6 characters long"],
        select: false
    },
    cartItems:[
        {
            quantity:{
                type: Number,
                default: 1,
            },
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            }
        }
    ],
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, {
    timestamps: true,
})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) next();

    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    }
    catch(error){
        next(error);
    }
})

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {userId:this._id},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {userId:this._id},
        process.env.JWT_SECRET,
        {expiresIn: "15m"}
    )
}




const User = mongoose.model("User", userSchema);

export default User;