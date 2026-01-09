const UserModel = require('../models/user.model')
const fs = require('fs');
const {promisify} = require('util');
const pipeline = promisify(require('stream').pipeline)

module.exports.uploadProfil = async (req, res) => {
    try {
        if (
            req.file.detectedMimeType !== 'image/jpeg' &&
            req.file.detectedMimeType !== 'image/jpg' &&
            req.file.detectedMimeType !== 'image/png'
        ) {
            throw Error('Only image file types allowed');
        }

        if (req.file.size > 500000) throw Error('File size is too large');

        const fileName = req.body.name + ".jpg";
        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../../FRONTEND/public/uploads/profil/${fileName}`,
            )
        )

    } catch (error) {
        res.status(500).send({error: error.message})
    }
}