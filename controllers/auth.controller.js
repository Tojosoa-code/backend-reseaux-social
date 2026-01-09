const UserModel = require("../models/user.model")
const jwt = require("jsonwebtoken");
const {signUpErrors, signInErrors} = require("../utils/errors.utils");

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge,
    })
}

module.exports.signUp = async (req, res) => {
    const {pseudo, email, password} = req.body;

    try {
        const user = await UserModel.create({pseudo, email, password});
        res.status(201).json(user);
    } catch (error) {
        const errors = signUpErrors(error)
        res.status(200).send({errors})
    }
}

module.exports.signIn = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await UserModel.login(email, password);
        const token = await createToken(user._id);
        res.cookie('token', token, { httpOnly: true , maxAge: maxAge });
        res.status(200).json({
            user : user._id,
            token : token
        })
    } catch (error) {
        const errors = signInErrors(error)
        res.status(200).send({errors});
    }

}

module.exports.logout = async (req, res) => {
    res.cookie('token', '', { maxAge: 1 });
    res.redirect('/');
}