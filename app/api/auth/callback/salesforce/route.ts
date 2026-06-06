import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
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
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: process.env.SALESFORCE_CLIENT_ID!,
          client_secret: process.env.SALESFORCE_CLIENT_SECRET!,
          redirect_uri: process.env.SALESFORCE_REDIRECT_URI!,
          code,
          code_verifier: verifier,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    console.log(JSON.stringify(tokenData, null, 2));
    if (!tokenResponse.ok) {
      return NextResponse.json(
        {
          error: "Token exchange failed",
          details: tokenData,
        },
        { status: tokenResponse.status }
      );
    }

    const response = NextResponse.redirect(
      new URL("/dashboard", request.url)
    );

    response.cookies.set("sf_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    response.cookies.set("sf_instance_url", tokenData.instance_url, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    // Optional for later use
    response.cookies.set("sf_refresh_token", tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    if (tokenData.id_token) {
    response.cookies.set("sf_id_token", tokenData.id_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });
  }

    // Remove one-time PKCE verifier
    response.cookies.set("pkce_verifier", "", {
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Salesforce OAuth callback error:", error);

    return NextResponse.json(
      {
        error: "Unexpected error during OAuth callback",
      },
      { status: 500 }
    );
  }
}