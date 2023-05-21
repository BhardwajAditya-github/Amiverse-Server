import express from "express";
import multer from "multer";
import connectDB from "./config.js";
import paperModel from './models/qpaper.js';
import cors from 'cors';
import ejs from 'ejs';
import dotenv from 'dotenv';

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.use(cors());
dotenv.config()

const multerStorage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const fileName = file.originalname;
        cb(null, fileName);
    }
});

const upload = multer({ storage: multerStorage });
connectDB();
app.use('/uploads', express.static("uploads"));
app.post("/contribute", upload.single('file'), (req, res) => {
    try {
        const { year, title, code, subject } = req.body;
        const file = req.file;

        if (!year || !title || !code || !subject || !file) {
            return res.status(400).send({
                success: false,
                message: "One or more required fields are missing"
            });
        }

        const fileName = file.filename; // Get the generated filename

        const paper = new paperModel({ year, title, code, subject, fileName }); // Store the filename in the database
        paper.save();

        res.status(200).send({
            success: true,
            message: "File Uploaded Successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }
});


app.get("/getPaper", async (req, res) => {
    try {
        const qpaper = await paperModel.find({}).sort({ createdAt: -1 }).limit(7);
        res.status(200).send({
            success: true,
            message: "Question Papers Retrieved",
            data: qpaper
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }
})

app.get("/getPapers", (req, res) => {
    const { searchQuery } = req.query;
    let query = {};

    if (searchQuery) {
        query = {
            $or: [
                { title: { $regex: searchQuery, $options: "i" } },
                { subject: { $regex: searchQuery, $options: "i" } }
            ]
        };
    }

    paperModel
        .find(query)
        .then((papers) => {
            res.status(200).send({
                success: true,
                message: "Question Papers Retrieved",
                data: papers
            });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Internal Server Error"
            });
        });
});


app.get("/Paper", async (req, res) => {
    try {
        const { title } = req.query;
        console.log(title)
        let query = {};

        if (title) {
            query = { title: { $regex: title, $options: 'i' } };
        }

        const qpaper = await paperModel.find(query).sort({ createdAt: -1 }).limit(7);
        const fileNames = qpaper.map(paper => paper.fileName);

        res.status(200).send({
            success: true,
            message: "Question Papers Retrieved",
            data: fileNames
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }
});

app.get("/", (req, res) => {
    res.render("home");
})
app.listen("3001", () => { console.log("Server started at port 3001") })
