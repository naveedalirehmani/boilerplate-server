const { Router } = require("express");
const Api1 = Router();

const helloRouter = require("./hello/hello.router.js");
const authentication = require("./authentication/authentication.router.js");
const protected = require("./protected/protected.router.js");

Api1.use("/hello", helloRouter);
Api1.use("/authentication", authentication);
Api1.use("/protected", , protected);

module.exports = Api1;
