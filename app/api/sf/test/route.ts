import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get("sf_access_token")?.value;

  const instanceUrl =
    cookieStore.get("sf_instance_url")?.value;

  if (!accessToken || !instanceUrl) {
    return NextResponse.json(
      { error: "Missing auth cookies" },
      { status: 401 }
    );
  }

  const response = await fetch(
    `${instanceUrl}/services/data/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const body = await response.text();

  return NextResponse.json({
    status: response.status,
    body,
  });
}