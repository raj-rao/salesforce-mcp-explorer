import { NextResponse } from "next/server";
import { createSalesforceMcpClient } from "@/lib/salesforce-mcp";

export async function GET() {
  try {
    const client = await createSalesforceMcpClient();

    return NextResponse.json({
      success: true,
      clientCreated: !!client,
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