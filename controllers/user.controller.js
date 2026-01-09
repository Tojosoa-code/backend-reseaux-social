const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.getUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json({ error: "User ID unknown : " + req.params.id });
    }

    try {
        const user = await UserModel.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log("Error getting user:", error);
        res.status(500).json({ error: error.message });
    }
}

module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json({ error: "User ID unknown : " + req.params.id });
    }

    try {
        const updateUser = await UserModel.findOneAndUpdate(
            {_id: req.params.id},
            {
                $set: {
                    bio: req.body.bio,
                }
            },
            {new: true, upsert: false}
        );

        res.status(200).json(updateUser);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).json({ error: "User ID unknown" });
    }

    try {
        const user = await UserModel.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.follow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)) {
        return res.status(400).json({ error: "User ID unknown" });
    }

    try {
        // AJouter à la liste des followers
        const follow = await UserModel.findByIdAndUpdate(req.params.id,
            {
                $addToSet: {following : req.body.idToFollow}
            },
            {
                new: true, upsert: false
            }
        )
        res.status(201).json(follow);

        // AJouter à la liste des following
        await UserModel.findByIdAndUpdate(req.body.idToFollow,
            {
                $addToSet: {followers : req.params.id}
            },
            {
                new: true, upsert: false
            }
        )
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.unfollow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnFollow)) {
        return res.status(400).json({ error: "User ID unknown" });
    }

    try {
        const unfollow = await UserModel.findByIdAndUpdate(req.params.id,
            {
                $pull: {following : req.body.idToUnFollow}
            },
            {
                new: true, upsert: false
            }
        )
        res.status(201).json(unfollow);

        await UserModel.findByIdAndUpdate(req.body.idToUnFollow,
            {
                $pull: {followers : req.params.id}
            },
            {
                new: true, upsert: false
            }
        )
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}