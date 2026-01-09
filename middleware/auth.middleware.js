const jwt = require('jsonwebtoken');
const UserModel = require("../models/user.model");

module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                res.locals.user = null;
                res.cookie('token', '', { maxAge: 1 });
                return next();
            }

            try {
                const user = await UserModel.findById(decoded.id);
                res.locals.user = user;
                console.log(res.locals.user);
            } catch (error) {
                res.locals.user = null;
            }

            next();
        });
    } else {
        console.log('No token !!!');
        res.locals.user = null;
        next();
    }
};

module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                console.log(err);
            } else {
                console.log('decoded token ' + decoded);
                next()
            }
        })
    } else {
        console.log('No token !');
    }
}
