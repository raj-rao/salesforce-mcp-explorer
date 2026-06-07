"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

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

type ChatPanelProps = {
  onClose: () => void;
};

export default function ChatPanel({
  onClose,
}: ChatPanelProps) {
  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState<Message[]>([
      {
        role: "assistant",
        content:
          "Connected to Salesforce MCP. Ask me about users, accounts, contacts, opportunities, or schema.",
      },
    ]);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

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
      const response = await fetch(
        "/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      const data =
        await response.json();

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
    <div
      className="
        fixed
        right-0
        top-0
        h-screen
        w-[420px]
        border-l
        bg-white
        shadow-2xl
        flex
        flex-col
        z-50
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-bold">
          Salesforce Chat
        </h2>

        <button
          onClick={onClose}
          className="rounded px-2 py-1 text-sm hover:bg-gray-100"
        >
          ✕
        </button>
      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(
          (msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[90%] rounded-lg p-3 ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                <div className="mb-1 text-xs font-bold">
                  {msg.role === "user"
                    ? "You"
                    : "Assistant"}
                </div>

                <div>{msg.content}</div>

                {msg.records &&
                  msg.records.length > 0 && (
                    <div className="mt-3 overflow-x-auto">
                      <table className="min-w-full border text-xs">
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
                            (
                              record,
                              recordIndex
                            ) => (
                              <tr
                                key={
                                  recordIndex
                                }
                              >
                                <td className="border p-2">
                                  {String(
                                    record.Id ??
                                      ""
                                  )}
                                </td>

                                <td className="border p-2">
                                  {String(
                                    record.Name ??
                                      ""
                                  )}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
              </div>
            </div>
          )
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}

      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            className="flex-1 rounded border p-2"
            placeholder="Ask Salesforce..."
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter"
              ) {
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
              ? "..."
              : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}