"use client";

import DOMPurify from "dompurify";
import Image from "next/image";
import Link from "next/link";   // ✅ Only once
import { getPage, initLivePreview } from "@/lib/contentstack";
import { useEffect, useState } from "react";
import { Page } from "@/lib/types";
import ContentstackLivePreview, { VB_EmptyBlockParentClass } from "@contentstack/live-preview-utils";


export default function Home() {
  const [page, setPage] = useState<Page>();

  const getContent = async () => {
    const page = await getPage("/");
    setPage(page);
  };

  useEffect(() => {
    initLivePreview();
    ContentstackLivePreview.onEntryChange(getContent);
  }, []);

  return (
    <main className="max-w-screen-xl mx-auto">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-transparent absolute top-0 w-full z-50">
        <h1 className="text-3xl font-bold text-gray-800">EditSync</h1>
        <div className="flex gap-6">
          <a href="#about" className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md">About Us</a>
          <a href="#contact" className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md">Contact</a>
          <Link href="/login">
            <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md">
              Login 
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 pt-20 pb-16 bg-[#FFE9DC] min-h-screen relative">
        <div className="flex flex-col max-w-xl">
          <h1 className="text-6xl font-bold mb-4 text-gray-800">EditSync</h1>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Find. Replace. Sync.</h2>
          <p className="text-lg text-gray-600 mb-6">
            EditSync is a smart and efficient tool that helps users search, replace, and sync content seamlessly in just a few clicks.
          </p>
          <Link href="/editor">
            <button className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900">
                  Try Now
            </button>
          </Link>

        </div>

        {/* Hero Illustration */}
        <div className="mt-10 md:mt-0">
          <Image
            src="/sticker.png"
            alt="EditSync Illustration"
            width={550}
            height={500}
            className="drop-shadow-lg"
          />
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-20 bg-white px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">About Us</h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          EditSync is built to simplify your writing experience by providing advanced grammar correction, content synchronization, and efficient find-replace operations. We aim to make editing seamless, fast, and effective.
        </p>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-[#FFF3E6] px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>
        <p className="text-gray-600 text-lg mb-6">
          Have questions? We'd love to hear from you! Reach out via email:
        </p>
        <a
          href="mailto:support@editsync.com"
          className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-lg"
        >
          support@editsync.com
        </a>
      </section>
    </main>
  );
}
