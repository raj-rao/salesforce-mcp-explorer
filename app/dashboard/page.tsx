import { cookies } from "next/headers";
import TestChatButton from "@/components/TestChatButton";
import ChatDrawer from "@/components/ChatDrawer";

export default async function Dashboard() {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get("sf_access_token")?.value;

  const instanceUrl =
    cookieStore.get("sf_instance_url")?.value;

  return (
    <>
      <main className="p-8">
        <h1 className="text-3xl font-bold">
          Salesforce MCP Dashboard
        </h1>

        <div className="mt-6 space-y-4">
          <p>
            Connected:{" "}
            {accessToken
              ? "✅ Yes"
              : "❌ No"}
          </p>

          <p>
            Instance URL:{" "}
            {instanceUrl ??
              "Not Available"}
          </p>

          <a
            href="/api/sf/test"
            className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Test Salesforce API
          </a>

          {" "}
          
          <a
            href="/api/mcp/tools"
            className="inline-block rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            List MCP Tools
          </a>

          <div className="pt-6">
            <TestChatButton />
          </div>
        </div>
      </main>

      <ChatDrawer />
    </>
  );
}