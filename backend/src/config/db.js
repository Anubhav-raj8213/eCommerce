import mongoose from "mongoose";

const connectDB = async () => {
    try{
        mongoose.connection.on("disconnected", ()=>{
            console.log("MongoDB disconnected");
        })
        mongoose.connection.on("connected", ()=>{
            console.log("MongoDB connected");
        })

        await mongoose.connect(process.env.DB_URI, {
            family: 4, // Force IPv4
        });
    }
    catch(error){
        console.error("Error connecting to MongoDB:");
        console.error(error); // Log the full error object
        process.exit(1);
    }
}

export default connectDB;