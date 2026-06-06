import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get("sf_access_token")?.value;

  const response = await fetch(
    process.env.SALESFORCE_MCP_URL!,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list",
      }),
    }
  );

  return NextResponse.json({
    status: response.status,
    headers: Object.fromEntries(
      response.headers.entries()
    ),
    body: await response.text(),
  });
}