"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import '../app/globals.css';
// Contentstack imports
import { getPage, initLivePreview } from "@/lib/contentstack";
import { Page } from "@/lib/types";
import ContentstackLivePreview, {
  VB_EmptyBlockParentClass,
} from "@contentstack/live-preview-utils";

export default function Editor() {
  const router = useRouter();

  // Fake auth state (replace with real auth context later)
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const userEmail = "abc@gmail.com";

  // Contentstack state
  const [page, setPage] = useState<Page>();
  const [activeOperation, setActiveOperation] = useState<string>("");

  const getContent = async () => {
    const entry = await getPage("/editor");
    setPage(entry);
  };

  useEffect(() => {
    initLivePreview();
    ContentstackLivePreview.onEntryChange(getContent);
    getContent();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-orange-500 text-black px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">EditSync</h1>
        <nav className="flex gap-6">
          <Link href="/" className="hover:underline text-white text-lg">
            Home
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white shadow-md p-4">
          {!isLoggedIn ? (
            <button
              onClick={() => router.push("/login")}
              className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md w-full font-semibold"
            >
              Sign In
            </button>
          ) : (
            <>
              {/* User info */}
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src="/user-icon.png"
                  alt="User"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-gray-900 font-semibold">{userEmail}</span>
              </div>

              {/* History */}
              <div className="mb-6">
                <h2 className="text-gray-700 font-medium mb-3">History</h2>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>Project Plan.docx</li>
                  <li>Marketing Copy.pdf</li>
                  <li>Landing Page.txt</li>
                </ul>
              </div>

              {/* Options */}
              <ul className="space-y-3">
                {[
                  "Grammar Checker",
                  "Plagiarism Checker",
                  "Smart Replace",
                  "URL & Text Sync",
                  "Content Manager",
                  "AI Chat",
                ].map((option) => (
                  <li
                    key={option}
                    onClick={() => setActiveOperation(option)}
                    className={`cursor-pointer text-lg font-bold text-black hover:text-orange-500 ${
                      activeOperation === option ? "underline" : ""
                    }`}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-[#FFE9DC] flex items-center justify-center">
          <div
            className={`text-center bg-white p-8 rounded-lg shadow-md w-2/3 ${
              !page?.blocks || page.blocks.length === 0
                ? VB_EmptyBlockParentClass
                : ""
            }`}
            {...(page?.$ && page?.$.blocks)}
          >
            {/* Page content from Contentstack */}
            {page?.title && (
              <h2
                className="text-xl font-bold mb-4"
                {...(page?.$ && page?.$.title)}
              >
                {page.title}
              </h2>
            )}

            {page?.description && (
              <p
                className="text-gray-600 mb-4"
                {...(page?.$ && page?.$.description)}
              >
                {page.description}
              </p>
            )}

            {/* Active operation info */}
            {activeOperation && (
              <p className="text-gray-800 font-semibold mb-4">
                Selected Operation: {activeOperation}
              </p>
            )}

            {/* Textarea */}
            <textarea
              className="w-full h-40 p-3 border rounded resize-none mb-4"
              placeholder={page?.rich_text || "Paste or type text here..."}
            />

            {/* Upload */}
            <input
              type="file"
              className="border p-2 rounded mb-4 w-full"
              accept=".txt,.doc,.docx,.pdf"
            />

            <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-md">
              Process
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
