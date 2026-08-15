import type { ChatItem } from "./room-finder-chat-ui";

export function rewindToAssistantPrompt(
  messages: ChatItem[],
  promptContents: string[],
): ChatItem[] {
  const prompts = new Set(promptContents.filter(Boolean));
  if (prompts.size === 0) return messages;

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role === "assistant" && prompts.has(message.content)) {
      return messages.slice(0, index + 1);
    }
  }

  return messages;
}
