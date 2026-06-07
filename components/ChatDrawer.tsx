"use client";

import { useState } from "react";
import ChatPanel from "./ChatPanel";

export default function ChatDrawer() {
  const [isOpen, setIsOpen] =
    useState(false);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() =>
            setIsOpen(true)
          }
          className="
            fixed
            bottom-6
            right-6
            z-50
            rounded-full
            bg-blue-600
            px-5
            py-3
            text-white
            shadow-lg
            hover:bg-blue-700
          "
        >
          Chat
        </button>
      )}

      {isOpen && (
        <ChatPanel
          onClose={() =>
            setIsOpen(false)
          }
        />
      )}
    </>
  );
}