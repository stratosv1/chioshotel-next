"use client";

export function TypingIndicator({ label = "Typing" }: { label?: string }) {
  return (
    <div
      className="msg ml-10 flex w-fit items-center gap-1 rounded-[20px] border border-[#dfd6ca] bg-white px-4 py-3 shadow-sm"
      role="img"
      aria-label={label}
    >
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </div>
  );
}
