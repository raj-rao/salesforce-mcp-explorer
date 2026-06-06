import { NextResponse } from "next/server";

export async function GET() {
  try {
    const mod = await import(
      "@modelcontextprotocol/sdk/client/sse.js"
    );

    return NextResponse.json({
      exports: Object.keys(mod),
      constructor:
        mod.SSEClientTransport?.toString?.()
          ?.slice(0, 500) ?? "Unavailable",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}