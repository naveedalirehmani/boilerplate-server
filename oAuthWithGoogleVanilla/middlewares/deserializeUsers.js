import { verifyJwt } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../service/session.service";

async function deserializeUser  (
  request,
  response,
  next
) {
  const accessToken = request.cookies.accessToken;

  const refreshToken = request.cookies.refreshToken

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded) {
    response.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      response.setHeader("x-access-token", newAccessToken);

      response.cookie("accessToken", newAccessToken, {
        maxAge: 900000, // 15 mins
        httpOnly: true,
        domain: "localhost",
        path: "/",
        sameSite: "strict",
        secure: false,
      });
    }

    const result = verifyJwt(newAccessToken);

    response.locals.user = result.decoded;
    return next();
  }

  return next();
};

module.exports = deserializeUser;
