const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const keys = require("../config/keys");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    //
    if (!authorization) {
        return res.status(401).send({ error: "You must be logged in" });
    }

    const authToken = authorization.replace("Bearer ", "");

    jwt.verify(authToken, keys.jwtKey, async (err, payload) => {
        if (err) {
            return res.status(401).send({ error: "You must be logged in" });
        }

        const { userId } = payload;
        const user = await User.findById(userId);
        req.user = user;
        next(); // continue
    });
};
