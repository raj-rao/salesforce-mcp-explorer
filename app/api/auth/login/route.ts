import { NextResponse } from "next/server";
import { generateCodeVerifier, generateCodeChallenge } from "@/lib/pkce";

export async function GET() {
  const verifier = generateCodeVerifier();
  console.log("Generated PKCE verifier:", verifier);
  const challenge = generateCodeChallenge(verifier);

  const authUrl = new URL(
    `${process.env.SALESFORCE_AUTH_URL}/services/oauth2/authorize`
  );

  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set(
    "client_id",
    process.env.SALESFORCE_CLIENT_ID!
  );

  authUrl.searchParams.set(
    "redirect_uri",
    process.env.SALESFORCE_REDIRECT_URI!
  );

  authUrl.searchParams.set(
    "scope",
    "refresh_token openid mcp_api api"
  );

  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  const response = NextResponse.redirect(authUrl);

  response.cookies.set("pkce_verifier", verifier, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  
  console.log("PKCE cookie set");
  return response;
}