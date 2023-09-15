const { Router } = require("express");
const helloRouter = Router();

const helloController = require("../../controller/hello/hello.controller");

helloRouter.get("/", helloController.sayHello);

module.exports = helloRouter;