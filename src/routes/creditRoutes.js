// for testing credit / removal and addition
const mongoose = require("mongoose");
const express = require("express");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const requireAuth = require("../middlewares/requireAuth");
const keys = require("../config/keys");

const router = express.Router();

router.post("/add-credits", requireAuth, async (req, res) => {
    // user makes request
    // verify user credentials , token/password, email
    // error checking
    // find user in db
    // find and update db
    // if user exist update credits
    //
    const { email, password, credits } = req.body;
    if (!email || !password) {
        return res
            .status(422)
            .send({ error: "Must provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send({ Error: "Email not found" });
    }
    // console.log("amount of credits:", credits);

    try {
        await user.comparePassword(password);
        const token = jwt.sign({ userId: user._id }, keys.jwtKey);
        await User.updateOne(user, { credits: user.credits + credits });

        await user.save();
        // sending user.credits + ADDED credits Because 'user.credits' refers to the current values//stale values that were fetch during the initial query
        res.send({ token, email: user.email, credits: user.credits + credits });
    } catch (error) {
        console.log(error);
        return res.status(404).send({ error: "Something Went Wrong" });
    }
});
router.post("/remove-credits", async (req, res) => {
    // get user email
    // find user in db
    // update user credits
    const { email, credits, token } = req.body;
    const user = await User.findOne({ email });
    try {
        await User.updateOne(user, { credits: user.credits - credits });
        await user.save();
        res.send({ token, email: user.email, credits: user.credits - credits });
    } catch (e) {
        return res.status(404).send({ error: "Something Went Wrong" });
    }
});

module.exports = router;
