"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Editor() {
  const router = useRouter();
  const { data: session } = useSession();
  const [operation, setOperation] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState("");

  const operations = [
    "Grammar Checker",
    "Plagiarism Check",
    "Contextual Replacement",
    "Smart Link Updates",
    "Named Entity Replacement",
    "Deep Content Management",
    "AI Chatbot",
  ];

  const handleProcess = async () => {
    if (!operation) {
      alert("Please select an operation first.");
      return;
    }

    const formData = new FormData();
    formData.append("operation", operation);
    formData.append("text", inputText);
    if (file) formData.append("file", file);

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
              </div>
            )}
          </main>
        </div>
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
        </main>
      </div>
    </div>
  );
}
