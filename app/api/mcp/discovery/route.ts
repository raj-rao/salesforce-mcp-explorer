import { NextResponse } from "next/server";

export async function GET() {
  const urls = [
    "https://api.salesforce.com/platform/mcp/v1/platform/sobject-all/.well-known/oauth-protected-resource",
    "https://api.salesforce.com/.well-known/oauth-protected-resource",
    "https://api.salesforce.com/.well-known/oauth-authorization-server",
  ];

  const results: Record<string, unknown> = {};

  for (const url of urls) {
    try {
      const response = await fetch(url);

      results[url] = {
        status: response.status,
        contentType: response.headers.get("content-type"),
        body: await response.text(),
      };
    } catch (error) {
      results[url] =
        error instanceof Error
          ? error.message
          : "Unknown error";
    }
  }

  return NextResponse.json(results);
}