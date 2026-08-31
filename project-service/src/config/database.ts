import mongoose from "mongoose";

export async function  connectDb(){
    try {
        await mongoose.connect("mongodb://0.0.0.0/loveDb")
        console.log("connected to mongoDb")
    } catch (error) {
        console.log("Error in connecting mongoDb")
    }
}