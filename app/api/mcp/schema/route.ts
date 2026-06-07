import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createSalesforceMcpClient } from "@/lib/salesforce-mcp";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const accessToken =
      cookieStore.get("sf_access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          error: "Missing Salesforce access token",
        },
        { status: 401 }
      );
    }

    const client =
      await createSalesforceMcpClient(
        accessToken
      );

    const result = await client.callTool({
      name: "getObjectSchema",
      arguments: {},
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("MCP Error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : error,
      },
      { status: 500 }
    );
  }
}