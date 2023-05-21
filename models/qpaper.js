import mongoose from "mongoose";

const qpaperSchema = new mongoose.Schema({
    year: {
        type: Number,
        require: true
    },
    title: {
        type: String,
        require: true,
        trim: true
    },
    code: {
        type: String,
        require: true,
        trim: true
    },
    subject: {
        type: String,
        require: true,
        trim: true
    },
    fileName: {
        type: String,
        require: true,
        trim: true
    }
}, { timestamps: true })

export default mongoose.model('Qpaper', qpaperSchema);