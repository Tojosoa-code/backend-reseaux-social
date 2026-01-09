const express = require('express');
const router = express.Router()
const PostController = require("../controllers/post.controller")
const multer = require("multer")
const upload = multer()

router.get('/', PostController.readPost)
router.post('/', upload.single("file"), PostController.createPost)
router.put('/:id', PostController.updatePost)
router.delete('/:id', PostController.deletePost)

// LIKE ROUTE
router.patch('/like_post/:id', PostController.likePost)
router.patch('/unlike_post/:id', PostController.unlikePost)

// COMMENT ROUTE
router.patch('/comment_post/:id', PostController.commentPost)
router.patch('/edit_comment_post/:id', PostController.editCommentPost)
router.patch('/delete_comment_post/:id', PostController.deleteCommentPost)


module.exports = router;