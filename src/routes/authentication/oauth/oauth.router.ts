import { Router } from "express";

import GoogleAuthController from "../../../controller/authentication/oauth/google.controller";
import FacebookAuthController from "../../../controller/authentication/oauth/facebook.controller";

const oAuthRouter = Router();

// oAuth google
oAuthRouter.get("/google", (request, response) =>
  GoogleAuthController.redirectToGoogleAuth(request, response),
);
//callback
oAuthRouter.get("/google/callback", (request, response) =>
  GoogleAuthController.handleGoogleCallback(request, response),
);

// oAuth facebook
oAuthRouter.get("/facebook", (request, response) =>
  FacebookAuthController.redirectToFacebookAuth(request, response),
);
//callback
oAuthRouter.get("/facebook/callback", (request, response) =>
  FacebookAuthController.handleFacebookCallback(request, response),
);

export default oAuthRouter;
