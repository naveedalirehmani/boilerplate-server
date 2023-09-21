const { Router } = require("express");
const authentication = Router();

const googleoAuthController = require("../../controller/authentication/authentication.controller");

authentication.get("/oauth/google", googleoAuthController.oAuthHandler);
authentication.get("/oauth/google/login", googleoAuthController.loginHandler);

module.exports = authentication;