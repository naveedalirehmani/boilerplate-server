const GooglesStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.serializeUser((user, done) => {
  console.log("serializeUser", user);
  done(null, user);
});

passport.deserializeUser((cookie, done) => {
  console.log("deserializeUser", cookie);
  done(null, cookie);
});

//3.
//* this will run after authorization token is verified, profile is user data and accesstoken is athorization token
passport.use(
  new GooglesStrategy(
    {
      callbackURL: "/auth/google/callback",
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRECT,
      passReqToCallback: true,
    },
    function verifyCallback(accessToken, refreshToken, profile, done) {
      console.log("google profile", profile); // this is the object that is being serialized and deserialized in the cookie.
      done(null, profile);
    }
  )
);
