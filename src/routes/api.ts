import { Router } from "express";
const Api1 = Router();

import helloRouter from "./hello/hello.router";
import authentication from "./authentication/authentication.router";
import oauthAuthentication from "./authentication/oauth/oauth.router";
import protectedRouter from "./protected/protected.router";

Api1.use("/health", helloRouter);
Api1.use("/protected", protectedRouter);
Api1.use("/authentication", authentication);
Api1.use("/authentication/oauth", oauthAuthentication);

export = Api1;
