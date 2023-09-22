const { Router } = require("express");
const protectedRouter = Router();

const protectedController = require("../../controller/protected/protected.controller");

protectedRouter.get("/oauth/google", protectedController.sayHello);

module.exports = protectedRouter;
