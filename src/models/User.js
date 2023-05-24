const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// const initProps = {
//     movie: {
//         adult: false,
//         backdrop_path: "/5P8SmMzSNYikXpxil6BYzJ16611.jpg",
//         genre_ids: Array.from([28, 80, 18]),
//         id: 414906,
//         original_language: "en",
//         original_title: "The Batman",
//         overview:
//             "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
//         popularity: 4598.244,
//         poster_path: "/74xTEgt7R36Fpooo50r9T25onhq.jpg",
//         release_date: "2022-03-01",
//         title: "The Batman",
//         video: false,
//         vote_average: 8.2,
//         vote_count: 666,
//     },
//     // addtoset: adds the value to the db if the value doesnt exist
//     // [{}]
// };
const moviesSchema = new mongoose.Schema({
    adult: Boolean,
    backdrop_path: String,
    genre_ids: [Number],
    id: Number,
    original_language: String,
    original_title: String,
    overview: String,
    popularity: Number,
    poster_path: String,
    release_date: String,
    title: String,
    video: Boolean,
    vote_average: Number,
    vote_count: Number,
    // default: initProps,
});

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    credits: { type: Number, default: 1 },
    movies: [moviesSchema], //
});

// Hashing the password
userSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        //
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            //
            user.password = hash;
            next();
        });
    });
});

// creating custom function
// comparing user entered password with DB stored password
userSchema.methods.comparePassword = function (candidatePassword) {
    const user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err) return reject(err);
            //
            if (!isMatch) return reject(err);
            //
            resolve(true);
        });
    });
};

mongoose.model("User", userSchema);
