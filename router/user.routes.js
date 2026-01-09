const express = require('express')
const router = express.Router()
const UserController = require("../controllers/user.controller");
const AuthController = require("../controllers/auth.controller");
const UploadController = require("../controllers/upload.controller");
const multer = require("multer")
const upload = multer()

// AUTHENTIFICATON
router.post('/register', AuthController.signUp)
router.post('/login', AuthController.signIn)
router.get('/logout', AuthController.logout)

// CRUD USER
router.get('/', UserController.getAllUsers)
router.get("/:id", UserController.getUser)
router.put("/:id", UserController.updateUser)
router.delete("/:id", UserController.deleteUser)
router.patch("/follow/:id", UserController.follow)
router.patch("/unfollow/:id", UserController.unfollow)

// UPLOAD IMAGE
router.post('/upload', upload.single("file"), UploadController.uploadProfil)

module.exports = router;