"use client";
import { FormEvent, useMemo, useRef, useState } from "react";
import type { RoomFinderFilter, RoomFinderLanguage } from "./room-finder-copy";
import { ROOM_FINDER_COPY } from "./room-finder-copy";
import { ROOM_FINDER_TONE } from "./room-finder-tone";
import { TURN_TIMING } from "./room-finder-flow-helpers";
import type { ChatItem, MessageKind, Reaction } from "./room-finder-chat-ui";
import type { RoomOffer } from "./room-finder-carousel";
import type { RoomChoice } from "./room-finder-selected-card";

export type FinderStep="checkin"|"checkout"|"rooms"|"guests"|"preferences"|"searching"|"selecting"|"breakfast"|"complete"|"unavailable";
export type FeedbackMode="idle"|"happy"|"different"|"type"|"floor";
type Action={type:string;roomCount?:number;guests?:number;checkin?:string;checkout?:string;query?:string};
type Command={language:RoomFinderLanguage;replyMode:"answer"|"execute"|"clarify";actions:Action[]};
type TurnPace="normal"|"quick";
const wait=(ms:number)=>new Promise<void>(resolve=>window.setTimeout(resolve,ms));
const rid=()=>`${Date.now()}-${Math.random().toString(36).slice(2)}`;
const nightsBetween=(a:string,b:string)=>Math.round((Date.parse(`${b}T12:00:00Z`)-Date.parse(`${a}T12:00:00Z`))/86400000);
const isIso=(v:string)=>/^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(`${v}T12:00:00Z`));
const rank=(room:RoomOffer)=>{const order=[2,6,5,7,1,3,4,8,9,10];const i=order.indexOf(Number(room.roomNumber));return i<0?99:i;};
const matches=(room:RoomOffer,f:RoomFinderFilter)=>{const n=Number(room.roomNumber);if(f==="economy")return[2,6].includes(n);if(f==="noStairs"||f==="ground")return[5,6,7].includes(n);if(f==="first")return[1,2,3,4].includes(n);if(f==="kitchen")return[3,4,8,9,10].includes(n);if(f==="family")return[8,9,10].includes(n);if(f==="balcony")return[1,4].includes(n);return[5,6,7,8,9,10].includes(n);};
const offerKey=(offer:RoomOffer)=>`${offer.roomId}:${offer.unitId}`;

