function getOutputText(payload: any): string {
  if (typeof payload?.output_text === "string") return payload.output_text;
  for (const item of Array.isArray(payload?.output) ? payload.output : []) {
    for (const content of Array.isArray(item?.content) ? item.content : []) {
      if (typeof content?.text === "string") return content.text;
    }
  }
  return "";
}

export async function callTeacherJsonStream(input: {
  model: string;
  prompt: string;
  schemaName: string;
  schema: object;
  timeoutMs?: number;
  reasoningEffort?: "low" | "medium" | "high";
}) {
  const apiKey = process.env.TEACHER;
  if (!apiKey) throw new Error("TEACHER is not configured for the Physics pipeline.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), input.timeoutMs ?? 890_000);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: input.model,
        stream: true,
        reasoning: { effort: input.reasoningEffort ?? "high" },
        input: [{ role: "user", content: [{ type: "input_text", text: input.prompt }] }],
        text: {
          format: {
            type: "json_schema",
            name: input.schemaName,
            strict: true,
            schema: input.schema,
          },
        },
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      throw new Error(payload?.error?.message || `OpenAI generation failed with HTTP ${response.status}`);
    }
    if (!response.body) throw new Error("OpenAI generation returned no stream.");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let streamedText = "";
    let completedText = "";
    let streamError = "";

    const consume = (block: string) => {
      const data = block
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart())
        .join("\n")
        .trim();
      if (!data || data === "[DONE]") return;

      let event: any;
      try { event = JSON.parse(data); } catch { return; }
      if (event?.type === "response.output_text.delta" && typeof event.delta === "string") streamedText += event.delta;
      else if (event?.type === "response.output_text.done" && typeof event.text === "string") completedText = event.text;
      else if (event?.type === "response.completed") completedText = getOutputText(event.response) || completedText;
      else if (event?.type === "response.failed") streamError = event?.response?.error?.message || "OpenAI stream failed.";
      else if (event?.type === "error") streamError = event?.error?.message || event?.message || "OpenAI stream error.";
    };

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() || "";
      blocks.forEach(consume);
      if (streamError) throw new Error(streamError);
    }

    buffer += decoder.decode();
    if (buffer.trim()) consume(buffer.replace(/\r\n/g, "\n"));
    if (streamError) throw new Error(streamError);

    const output = streamedText || completedText;
    if (!output) throw new Error("OpenAI generation returned empty output.");
    return JSON.parse(output);
  } finally {
    clearTimeout(timeout);
  }
}
