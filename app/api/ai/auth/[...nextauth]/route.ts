import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // set in .env.local
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const operation = formData.get("operation") as string;
    const text = formData.get("text") as string;

    if (!operation || !text) {
      return NextResponse.json({ result: "Missing data" }, { status: 400 });
    }

    // Guardrail: only allow defined ops
    const allowed = [
      "Grammar Checker",
      "Plagiarism Check",
      "Contextual Replacement",
      "Smart Link Updates",
      "Named Entity Replacement",
      "Deep Content Management",
      "AI Chatbot",
    ];
    if (!allowed.includes(operation)) {
      return NextResponse.json(
        { result: "Invalid operation" },
        { status: 400 }
      );
    }

    let prompt = "";
    switch (operation) {
      case "Grammar Checker":
        prompt = `Correct grammar, spelling, and clarity. Text: ${text}`;
        break;

      case "Plagiarism Check":
        prompt = `Check if the following text appears plagiarized, and return a similarity estimate and suggestions. Text: ${text}`;
        break;

      case "Contextual Replacement":
        prompt = `Perform contextual replacement only. Example: Replace “Gemini 2.5 Pro” with “Claude Sonnet”, not Claude 2.5 Pro. Text: ${text}`;
        break;

      case "Smart Link Updates":
        prompt = `Update links in text. Example: "Google" linking to https://google.com → "Bing" linking to https://bing.com. Text: ${text}`;
        break;

      case "Named Entity Replacement":
        prompt = `Replace company names, people, and emails with new provided ones. Text: ${text}`;
        break;

      case "Deep Content Management":
        prompt = `Scan and edit Rich Text, tables, nested components, links, metadata, and custom fields. Text: ${text}`;
        break;

      case "AI Chatbot":
        prompt = `Answer conversationally, but stay within writing/editing/content management context. Text: ${text}`;
        break;
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // or gpt-4o
      messages: [{ role: "user", content: prompt }],
    });

    const result =
      response.choices[0]?.message?.content || "No result from AI.";

    return NextResponse.json({ result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ result: "Error processing request" });
  }
}

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // ⚡ Replace with real DB check
        if (
          credentials?.email === "test@editsync.com" &&
          credentials?.password === "1234"
        ) {
          return {
            id: "1",
            name: "Test User",
            email: credentials.email,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // your login.tsx UI
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