export function useRoomFinder(language:RoomFinderLanguage){
 const copy=ROOM_FINDER_COPY[language];
 const tone=ROOM_FINDER_TONE[language];
 const [step,setStep]=useState<FinderStep>("checkin");
 const [messages,setMessages]=useState<ChatItem[]>([{id:rid(),role:"assistant",content:copy.welcome}]);
 const [input,setInput]=useState("");
 const [checkin,setCheckin]=useState(""); const [checkout,setCheckout]=useState("");
 const [roomCount,setRoomCount]=useState<number|null>(null); const [groups,setGroups]=useState<number[]>([]);
 const [filters,setFilters]=useState<RoomFinderFilter[]>([]); const [preferFit,setPreferFit]=useState(false);
 const [offers,setOffers]=useState<RoomOffer[][]>([]); const [activeGroup,setActiveGroup]=useState(0);
 const [choices,setChoices]=useState<RoomChoice[]>([]); const [feedback,setFeedback]=useState<FeedbackMode>("idle");
 const [breakfast,setBreakfast]=useState(false); const [typing,setTyping]=useState(false); const [selectingOfferKey,setSelectingOfferKey]=useState<string|null>(null); const turnLocked=useRef(false);
 const guestTotal=groups.reduce((a,b)=>a+b,0); const nights=checkin&&checkout?Math.max(0,nightsBetween(checkin,checkout)):0;
 const selected=useMemo(()=>new Set(choices.map(c=>offerKey(c.offer))),[choices]);
 const visibleOffers=useMemo(()=>{const guests=groups[activeGroup]||0;return[...(offers[activeGroup]||[])].filter(o=>!selected.has(offerKey(o))).filter(o=>!o.maxGuests||o.maxGuests>=guests).sort((a,b)=>{const fa=filters.reduce((s,f)=>s+(matches(a,f)?1:0),0),fb=filters.reduce((s,f)=>s+(matches(b,f)?1:0),0);const fitA=preferFit?Math.abs((a.maxGuests||9)-guests):0,fitB=preferFit?Math.abs((b.maxGuests||9)-guests):0;return fb-fa||fitA-fitB||a.directTotal-b.directTotal||rank(a)-rank(b);});},[offers,activeGroup,groups,filters,preferFit,selected]);
 const add=(role:ChatItem["role"],content:string,kind:MessageKind="normal")=>setMessages(v=>[...v,{id:rid(),role,content,kind}]);
 async function beginUserTurn(content:string,kind:MessageKind="normal",reaction:Reaction="👍",pace:TurnPace="normal"){if(turnLocked.current)return false;turnLocked.current=true;const timing=TURN_TIMING[pace];const id=rid();setMessages(v=>[...v,{id,role:"user",content,kind}]);await wait(timing.reaction);setMessages(v=>v.map(m=>m.id===id?{...m,reaction}:m));await wait(timing.after);return true;}
 const endUserTurn=()=>{turnLocked.current=false;};
 function reset(){turnLocked.current=false;setStep("checkin");setMessages([{id:rid(),role:"assistant",content:copy.welcome}]);setInput("");setCheckin("");setCheckout("");setRoomCount(null);setGroups([]);setFilters([]);setPreferFit(false);setOffers([]);setActiveGroup(0);setChoices([]);setFeedback("idle");setBreakfast(false);setTyping(false);setSelectingOfferKey(null);}
 async function interpret(value:string,current:FinderStep):Promise<Command>{const recentMessages=messages.map(({role,content})=>({role,content}));const response=await fetch("/api/ai-assistant/interpret",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:value,context:{language,currentStep:current,checkin:checkin||undefined,checkout:checkout||undefined,roomCount:roomCount||undefined,guestGroups:groups,currentRoom:current==="guests"?groups.length+1:undefined,recentMessages}})});const data=await response.json();if(!response.ok||!data?.command)throw new Error();return data.command;}
 async function applyCommand(command:Command){if(command.actions.some(a=>a.type==="restart_search")){reset();return;}let ci=checkin,co=checkout,rooms=roomCount,g=[...groups],changed=false,clarify="";for(const a of command.actions){if(a.type==="ask_clarification"&&a.query)clarify=a.query;if(a.type==="search_availability"){if(a.checkin&&isIso(a.checkin)){ci=a.checkin;changed=true;}if(a.checkout&&isIso(a.checkout)){co=a.checkout;changed=true;}}if(a.type==="set_room_count"&&a.roomCount&&a.roomCount>=1&&a.roomCount<=3){rooms=a.roomCount;g=g.slice(0,a.roomCount);changed=true;}if(a.type==="set_guest_count"&&a.guests&&a.guests>=1&&a.guests<=5){const index=Math.min(g.length,Math.max(0,(rooms||1)-1));g[index]=a.guests;changed=true;}}
  if(ci&&co&&nightsBetween(ci,co)<1){setCheckin(ci);setCheckout("");setStep("checkout");add("assistant",tone.invalidCheckout);return;}setCheckin(ci);setCheckout(co);setRoomCount(rooms);setGroups(g);if(!changed&&clarify){add("assistant",clarify);return;}if(!ci){setStep("checkin");add("assistant",clarify||tone.invalidDate);return;}if(!co){setStep("checkout");add("assistant",clarify||tone.checkout);return;}if(!rooms){setStep("rooms");add("assistant",clarify||tone.rooms);return;}if(g.length<rooms||g.some(x=>!x)){setStep("guests");add("assistant",clarify||tone.guests(g.length+1));return;}setStep("preferences");add("assistant",clarify||tone.preferences);}
 async function submit(e:FormEvent){e.preventDefault();const value=input.trim();if(!value||turnLocked.current||!["checkin","checkout","rooms","guests"].includes(step))return;const current=step;setInput("");const promise=interpret(value,current);const kind:MessageKind=current==="checkin"||current==="checkout"?"date":current==="rooms"?"room":"guest";if(!await beginUserTurn(value,kind,current==="rooms"?"❤️":"👍"))return;setTyping(true);try{const command=await promise;setTyping(false);await applyCommand(command);}catch{setTyping(false);add("assistant",tone.invalidDate);}finally{endUserTurn();}}
 async function chooseRooms(n:number){if(!await beginUserTurn(copy.roomLabel(n),"room","❤️"))return;setRoomCount(n);setGroups([]);setStep("guests");add("assistant",tone.guests(1));endUserTurn();}
 async function chooseGuests(n:number){if(!await beginUserTurn(copy.guestLabel(n),"guest","👍"))return;const next=[...groups,n];setGroups(next);if(roomCount&&next.length<roomCount)add("assistant",tone.guests(next.length+1));else{setStep("preferences");add("assistant",tone.preferences);}endUserTurn();}
 async function searchRooms(label:string){if(!await beginUserTurn(label,"normal","❤️"))return;setStep("searching");setFeedback("idle");add("assistant",tone.searching);setTyping(true);try{const result=await Promise.all(groups.map(async guests=>{const q=new URLSearchParams({checkin,checkout,guests:String(guests),lang:language});const r=await fetch(`/api/ai-room-finder/availability?${q}`,{cache:"no-store"});const p=await r.json();if(!r.ok||!p?.success)throw new Error();return Array.isArray(p.offers)?p.offers:[];}));setOffers(result);setActiveGroup(0);if(!(result[0]||[]).length){setStep("unavailable");add("assistant",tone.unavailable);}else{setStep("selecting");add("assistant",tone.results(1,groups[0]));}}catch{setStep("unavailable");add("assistant",tone.unavailable);}finally{setTyping(false);endUserTurn();}}
 async function selectOffer(offer:RoomOffer){if(turnLocked.current)return;const key=offerKey(offer);setSelectingOfferKey(key);try{if(!await beginUserTurn(`${copy.select}: ${offer.name}`,"room","❤️","quick"))return;const next=[...choices,{group:activeGroup+1,guests:groups[activeGroup],offer}];setChoices(next);add("assistant",tone.selected(offer.name));if(roomCount&&activeGroup+1<roomCount){const group=activeGroup+1;setActiveGroup(group);setFeedback("idle");add("assistant",tone.results(group+1,groups[group]));}else{setStep("breakfast");setFeedback("idle");}}finally{setSelectingOfferKey(null);endUserTurn();}}
 async function chooseBreakfast(value:boolean){if(!await beginUserTurn(value?copy.yesBreakfast:copy.noBreakfast,"normal",value?"❤️":"👍"))return;setBreakfast(value);setStep("complete");add("assistant",tone.finalizing);endUserTurn();}
 async function happy(){if(!await beginUserTurn(copy.feedbackYes,"normal","❤️"))return;setFeedback("happy");add("assistant",tone.feedbackYesReply);endUserTurn();}
 async function different(){if(!await beginUserTurn(copy.feedbackDifferent,"normal","👍"))return;setFeedback("different");add("assistant",tone.changePrompt);endUserTurn();}
 async function refineMode(mode:"type"|"floor"){const label=mode==="type"?copy.roomType:copy.floor;if(!await beginUserTurn(label,"normal","👍"))return;setFeedback(mode);add("assistant",mode==="type"?tone.refineType:tone.refineFloor);endUserTurn();}
 async function refine(filter:RoomFinderFilter){if(!await beginUserTurn(copy.filters[filter],"normal","👍"))return;setFilters(v=>v.includes(filter)?v:[...v,filter]);setFeedback("idle");add("assistant",tone.refined);endUserTurn();}
 async function fitGroup(){if(!await beginUserTurn(copy.group,"normal","❤️"))return;setPreferFit(true);setFeedback("idle");add("assistant",tone.refineGroup);endUserTurn();}
 return {copy,step,messages,input,setInput,checkin,checkout,roomCount,groups,filters,setFilters,offers,activeGroup,choices,feedback,breakfast,typing,selectingOfferKey,guestTotal,nights,visibleOffers,beginUserTurn,endUserTurn,reset,submit,chooseRooms,chooseGuests,searchRooms,selectOffer,chooseBreakfast,happy,different,refineMode,refine,fitGroup};
}
