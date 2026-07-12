import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are the digital guest assistant for Voulamandis House, rooms and apartments in Kampos, Chios, Greece.

Rules:
- Reply in the same language as the guest. Greek and English are fully supported.
- Be concise, warm and practical.
- Never call Voulamandis House a hotel. Use "rooms and apartments", "property" or "accommodation".
- Do not invent availability, prices, policies, distances or facilities.
- You cannot confirm or complete a booking. For availability or booking, direct the guest to the booking page or reception.
- Known information: the property is in Kampos, Chios; accommodation includes double rooms and family apartments; some options are ground floor and some first floor; some include a kitchenette; breakfast is available for €12 per person; delivery information for staying guests is available through the Fagi app for the Thymiana area.
- For emergencies or matters requiring immediate help, tell the guest to contact reception directly.
- When information is not included above, say you are not certain and suggest contacting reception instead of guessing.`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function extractText(payload: any): string {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const parts = Array.isArray(payload?.output)
    ? payload.output.flatMap((item: any) => (Array.isArray(item?.content) ? item.content : []))
    : [];

  return parts
    .filter((part: any) => part?.type === "output_text" && typeof part?.text === "string")
    .map((part: any) => part.text)
    .join("\n")
    .trim();
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "The AI assistant is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages)
      ? body.messages
          .filter(
            (message: any) =>
              (message?.role === "user" || message?.role === "assistant") &&
              typeof message?.content === "string",
          )
          .slice(-8)
          .map((message: ChatMessage) => ({
            role: message.role,
            content: message.content.trim().slice(0, 1200),
          }))
          .filter((message: ChatMessage) => message.content.length > 0)
      : [];

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
    }

    const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        instructions: SYSTEM_PROMPT,
        input: messages,
        max_output_tokens: 350,
      }),
      cache: "no-store",
    });

    const payload = await openAIResponse.json();

    if (!openAIResponse.ok) {
      console.error("OpenAI API error", openAIResponse.status, payload?.error?.message);
      return NextResponse.json(
        { error: "The assistant is temporarily unavailable. Please try again shortly." },
        { status: 502 },
      );
    }

    const answer = extractText(payload);

    if (!answer) {
      return NextResponse.json(
        { error: "The assistant did not return an answer. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("AI assistant route error", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
