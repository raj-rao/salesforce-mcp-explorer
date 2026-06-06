export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Salesforce MCP Explorer
      </h1>

      <p className="text-center text-gray-600">
        Connect to Salesforce and explore MCP tools.
      </p>

      <a
        href="/api/auth/login"
        className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Connect Salesforce
      </a>
    </main>
  );
}