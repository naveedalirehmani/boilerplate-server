const path = require("path");
const cors = require("cors");
const express = require("express");
const deserializeUser = require('./middlewares/deserializeUsers')
const Api1 = require("./routes/api.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "public")));

app.use(deserializeUser)

app.use("/v1", Api1);


module.exports = app;
