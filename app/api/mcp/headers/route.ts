import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(
    process.env.SALESFORCE_MCP_URL!,
    {
      method: "OPTIONS",
    }
  );

  return NextResponse.json({
    status: response.status,
    headers: Object.fromEntries(
      response.headers.entries()
    ),
  });
}