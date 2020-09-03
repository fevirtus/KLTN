const express = require('express');
const fs = require('fs');

const upload = require('../cloudinary/multer')
const cloudinary = require('../cloudinary/cloudinary')
const db = require('../db');

const router = express.Router();

router.post('/upload', upload.array('pictures'), async (req, res) => {
    const uploader = async (path) => await cloudinary.uploads(path, 'pet-next-generation');

    const files = req.files
    const urls = []
    for (const file of files) {
        const { path } = file;
        const newPath = await (uploader(path))
        urls.push(newPath)
        fs.unlinkSync(path)
    }
    await insertToDb(req.body.breed, urls)
    console.log(urls)
    res.status(200).json(urls)

})

const insertToDb = async (breed, urls) => {
    let sql = `INSERT INTO pet_generation(breed, img) VALUES `;
    let values = urls.map(url => `(${breed},'${url.url}')`).join(',')
    return await db.query(sql + values)
}
module.exports = router