"use client";
import type { RoomFinderCopy } from "./room-finder-copy";
export function FeedbackChoices({copy,onYes,onDifferent}:{copy:RoomFinderCopy;onYes:()=>void;onDifferent:()=>void}){
 return <section className="msg ml-10 rounded-[22px] border border-[#dfd6ca] bg-white p-4 shadow-sm"><p className="font-bold">{copy.feedbackQ}</p><div className="mt-3 grid gap-2 sm:grid-cols-2"><button onClick={onYes} className="rounded-2xl bg-[#66714f] px-3 py-3 text-sm font-bold text-white">{copy.feedbackYes}</button><button onClick={onDifferent} className="rounded-2xl border border-[#d8cec1] px-3 py-3 text-sm font-bold">{copy.feedbackDifferent}</button></div></section>;
}
