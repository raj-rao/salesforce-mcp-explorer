import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

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

    const client = new Client({
      name: "salesforce-mcp-explorer",
      version: "0.1.0",
    });

    const transport =
      new StreamableHTTPClientTransport(
        new URL(
          process.env.SALESFORCE_MCP_URL!
        ),
        {
          requestInit: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        }
      );

    await client.connect(transport);

    const tools = await client.listTools();

    return NextResponse.json({
      success: true,
      tools,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}