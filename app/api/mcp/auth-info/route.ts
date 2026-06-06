import { NextResponse } from "next/server";

export async function GET() {
  const modules = [
    "@modelcontextprotocol/sdk/client/auth.js",
    "@modelcontextprotocol/sdk/client/auth/providers/bearer.js",
    "@modelcontextprotocol/sdk/client/auth/providers/oauth.js",
  ];

  const results: Record<string, unknown> = {};

  for (const moduleName of modules) {
    try {
      const mod = await import(moduleName);

      results[moduleName] = Object.keys(mod);
    } catch (error) {
      results[moduleName] =
        error instanceof Error
          ? error.message
          : "Failed";
    }
  }

  return NextResponse.json(results);
}