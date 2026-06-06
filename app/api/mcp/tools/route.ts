import { NextResponse } from "next/server";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

export async function GET() {
  return NextResponse.json({
    sdkLoaded: typeof Client === "function",
  });
}