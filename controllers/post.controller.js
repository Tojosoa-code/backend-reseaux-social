const PostModel = require("../models/post.model")
const UserModel = require("../models/user.model")
const ObjectID = require("mongoose").Types.ObjectId

module.exports.createPost = async (req, res) => {
    try {
        const post = await PostModel.create({
            posterId: req.body.posterId,
            message: req.body.message,
            video: req.body.video,
            likers : [],
            comments : [],
        })
        res.status(201).json(post);
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error});
    }
/*
    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        video: req.body.video,
        likers: [],
        comments: [],
    })

    try {
        const post = await newPost.save();
        return res.status(201).json(post);
    } catch (error) {
        console.log(error);
        res.status(400).json({error: error});
    }
 */
}

module.exports.updatePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json({ error: "Post ID unknown : " + req.params.id });
    }

    try {
        const updatePost = await PostModel.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    message: req.body.message,
                }
            },
            {new: true, upsert: false}
        );

        res.status(200).json(updatePost);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.deletePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json({ error: "Post ID unknown" });
    }

    try {
        const post = await PostModel.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.readPost = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({createdAt: -1});
        if (!posts)
            res.status(404).send("Error to get all posts");
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.id)) {
        return res.status(400).json({ error: "Post ID unknown" });
    }

    try {
        await PostModel.findByIdAndUpdate(req.params.id,
            {
                $addToSet: {
                    likers: req.body.id
                }
            }, {new: true}
            )

        const data = await UserModel.findByIdAndUpdate(req.body.id, {
            $addToSet: {
                likes : req.params.id
            }
        }, {new: true})

        res.status(200).json(data);

    } catch (error ) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.unlikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.id)) {
        return res.status(400).json({ error: "User ID unknown" });
    }

    try {
        await PostModel.findByIdAndUpdate(req.params.id,
            {
                $pull: {
                    likers: req.body.id
                }
            }, {new: true}
        )

        const data = await UserModel.findByIdAndUpdate(req.body.id, {
            $pull: {
                likes : req.params.id
            }
        }, {new: true})

        res.status(200).json(data);

    } catch (error ) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.commentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json({ error: "Post ID unknown" });
    }

    try {
        const comment = await PostModel.findByIdAndUpdate(req.params.id, {
            $push: {
                comments : {
                    commenterId : req.body.commenterId,
                    commenterPseudo : req.body.commenterPseudo,
                    text : req.body.text,
                    timestamp : new Date().getTime(),
                }
            }
        }, {new: true}
        )

        res.status(200).json(comment);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

module.exports.editCommentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json({ error: "Post ID unknown" });
    }

    try {

        const post = await PostModel.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const theComment = post.comments.find(com => com._id.equals(req.body.commentId));

        if (!theComment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        theComment.text = req.body.text;

        await post.save()

        res.status(200).json(post);


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.deleteCommentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json({ error: "Post ID unknown" });
    }

    try {
        let post = await PostModel.findByIdAndUpdate(req.params.id, {
            $pull: {
                comments : {
                    _id: req.body.commentId
                }
            }
        }, {new: true}
        )

        if (!post) {
            return res.status(404).json({ error: "Error to delete comment" });
        }

        res.status(200).json({message: "Comment deleted successfully"});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}