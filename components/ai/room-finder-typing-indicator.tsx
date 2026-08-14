"use client";

export function TypingIndicator() {
  return (
    <div
      className="msg ml-10 flex w-fit items-center gap-1 rounded-[20px] border border-[#dfd6ca] bg-white px-4 py-3 shadow-sm"
      role="status"
      aria-label="Typing"
    >
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  );
}
