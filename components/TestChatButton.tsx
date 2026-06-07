"use client";

import { useState } from "react";

export default function TestChatButton() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function testChat() {
    try {
      setLoading(true);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "who am i",
        }),
      });

      const data = await res.json();

      setResponse(
        JSON.stringify(data, null, 2)
      );
    } catch (err) {
      setResponse(
        JSON.stringify(err, null, 2)
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        onClick={testChat}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        {loading
          ? "Testing..."
          : "Test Chat API"}
      </button>

      {response && (
        <pre className="mt-4 overflow-auto rounded border p-4 text-sm">
          {response}
        </pre>
      )}
    </div>
  );
}