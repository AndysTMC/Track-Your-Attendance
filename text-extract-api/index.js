const express = require('express');
const multer = require('multer');
const diskStorage = multer.diskStorage;
const fs = require('fs');
const unlinkSync = fs.unlinkSync;
const Tesseract = require('tesseract.js');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const storage = diskStorage({
    destination: (req, file, cb) => {
        cb(null, './');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

let worker = null;

const initializeWorker = async() => {
    if (worker != null && worker !== undefined) {
        return;
    }
    worker = await Tesseract.createWorker();
}

initializeWorker();

app.get("/", (req, res) => {
    console.log('GET /');
    res.send("Express on Vercel to extract texts from images");
});

app.post("/extract", upload.single("file"), async (req, res) => {
    console.log('POST /extract');
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const filePath = path.join('./', req.file.filename);
        const { data: { text } } = await worker.recognize(filePath);
        const cleanText = text.replace(/\n/g, '');
        res.json({
            captchaText: cleanText,
        });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Failed to extract text' });
    }
});

app.listen(port, () => {
    console.log('Server is running on http://localhost:3000');
});

module.exports = app;