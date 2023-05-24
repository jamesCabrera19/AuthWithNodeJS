const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const User = mongoose.model("User");
const router = express.Router();

router.post("/signup", async (req, res) => {
    // req.body = { email: 'test@test.com', password: 'password123' }
    const { email, password } = req.body;
    //

    try {
        const user = new User({ email, password });
        await user.save();
        const token = jwt.sign({ userId: user._id }, keys.jwtKey);

        //
        res.send({
            token,
            email: user.email,
            credits: user.credits,
            movies: user.movies,
        }); // login token
    } catch (error) {
        return res.status(422).send(error.message); // if error code ends here
    }
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(422)
            .send({ error: "Must provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send({ Error: "Email not found" });
    }

    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, keys.jwtKey);

        res.send({
            token,
            email: user.email,
            credits: user.credits,
            movies: user.movies,
        }); // login token
    } catch (error) {
        return res.status(422).send({ error: "Invalid Password or Email" });
    }
});

module.exports = router;
