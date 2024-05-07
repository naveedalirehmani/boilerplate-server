import { Request, Response } from "express";
import axios from "axios";
import { findOrCreateUser } from "../../../model/authencation/oauth/oauth.model";
import { setUserCookies } from "../../../utils/auth.utils";
import {
  ResponseStatus,
  ResponseMessages,
} from "../../../types/enums/responseEnums";
import { UserType } from "@prisma/client";

class FacebookAuthController {
  private static appId: string = process.env.FACEBOOK_APP_ID!;
  private static appSecret: string = process.env.FACEBOOK_APP_SECRET!;
  private static redirectUri: string = `${process.env.REDIRECT_URI}/facebook/callback`;
  private static readonly AUTH_URL =
    "https://www.facebook.com/v10.0/dialog/oauth";
  private static readonly TOKEN_URL =
    "https://graph.facebook.com/v10.0/oauth/access_token";
  private static readonly USER_INFO_URL = "https://graph.facebook.com/me";

  public static async redirectToFacebookAuth(
    request: Request,
    response: Response,
  ): Promise<void> {
    const authUrl = `${FacebookAuthController.AUTH_URL}?client_id=${FacebookAuthController.appId}&redirect_uri=${FacebookAuthController.redirectUri}&state={st=state123abc,ds=123456789}&scope=email`;
    response.redirect(authUrl);
  }

  public static async handleFacebookCallback(
    request: Request,
    response: Response,
  ): Promise<void> {
    const code = request.query.code as string;
    try {
      const tokenResponse = await axios.get(FacebookAuthController.TOKEN_URL, {
        params: {
          client_id: FacebookAuthController.appId,
          redirect_uri: FacebookAuthController.redirectUri,
          client_secret: FacebookAuthController.appSecret,
          code,
        },
      });

      const userInfoResponse = await axios.get(
        `${FacebookAuthController.USER_INFO_URL}?fields=id,name,email&access_token=${tokenResponse.data.access_token}`,
      );

      const user = await findOrCreateUser(
        userInfoResponse.data.email,
        UserType.FACEBOOK_USER,
      );

      setUserCookies(response, user);

      response
        .status(ResponseStatus.Success)
        .send({ message: ResponseMessages.Success });
    } catch (error) {
      console.error("Error handling Facebook callback:", error);
      response
        .status(ResponseStatus.InternalServerError)
        .json({ message: ResponseMessages.InternalServerError });
    }
  }
}

export default FacebookAuthController;
