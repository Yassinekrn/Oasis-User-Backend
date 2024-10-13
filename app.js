let createError = require("http-errors");
let express = require("express");
let path = require("path");
let logger = require("morgan");
let mongoose = require("mongoose");
let cors = require("cors");
require("dotenv").config();
let cookieParser = require("cookie-parser");

const swaggerSetup = require("./swagger/swaggerConfig");

let scholarshipRouter = require("./routes/scholarship");
let authRouter = require("./routes/auth");
let userRouter = require("./routes/user");

let app = express();

// db connection
const mongoDb = process.env.MONGODB_URI;
mongoose.connect(mongoDb, {});
const db = mongoose.connection;
db.on("open", () => {
    console.log("Connected to MongoDB");
});
db.on("error", console.error.bind(console, "mongo connection error"));

// cors
app.use(
    cors({
        origin: process.env.FRONTEND_URL, // Allow requests from this origin
        optionsSuccessStatus: 200, // legacy browsers choke on 204
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Swagger
swaggerSetup(app);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// routes
app.use("/scholarships", scholarshipRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    const errorDetails = process.env.NODE_ENV === "development" ? err : {};

    res.status(err.status || 500).json({
        message: err.message,
        error: errorDetails,
    });
});

module.exports = app;
