import type { RoomFinderFilter } from "./room-finder-copy";
import type { RoomOffer } from "./room-finder-carousel";

export type TurnPace = "normal" | "quick";
export const TURN_TIMING: Record<TurnPace,{reaction:number;after:number}> = {
  normal:{reaction:1500,after:320},
  quick:{reaction:900,after:180},
};

export const wait = (ms:number) => new Promise<void>(resolve=>window.setTimeout(resolve,ms));
export const rid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const nightsBetween = (a:string,b:string) => Math.round((Date.parse(`${b}T12:00:00Z`)-Date.parse(`${a}T12:00:00Z`)) / 86400000);
export const isIso = (v:string) => /^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(`${v}T12:00:00Z`));
export const roomKey = (room:RoomOffer) => `${room.roomId}:${room.unitId}`;
export const rankRoom = (room:RoomOffer) => {
  const order=[2,6,5,7,1,3,4,8,9,10];
  const index=order.indexOf(Number(room.roomNumber));
  return index<0?99:index;
};
export const matchesRoomFilter = (room:RoomOffer,filter:RoomFinderFilter) => {
  const n=Number(room.roomNumber);
  if(filter==="economy")return[2,6].includes(n);
  if(filter==="noStairs"||filter==="ground")return[5,6,7].includes(n);
  if(filter==="first")return[1,2,3,4].includes(n);
  if(filter==="kitchen")return[3,4,8,9,10].includes(n);
  if(filter==="family")return[8,9,10].includes(n);
  if(filter==="balcony")return[1,4].includes(n);
  return[5,6,7,8,9,10].includes(n);
};
