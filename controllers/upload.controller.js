const UserModel = require('../models/user.model');
const fs = require('fs');
const { uploadErrors } = require("../utils/errors.utils");
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile); // On utilise writeFile au lieu de pipeline pour le buffer

module.exports.uploadProfil = async (req, res) => {
    try {
        // 1. Vérification de l'existence du fichier
        if (!req.file) {
            throw Error("No file uploaded");
        }

        // 2. CORRECTION : On utilise 'mimetype' (pas detectedMimeType)
        if (
            req.file.mimetype !== 'image/jpeg' &&
            req.file.mimetype !== 'image/jpg' &&
            req.file.mimetype !== 'image/png'
        ) {
            // 3. CORRECTION : Le message doit contenir "invalid file" pour matcher ton utils
            throw Error("invalid file");
        }

        // 4. Vérification taille
        if (req.file.size > 5000000) {
            // Le message doit contenir "max size" pour matcher ton utils
            throw Error("max size");
        }
    } catch (error) {
        const errors = uploadErrors(error);
        return res.status(400).json({ errors });
    }

    // Traitement du nom de fichier
    const fileName = req.body.name + ".jpg";

    try {
        // 5. CORRECTION : Écriture du fichier depuis le Buffer (car multer() est en mémoire)
        await writeFile(
            `${__dirname}/../../FRONTEND/public/uploads/profil/${fileName}`,
            req.file.buffer
        );

        // Mettre à jour l'utilisateur dans la DB
        let user = await UserModel.findByIdAndUpdate(req.body.userId, {
            $set : {
                pictures : `./uploads/profil/${fileName}`
            }
        }, {new: true});
        return res.status(201).send(user);
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};