import { NextResponse } from "next/server";

export async function GET() {
  const results: Record<string, unknown> = {};

  const modules = [
    "@modelcontextprotocol/sdk/client/streamableHttp.js",
    "@modelcontextprotocol/sdk/client/sse.js",
    "@modelcontextprotocol/sdk/client/websocket.js",
  ];

  for (const moduleName of modules) {
    try {
      const mod = await import(moduleName);

      results[moduleName] = Object.keys(mod).sort();
    } catch (error) {
      results[moduleName] =
        error instanceof Error
          ? error.message
          : "Failed to load";
    }
  }

  return NextResponse.json(results);
}