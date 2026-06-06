import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get("sf_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "No Salesforce access token found" },
      { status: 401 }
    );
  }

  const response = await fetch(
    process.env.SALESFORCE_MCP_URL!,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const contentType =
    response.headers.get("content-type");

  const responseText = await response.text();

  return NextResponse.json({
    status: response.status,
    contentType,
    body: responseText,
  });
}