import * as AuthSession from "expo-auth-session";
import { useEffect } from "react";

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

export function useGoogleAuth() {
    const redirectUri = AuthSession.makeRedirectUri();
    console.log(redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId:
        "498280239048-5r53q1rbk5fkcc2ghbr03julb16tr08j.apps.googleusercontent.com",
      scopes: ["openid", "profile", "email"],
      redirectUri,
      responseType: "code",
    },
    discovery,
  );

  return { request, response, promptAsync, redirectUri };
}

export default useGoogleAuth;