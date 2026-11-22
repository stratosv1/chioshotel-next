import type { ChatItem } from "./room-finder-chat-ui";

export function rewindToAssistantPrompt(
  messages: ChatItem[],
  promptContents: string[],
): ChatItem[] {
  const prompts = new Set(promptContents.filter(Boolean));
  if (prompts.size === 0) return messages;

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    // A prompt may carry a "Noted: …" lead-in paragraph (withNotedDetails).
    if (message.role === "assistant" && [...prompts].some(prompt => message.content === prompt || message.content.endsWith(`\n\n${prompt}`))) {
      return messages.slice(0, index + 1);
    }
  }

  return messages;
}
