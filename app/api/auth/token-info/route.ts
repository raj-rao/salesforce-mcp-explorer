import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  const idToken =
    cookieStore.get("sf_id_token")?.value;

  if (!idToken) {
    return NextResponse.json({
      error: "No ID token found",
    });
  }

  const payload = JSON.parse(
    Buffer.from(
      idToken.split(".")[1],
      "base64url"
    ).toString()
  );

  return NextResponse.json(payload);
}