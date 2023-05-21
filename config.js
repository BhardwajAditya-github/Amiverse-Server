import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;