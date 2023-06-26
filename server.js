const fs = require("fs");
const path = require("path");
const https = require("https");
const express = require("express");
const helmet = require("helmet");
require("dotenv").config();
const passport = require("passport");
const cookieSession = require('cookie-session')
const { Strategy } = require("passport-google-oauth20");

const app = express();

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRECT: process.env.CLIENT_SECRECT,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

const authOptions = {
  callbackURL: "/auth/google/callback", 
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRECT,
};

//3.
//* this will run after authorization token is verified, profile is user data and accesstoken is athorization token
function verifyCallback(accessToken, refreshToken, profile, done) {
  console.log("google profile", profile);
  done(null, profile);
}

passport.use(new Strategy(authOptions, verifyCallback));

app.use(helmet());
app.use(cookieSession({
  name:'cookie-session-1',
  maxAge: 24*60*60*1000,
  keys: [ config.COOKIE_KEY_2, config.COOKIE_KEY_1]
}))
app.use(passport.initialize());

app.use(express.json());
app.use("/files", express.static(path.join(__dirname, "files")));

function checkLoggedIn(request, repsonse, next) {
  const isLoggedIn = true;
  if (!isLoggedIn) {
    return response.status(401).json({
      error: "you must log in",
    });
  }
  next();
}

// 1.
//* this route will request google for a redirect to their authentication profile, we also send clientID and clientSecret here. scope define what user data we are requesting from google, we have also added the scope in google console so we cannot request more then what we initialize setup in console.
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email"],
  })
);

// 2.
//* onces the credentials are verified, google will send authentication code to this route /auth/google/callback which we have also speficied in console, so we cannot add random routes here. this route will receive the authentication token, after that 3 things will happen, we send authentication code + client secret to goole, it responeds back with authorization toke, we use this authorization token to get users data. all this is done by passport.js
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/home",
    session: false,
  }),
  (request, response) => {
    console.log("google called us back");
  }
);

app.get("/failure", (request, repsosne) => [
  response.status(401).json({
    error: "failed to authenticate",
  }),
]);

app.get("/auth/logout", (request, response) => {});

app.get("/secret", checkLoggedIn, (request, response) => {
  response.send("not so secret code is 32!");
});

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "files", "index.html"));
});

app.get("/home", (request, response) => {
  response.sendFile(path.join(__dirname, "files", "home.html"));
});

https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(3000, () => {
    console.log("server is live");
    console.log(`https://localhost:${3000}`);
  });
