"use client";

import { useLLM } from "@/hook/useLLM";
import React from "react";

interface Chat {
  role: "user" | "llm";
  message: string;
}

export default function Home() {
  const [message, setMessage] = React.useState("");
  const [chat, setChat] = React.useState<Chat[]>([]);
  const llm = useLLM();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!message.trim()) return;

    setChat((chat) => [
      ...chat,
      {
        role: "user",
        message: message,
      },
    ]);
    setMessage("");

    llm.mutate(
      { prompt: message },
      {
        onSuccess: (data) => {
          setChat((chat) => [
            ...chat,
            {
              role: "llm",
              message: data.message,
            },
          ]);
        },
        onError: () => {
          setChat((chat) => [
            ...chat,
            {
              role: "llm",
              message: "Something went wrong",
            },
          ]);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 text-white font-mono">
      <main className="flex flex-col max-w-4xl mx-auto py-10 px-4">
        {/* Header Section */}
        <section className="text-center mb-10">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
            Chatbox
          </h1>
        </section>

        {/* Chat History */}
        <section className="flex-1 overflow-y-auto mb-6 space-y-4 max-h-[70vh]">
          {chat.map(({ message, role }: Chat, index) => (
            <div
              key={index}
              className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg shadow-lg whitespace-pre-wrap text-sm
                ${role === "user"
                    ? "bg-gradient-to-r from-pink-400 to-pink-600"
                    : "bg-gradient-to-r from-purple-400 to-purple-600"
                  }`}
              >
                {message}
              </div>
            </div>
          ))}
        </section>

        {/* Input */}
        <section>
          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 bg-[#f3e6f0] p-2 rounded-xl shadow-lg"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask something smart..."
              className="flex-1 px-4 py-2 bg-transparent text-black placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 transition-all text-white font-bold py-2 px-4 rounded-lg"
            >
              Send
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
