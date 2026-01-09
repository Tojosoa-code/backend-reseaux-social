const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema(
    {
        pseudo : {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50,
            trim: true,
            unique: true
        },
        email : {
            type: String,
            required: true,
            validate: [isEmail],
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            max: 1024,
            minlength: 6,
        },
        bio : {
            type: String,
            max: 1024,
        },
        followers : {
            type: [String],
        },
        following : {
            type: [String],
        },
        likes : {
            type: [String],
        },
        pictures : {
            type : String,
            default : "./uploads/profil/avatar.png",
        }
    },
    { timestamps: true }
)

userSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw new Error("Invalid Password")
    }
    throw new Error("Invalid Email");
}

const UserModel = mongoose.model("User", userSchema)
module.exports = UserModel