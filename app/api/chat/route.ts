import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {
  getUserInfo,
  runSoqlQuery,
  getObjectSchema,
} from "@/lib/salesforce-mcp-tools";

export async function POST(
  request: NextRequest
) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        {
          error: "Message is required",
        },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    const accessToken =
      cookieStore.get("sf_access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "Missing Salesforce access token",
        },
        { status: 401 }
      );
    }

    const userMessage =
      message.toLowerCase();

    //
    // USER INFO
    //
    if (
      userMessage.includes("who am i") ||
      userMessage.includes("my profile") ||
      userMessage.includes("current user")
    ) {
      const result =
        await getUserInfo(accessToken);

      const user = (
        result.structuredContent as {
          identity: {
            displayName: string;
            profileName: string;
            companyName: string;
          };
        }
      ).identity;

      return NextResponse.json({
        answer: `You are ${user.displayName}, ${user.profileName} at ${user.companyName}.`,
        tool: "getUserInfo",
        data: result.structuredContent,
      });
    }

    //
    // OBJECTS
    //
    if (
      userMessage.includes("objects") ||
      userMessage.includes("schema")
    ) {
      const result =
        await getObjectSchema(accessToken);

      const schema = result.structuredContent as {
        index: {
          objectCount: number;
          objects: {
            name: string;
          }[];
        };
      };

      const objects =
        schema.index.objects
          .map((obj) => obj.name)
          .join(", ");

      return NextResponse.json({
        answer: `I found ${schema.index.objectCount} Salesforce objects.`,
        tool: "getObjectSchema",
        data: {
          objectCount:
            schema.index.objectCount,
          objects,
        },
      });
    }

    //
    // ACCOUNTS
    //
    if (
      userMessage.includes("accounts")
    ) {
      const result =
        await runSoqlQuery(
          accessToken,
          "SELECT Id, Name FROM Account LIMIT 10"
        );

      return NextResponse.json({
        answer:
          "Here are the first 10 accounts.",
        tool: "soqlQuery",
        data: result,
      });
    }

    //
    // CONTACTS
    //
    if (
      userMessage.includes("contacts")
    ) {
      const result =
        await runSoqlQuery(
          accessToken,
          "SELECT Id, Name FROM Contact LIMIT 10"
        );

      return NextResponse.json({
        answer:
          "Here are the first 10 contacts.",
        tool: "soqlQuery",
        data: result,
      });
    }

    //
    // OPPORTUNITIES
    //
    if (
      userMessage.includes(
        "opportunities"
      )
    ) {
      const result =
        await runSoqlQuery(
          accessToken,
          "SELECT Id, Name FROM Opportunity LIMIT 10"
        );

      return NextResponse.json({
        answer:
          "Here are the first 10 opportunities.",
        tool: "soqlQuery",
        data: result,
      });
    }

    //
    // FALLBACK
    //
    return NextResponse.json({
      answer:
        "I don't know how to answer that yet. Try asking about accounts, contacts, opportunities, schema, or who you are.",
    });
  } catch (error) {
    console.error(
      "Chat API Error:",
      error
    );

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