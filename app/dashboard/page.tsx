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

      <div className="mt-6 space-y-2">
        <p>
          Connected: {accessToken ? "✅ Yes" : "❌ No"}
        </p>

        <p>
          Instance URL: {instanceUrl ?? "Not Available"}
        </p>
      </div>
    </main>
  );
}