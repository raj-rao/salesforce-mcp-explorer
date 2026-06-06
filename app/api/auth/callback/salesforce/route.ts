import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();

  const verifier = cookieStore.get("pkce_verifier")?.value;

  if (!verifier) {
    return NextResponse.json(
      { error: "Missing PKCE verifier" },
      { status: 400 }
    );
  }

  const tokenResponse = await fetch(
    `${process.env.SALESFORCE_AUTH_URL}/services/oauth2/token`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.SALESFORCE_CLIENT_ID!,
        client_secret:
          process.env.SALESFORCE_CLIENT_SECRET!,
        redirect_uri:
          process.env.SALESFORCE_REDIRECT_URI!,
        code,
        code_verifier: verifier,
      }),
    }
  );

  const tokenData = await tokenResponse.json();

  return NextResponse.json(tokenData);
}