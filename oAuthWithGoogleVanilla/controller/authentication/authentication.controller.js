const axios = require("axios");

class GoogleOAuthHelper {
  async getOAuthTokens({ code }) {
    const url = "https://oauth2.googleapis.com/token";

    const values = {
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: process.env.OAUTH_GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    };

    const qs = new URLSearchParams(values);

    try {
      const response = await axios.post(url, qs.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data;
    } catch (error) {
      console.error(error.response.data.error);
      console.error(error, "Failed to fetch Google Oauth Tokens");
      throw new Error(error.message);
    }
  }

  async getGoogleUser({ id_token, access_token }) {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error, "Error fetching Google user");
      throw new Error(error.message);
    }
  }
}

const GoogleoAuthHelperClass = new GoogleOAuthHelper();

async function oAuthHandler(request, response) {

    // get the code from qs
    const code = request.query.code;
    console.log({ code });
    
    
    try {
    // get the id and access token with the code
    const { id_token, access_token } =
      await GoogleoAuthHelperClass.getOAuthTokens({ code });
    console.log({ id_token, access_token });

    // get user with tokens
    const googleUser = await GoogleoAuthHelperClass.getGoogleUser({
      id_token,
      access_token,
    });
    console.log({ googleUser });

    //jwt.decode(id_token);
    if (!googleUser.verified_email) {
      return response.status(403).send("Google account is not verified");
    }

    response.status("200").send("completed");
    // // upsert the user
    // const user = await findAndUpdateUser(
    //   {
    //     email: googleUser.email,
    //   },
    //   {
    //     email: googleUser.email,
    //     name: googleUser.name,
    //     picture: googleUser.picture,
    //   },
    //   {
    //     upsert: true,
    //     new: true,
    //   }
    // );

    // // create a session
    // // create a session
    // const session = await createSession(user._id, req.get("user-agent") || "");

    // // create an access token

    // const accessToken = signJwt(
    //   { ...user.toJSON(), session: session._id },
    //   { expiresIn: config.get("accessTokenTtl") } // 15 minutes
    // );

    // // create a refresh token
    // const refreshToken = signJwt(
    //   { ...user.toJSON(), session: session._id },
    //   { expiresIn: config.get("refreshTokenTtl") } // 1 year
    // );

    // // set cookies
    // res.cookie("accessToken", accessToken, accessTokenCookieOptions);

    // res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    // redirect back to client
    // res.redirect(config.get("origin"));
  } catch (error) {
    console.error(error, "Failed to authorize Google user");
    // return response.sendFile('error.html');
  }
}

async function loginHandler(request, response) {
  console.log("loginrequest");
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options = {
    redirect_uri: process.env.OAUTH_GOOGLE_REDIRECT_URI,
    client_id: process.env.CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);
  console.log({ qs });
  const consentScreenURI = `${rootUrl}?${qs.toString()}`;

  response.redirect(consentScreenURI);
}

module.exports = {
  oAuthHandler,
  loginHandler,
};
