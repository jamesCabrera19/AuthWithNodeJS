require("./src/models/User");
const express = require("express");
const cors = require("cors"); //
const mongoose = require("mongoose");
const keys = require("./config/keys");
const authRoute = require("./routes/authRoutes");
const creditRoutes = require("./routes/creditRoutes");
const movieRoute = require("./routes/moviesRoutes");
const requireAuth = require("./middlewares/requireAuth");

mongoose.connect(keys.mongoURI);
const app = express();
//
app.use(cors());
app.use(express.json()); // parser
app.use(authRoute);
app.use(creditRoutes);
app.use(movieRoute);

app.get("/user", requireAuth, (req, res) => {
    res.send(`${req.user}`);
});
app.get("/", (req, res) => {
    res.send("Hello, Welcome to Butters Movie Auth Service");
});

app.listen(process.env.PORT || 3001, () => console.log("Server is running..."));
