import { cookies } from "next/headers";

export default async function Dashboard() {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get("sf_access_token")?.value;

  const instanceUrl =
    cookieStore.get("sf_instance_url")?.value;

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">
        Salesforce MCP Dashboard
      </h1>

      <div className="mt-6 space-y-4">
        <p>
          Connected: {accessToken ? "✅ Yes" : "❌ No"}
        </p>

        <p>
          Instance URL: {instanceUrl ?? "Not Available"}
        </p>

        <a
          href="/api/mcp/test"
          className="inline-block rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Test MCP Endpoint
        </a>
      </div>
    </main>
  );
}