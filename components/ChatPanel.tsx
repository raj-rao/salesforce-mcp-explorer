"use client";

import { useState } from "react";

type SalesforceRecord = {
  Id?: string;
  Name?: string;
  [key: string]: unknown;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  records?: SalesforceRecord[];
};

export default function ChatPanel() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Connected to Salesforce MCP. Ask me about users, accounts, contacts, opportunities, or schema.",
    },
  ]);

  async function sendMessage() {
    if (!message.trim()) return;

    const userMessage = message;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.answer ??
            "No response returned.",
          records: data.records,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "An error occurred while calling Salesforce MCP.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded border p-4">
      <h2 className="mb-4 text-xl font-bold">
        Salesforce Chat
      </h2>

      <div className="mb-4 h-96 overflow-y-auto rounded border p-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 ${
              msg.role === "user"
                ? "text-right"
                : "text-left"
            }`}
          >
            <div>
              <strong>
                {msg.role === "user"
                  ? "You"
                  : "Assistant"}
                :
              </strong>
            </div>

            <div>{msg.content}</div>
            {msg.records &&
              msg.records.length > 0 && (
                <table className="mt-2 w-full border border-gray-300 text-sm">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left">
                        Id
                      </th>
                      <th className="border p-2 text-left">
                        Name
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {msg.records.map(
                      (record, index) => (
                        <tr key={index}>
                          <td className="border p-2">
                            {String(
                              record.Id ?? ""
                            )}
                          </td>

                          <td className="border p-2">
                            {String(
                              record.Name ?? ""
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}      

          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded border p-2"
          placeholder="Ask Salesforce..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          {loading
            ? "Thinking..."
            : "Send"}
        </button>
      </div>
    </div>
  );
}