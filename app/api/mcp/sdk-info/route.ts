import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientModule = await import(
      "@modelcontextprotocol/sdk/client/index.js"
    );

    return NextResponse.json({
      exports: Object.keys(clientModule).sort(),
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