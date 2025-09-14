"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";

// Bot component
function Bot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    // Add user message
    setMessages((msgs) => [...msgs, { role: "user", content: input }]);
    setInput("");

    // Send to backend (replace with your API endpoint)
    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({ operation: "AI Chatbot", text: input }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    // Add bot response
    setMessages((msgs) => [...msgs, { role: "bot", content: data.result || "No response" }]);
  };

  return (
    <div className="fixed bottom-24 right-8 w-80 h-96 bg-white border shadow-xl rounded-lg p-4 z-50">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
        aria-label="Close"
      >
        ×
      </button>
      <h2 className="text-lg font-bold mb-2">AI Chatbot 🤖</h2>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto border p-2 rounded mb-2">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-sm">Chatbot responses will appear here...</p>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`mb-2 text-sm ${msg.role === "user" ? "text-right" : "text-left"}`}>
                <span className={msg.role === "user" ? "font-bold text-orange-500" : "font-bold text-blue-500"}>
                  {msg.role === "user" ? "You" : "AI"}:
                </span>{" "}
                {msg.content}
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="border rounded px-3 py-2 text-sm flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded flex items-center justify-center text-xl"
            aria-label="Send"
          >
            🛩️
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Editor() {
  const router = useRouter();
  const { data: session } = useSession();
  const [operation, setOperation] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [showBot, setShowBot] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [entityMap, setEntityMap] = useState(""); // For named entity replacement, could be JSON or a simple string

  const operations = [
    "Grammar Checker",
    "Plagiarism Check",
    "Contextual Replacement",
    "Smart Link Updates",
    "Named Entity Replacement",
    "Deep Content Management",
    // "AI Chatbot", // <-- Removed from sidebar
  ];

  const handleProcess = async () => {
    if (!operation) {
      alert("Please select an operation first.");
      return;
    }
    if (!inputText.trim()) {
      alert("Please enter some text to process.");
      return;
    }
    if (
      (operation === "Contextual Replacement" || operation === "Smart Link Updates") &&
      (!findText.trim() || !replaceText.trim())
    ) {
      alert("Please fill both 'Find' and 'Replace' fields.");
      return;
    }
    if (operation === "Named Entity Replacement" && !entityMap.trim()) {
      alert("Please provide an entity map.");
      return;
    }

    const formData = new FormData();
    formData.append("operation", operation);
    formData.append("text", inputText);
    if (file) formData.append("file", file);

    // Add extra fields for specific operations
    if (
      operation === "Contextual Replacement" ||
      operation === "Smart Link Updates"
    ) {
      formData.append("findText", findText);
      formData.append("replaceText", replaceText);
    }
    if (operation === "Named Entity Replacement") {
      formData.append("entityMap", entityMap);
    }

    const res = await fetch("/api/ai", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setOutput(data.result || "No result");
  };

  // 🔑 If not signed in → show login prompt
  if (!session) {
    return (
      <div className="h-screen flex flex-col">
        <header className="bg-orange-500 text-black px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">EditSync</h1>
          <nav className="flex gap-6">
            <Link href="/">Home</Link>
          </nav>
        </header>

        <div className="flex flex-1">
          {/* Sidebar */}
          <aside className="w-1/4 bg-white shadow-md p-4">
            <button
              onClick={() => router.push("/login")}
              className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md mb-6 w-full"
            >
              Sign In
            </button>

            <h2 className="font-bold text-lg mb-4">Operations</h2>
            <ul className="space-y-3">
              {operations.map((op) => (
                <li
                  key={op}
                  className={`cursor-pointer p-2 rounded ${
                    operation === op
                      ? "bg-orange-200 font-bold text-black"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setOperation(op)}
                >
                  {op}
                </li>
              ))}
            </ul>
          </aside>

          {/* Content Area */}
          <main className="flex-1 bg-[#FFE9DC] p-6 flex flex-col">
            <textarea
              className="w-full h-40 p-3 border rounded resize-none mb-4"
              placeholder="Paste or type text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            <input
              type="file"
              className="border p-2 rounded mb-4"
              accept=".txt,.doc,.docx,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <button
              className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-md w-fit"
              onClick={handleProcess}
            >
              Process
            </button>

            {output && (
              <div className="mt-6 p-4 bg-white rounded shadow-md">
                <h3 className="font-bold mb-2">Result:</h3>
                <pre className="whitespace-pre-wrap text-gray-700">{output}</pre>

                {fileUrl && (
                  <a
                    href={fileUrl}
                    download="output.txt"
                    className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Download File
                  </a>
                )}
              </div>
            )}
          </main>
        </div>
        {/* AI Chatbot Button */}
        <button
          className="fixed bottom-8 right-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-lg z-40"
          onClick={() => setShowBot(true)}
          aria-label="Open AI Chatbot"
        >
          🤖
        </button>
        {showBot && <Bot onClose={() => setShowBot(false)} />}
      </div>
    );
  }

  // 🔑 If signed in → show full editor
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-orange-500 text-black px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">EditSync</h1>
        <nav className="flex gap-6">
          <Link href="/">Home</Link>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white shadow-md p-4">
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="/user-icon.png"
              alt="User"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-bold text-black">
                {session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-red-500 mt-1"
              >
                Sign out
              </button>
            </div>
          </div>

          <h2 className="font-bold text-lg mb-4">Operations</h2>
          <ul className="space-y-3">
            {operations.map((op) => (
              <li
                key={op}
                className={`cursor-pointer p-2 rounded ${
                  operation === op
                    ? "bg-orange-200 font-bold text-black"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setOperation(op)}
              >
                {op}
              </li>
            ))}
          </ul>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-[#FFE9DC] p-6 flex flex-col">
          <textarea
            className="w-full h-40 p-3 border rounded resize-none mb-4"
            placeholder="Paste or type text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <input
            type="file"
            className="border p-2 rounded mb-4"
            accept=".txt,.doc,.docx,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          <button
            className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-md w-fit"
            onClick={handleProcess}
          >
            Process
          </button>

          {output && (
            <div className="mt-6 p-4 bg-white rounded shadow-md">
              <h3 className="font-bold mb-2">Result:</h3>
              <pre className="whitespace-pre-wrap text-gray-700">{output}</pre>
            </div>
          )}

          {/* Operation-specific inputs */}
          {operation === "Contextual Replacement" && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Find this text..."
                className="border rounded px-3 py-2 text-sm mb-2 w-full"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
              />
              <input
                type="text"
                placeholder="Replace with..."
                className="border rounded px-3 py-2 text-sm w-full"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
              />
            </div>
          )}
          {operation === "Smart Link Updates" && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Find this link/text..."
                className="border rounded px-3 py-2 text-sm mb-2 w-full"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
              />
              <input
                type="text"
                placeholder="Replace with link/text..."
                className="border rounded px-3 py-2 text-sm w-full"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
              />
            </div>
          )}
          {operation === "Named Entity Replacement" && (
            <div className="mb-4">
              <input
                type="text"
                placeholder='Entity map (e.g. {"John":"Jane","Acme":"Globex"})'
                className="border rounded px-3 py-2 text-sm w-full"
                value={entityMap}
                onChange={(e) => setEntityMap(e.target.value)}
              />
            </div>
          )}
        </main>
      </div>
      {/* AI Chatbot Button */}
      <button
        className="fixed bottom-8 right-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-lg z-40"
        onClick={() => setShowBot(true)}
        aria-label="Open AI Chatbot"
      >
        🤖
      </button>
      {showBot && <Bot onClose={() => setShowBot(false)} />}
    </div>
  );
}
