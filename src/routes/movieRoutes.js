// for testing Movies / removal and addition
const mongoose = require("mongoose");
const express = require("express");
const User = mongoose.model("User");

const router = express.Router();

router.post("/save-movie", async (req, res) => {
    // user makes request
    // verify request
    // find user in db
    // update user in db
    const { email, movie } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send({ Error: "Email not found" });
    }

    try {
        // looping over the user movies.
        // if there is a result => return early
        // otherwise we save the result to the db
        const result = user.movies.find((element) => element.id === movie.id);
        if (result) {
            return res.status(400).send({ error: "Movie already in library" });
        }
        await User.updateOne(user, { $addToSet: { movies: movie } });
        await user.save();
        res.status(200).send({
            movie: movie,
            msg: "Movie was added to library",
        });
    } catch (error) {
        console.log(error);
        return res.status(422).send({ error: "Something went wrong" });
    }
});
router.post("/remove-movie", async (req, res) => {
    const { email, movie } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send({ Error: "User not found" });
    }
    const result = user.movies.find((element) => element.id === movie.id);
    if (!result) {
        return res.status(404).send({ msg: "No movie was found in db" });
    }

    try {
        const index = user.movies.findIndex((el) => el.id === movie.id);
        // the $pull method removes from an existing array all instances of a value
        await User.updateOne(user, { $pull: { movies: user.movies[index] } });
        await user.save();
        res.status(200).send({
            movies: user.movies,
            msg: "Movie was deleted!",
        });
    } catch (error) {
        console.log(error);
        return res.status(422).send({ error: "Something went wrong" });
    }
});

// for more mongo array mathods read:
// https://www.mongodb.com/docs/manual/reference/operator/update-array/
module.exports = router;
