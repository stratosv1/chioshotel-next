"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type Language = "el" | "en" | "de" | "fr" | "it" | "es" | "tr";
type FeatureKey =
  | "maxGuests" | "size" | "firstFloor" | "groundFloor" | "standAlone" | "stairs" | "noStairs"
  | "upperView" | "gardenView" | "kitchenette" | "kitchen" | "doubleBed" | "singleBed" | "sofaBed"
  | "oneSpace" | "twoSpacesNoDoor" | "twoSpaces" | "balcony" | "airCondition" | "wifi" | "coffeeMaker"
  | "kettle" | "fridge" | "flatScreen" | "nonSmoking" | "privateBathroom";

type RoomFacts = {
  maxGuests: number; size: number; floor: "firstFloor" | "groundFloor" | "standAlone";
  stairs?: boolean; upperView?: boolean; gardenView?: boolean; kitchenette?: boolean; kitchen?: boolean;
  doubleBeds?: number; singleBeds?: number; sofaBeds?: number; oneSpace?: boolean; twoSpacesNoDoor?: boolean;
  twoSpaces?: boolean; balcony?: boolean;
};

type RoomDetails = {
  name: string; category: string; badges: string[]; originalPrice: string; directPrice: string; saving: string;
  images: string[]; roomNumber: number; language: Language; selectButton: HTMLButtonElement | null;
};

const DETAILS_LANGUAGE: Record<string, Language> = {
  "Προβολή λεπτομερειών": "el", "View details": "en", "Details ansehen": "de",
  "Voir les détails": "fr", "Vedi dettagli": "it", "Ver detalles": "es", "Detayları gör": "tr",
};

const COPY: Record<Language, { saving: string; select: string; close: string; previous: string; next: string; photo: string; amenities: string }> = {
  el: { saving: "Εξοικονόμηση", select: "Επιλογή", close: "Κλείσιμο", previous: "Προηγούμενη φωτογραφία", next: "Επόμενη φωτογραφία", photo: "Φωτογραφία", amenities: "Παροχές δωματίου" },
  en: { saving: "You save", select: "Select", close: "Close", previous: "Previous photo", next: "Next photo", photo: "Photo", amenities: "Room amenities" },
  de: { saving: "Ersparnis", select: "Auswählen", close: "Schließen", previous: "Vorheriges Foto", next: "Nächstes Foto", photo: "Foto", amenities: "Zimmerausstattung" },
  fr: { saving: "Économie", select: "Sélectionner", close: "Fermer", previous: "Photo précédente", next: "Photo suivante", photo: "Photo", amenities: "Équipements de la chambre" },
  it: { saving: "Risparmio", select: "Seleziona", close: "Chiudi", previous: "Foto precedente", next: "Foto successiva", photo: "Foto", amenities: "Servizi della camera" },
  es: { saving: "Ahorro", select: "Seleccionar", close: "Cerrar", previous: "Foto anterior", next: "Foto siguiente", photo: "Foto", amenities: "Servicios de la habitación" },
  tr: { saving: "Tasarruf", select: "Seç", close: "Kapat", previous: "Önceki fotoğraf", next: "Sonraki fotoğraf", photo: "Fotoğraf", amenities: "Oda olanakları" },
};

const LABELS: Record<Language, Record<FeatureKey, string>> = {
  el: { maxGuests:"Έως {n} άτομα",size:"{n} m²",firstFloor:"Πρώτος όροφος",groundFloor:"Ισόγειο",standAlone:"Ανεξάρτητη μονάδα",stairs:"Πρόσβαση με σκάλες",noStairs:"Χωρίς σκάλες",upperView:"Θέα από ψηλά",gardenView:"Θέα στον κήπο",kitchenette:"Kitchenette",kitchen:"Πλήρης κουζίνα",doubleBed:"{n} διπλό κρεβάτι",singleBed:"{n} μονό κρεβάτι",sofaBed:"{n} καναπές-κρεβάτι",oneSpace:"Ενιαίος χώρος",twoSpacesNoDoor:"2 χώροι χωρίς ενδιάμεση πόρτα",twoSpaces:"2 χώροι",balcony:"Ιδιωτικό μπαλκόνι",airCondition:"Κλιματισμός",wifi:"Δωρεάν Wi‑Fi",coffeeMaker:"Καφετιέρα",kettle:"Βραστήρας",fridge:"Ψυγείο",flatScreen:"Τηλεόραση επίπεδης οθόνης",nonSmoking:"Δωμάτιο μη καπνιστών",privateBathroom:"Ιδιωτικό μπάνιο" },
  en: { maxGuests:"Up to {n} guests",size:"{n} m²",firstFloor:"First floor",groundFloor:"Ground floor",standAlone:"Independent unit",stairs:"Access by stairs",noStairs:"No stairs",upperView:"Upper-floor view",gardenView:"Garden view",kitchenette:"Kitchenette",kitchen:"Full kitchen",doubleBed:"{n} double bed",singleBed:"{n} single bed",sofaBed:"{n} sofa bed",oneSpace:"Open-plan space",twoSpacesNoDoor:"2 spaces, no connecting door",twoSpaces:"2 spaces",balcony:"Private balcony",airCondition:"Air conditioning",wifi:"Free Wi‑Fi",coffeeMaker:"Coffee maker",kettle:"Kettle",fridge:"Refrigerator",flatScreen:"Flat-screen TV",nonSmoking:"Non-smoking room",privateBathroom:"Private bathroom" },
  de: { maxGuests:"Bis zu {n} Gäste",size:"{n} m²",firstFloor:"Erster Stock",groundFloor:"Erdgeschoss",standAlone:"Unabhängige Einheit",stairs:"Zugang über Treppen",noStairs:"Keine Treppen",upperView:"Blick vom Obergeschoss",gardenView:"Gartenblick",kitchenette:"Kochnische",kitchen:"Voll ausgestattete Küche",doubleBed:"{n} Doppelbett",singleBed:"{n} Einzelbett",sofaBed:"{n} Schlafsofa",oneSpace:"Offener Raum",twoSpacesNoDoor:"2 Räume ohne Verbindungstür",twoSpaces:"2 Räume",balcony:"Privater Balkon",airCondition:"Klimaanlage",wifi:"Kostenloses WLAN",coffeeMaker:"Kaffeemaschine",kettle:"Wasserkocher",fridge:"Kühlschrank",flatScreen:"Flachbild-TV",nonSmoking:"Nichtraucherzimmer",privateBathroom:"Privates Bad" },
  fr: { maxGuests:"Jusqu’à {n} personnes",size:"{n} m²",firstFloor:"Premier étage",groundFloor:"Rez-de-chaussée",standAlone:"Unité indépendante",stairs:"Accès par escaliers",noStairs:"Sans escaliers",upperView:"Vue en hauteur",gardenView:"Vue sur le jardin",kitchenette:"Kitchenette",kitchen:"Cuisine complète",doubleBed:"{n} lit double",singleBed:"{n} lit simple",sofaBed:"{n} canapé-lit",oneSpace:"Espace ouvert",twoSpacesNoDoor:"2 espaces sans porte communicante",twoSpaces:"2 espaces",balcony:"Balcon privé",airCondition:"Climatisation",wifi:"Wi‑Fi gratuit",coffeeMaker:"Cafetière",kettle:"Bouilloire",fridge:"Réfrigérateur",flatScreen:"Télévision à écran plat",nonSmoking:"Chambre non-fumeurs",privateBathroom:"Salle de bain privée" },
  it: { maxGuests:"Fino a {n} ospiti",size:"{n} m²",firstFloor:"Primo piano",groundFloor:"Piano terra",standAlone:"Unità indipendente",stairs:"Accesso con scale",noStairs:"Senza scale",upperView:"Vista dal piano superiore",gardenView:"Vista giardino",kitchenette:"Angolo cottura",kitchen:"Cucina completa",doubleBed:"{n} letto matrimoniale",singleBed:"{n} letto singolo",sofaBed:"{n} divano letto",oneSpace:"Ambiente open space",twoSpacesNoDoor:"2 ambienti senza porta comunicante",twoSpaces:"2 ambienti",balcony:"Balcone privato",airCondition:"Aria condizionata",wifi:"Wi‑Fi gratuito",coffeeMaker:"Macchina da caffè",kettle:"Bollitore",fridge:"Frigorifero",flatScreen:"TV a schermo piatto",nonSmoking:"Camera non fumatori",privateBathroom:"Bagno privato" },
  es: { maxGuests:"Hasta {n} huéspedes",size:"{n} m²",firstFloor:"Primera planta",groundFloor:"Planta baja",standAlone:"Unidad independiente",stairs:"Acceso por escaleras",noStairs:"Sin escaleras",upperView:"Vista desde planta alta",gardenView:"Vista al jardín",kitchenette:"Cocina pequeña",kitchen:"Cocina completa",doubleBed:"{n} cama doble",singleBed:"{n} cama individual",sofaBed:"{n} sofá cama",oneSpace:"Espacio diáfano",twoSpacesNoDoor:"2 espacios sin puerta comunicante",twoSpaces:"2 espacios",balcony:"Balcón privado",airCondition:"Aire acondicionado",wifi:"Wi‑Fi gratis",coffeeMaker:"Cafetera",kettle:"Hervidor",fridge:"Frigorífico",flatScreen:"TV de pantalla plana",nonSmoking:"Habitación para no fumadores",privateBathroom:"Baño privado" },
  tr: { maxGuests:"En fazla {n} misafir",size:"{n} m²",firstFloor:"Birinci kat",groundFloor:"Zemin kat",standAlone:"Bağımsız birim",stairs:"Merdivenle erişim",noStairs:"Merdivensiz",upperView:"Üst kat manzarası",gardenView:"Bahçe manzarası",kitchenette:"Mini mutfak",kitchen:"Tam mutfak",doubleBed:"{n} çift kişilik yatak",singleBed:"{n} tek kişilik yatak",sofaBed:"{n} çekyat",oneSpace:"Açık plan alan",twoSpacesNoDoor:"Bağlantı kapısı olmayan 2 alan",twoSpaces:"2 alan",balcony:"Özel balkon",airCondition:"Klima",wifi:"Ücretsiz Wi‑Fi",coffeeMaker:"Kahve makinesi",kettle:"Su ısıtıcısı",fridge:"Buzdolabı",flatScreen:"Düz ekran TV",nonSmoking:"Sigara içilmeyen oda",privateBathroom:"Özel banyo" },
};

const ROOM_FACTS: Record<number, RoomFacts> = {
  1:{maxGuests:4,size:31,floor:"firstFloor",stairs:true,upperView:true,doubleBeds:2,singleBeds:2,twoSpacesNoDoor:true,balcony:true},
  2:{maxGuests:2,size:14,floor:"firstFloor",stairs:true,doubleBeds:2,oneSpace:true},
  3:{maxGuests:3,size:30,floor:"firstFloor",stairs:true,upperView:true,kitchenette:true,doubleBeds:1,singleBeds:1,twoSpacesNoDoor:true,balcony:true},
  4:{maxGuests:3,size:29,floor:"firstFloor",stairs:true,upperView:true,kitchenette:true,doubleBeds:1,sofaBeds:1,oneSpace:true,balcony:true},
  5:{maxGuests:3,size:24,floor:"groundFloor",gardenView:true,doubleBeds:1,singleBeds:1,oneSpace:true},
  6:{maxGuests:2,size:18,floor:"groundFloor",gardenView:true,doubleBeds:1,oneSpace:true},
  7:{maxGuests:3,size:27,floor:"groundFloor",gardenView:true,doubleBeds:1,sofaBeds:1,oneSpace:true},
  8:{maxGuests:4,size:40,floor:"standAlone",gardenView:true,kitchen:true,doubleBeds:1,singleBeds:2,twoSpaces:true,balcony:true},
  9:{maxGuests:4,size:40,floor:"standAlone",gardenView:true,kitchen:true,doubleBeds:1,singleBeds:2,twoSpaces:true,balcony:true},
  10:{maxGuests:4,size:45,floor:"standAlone",gardenView:true,kitchen:true,doubleBeds:1,sofaBeds:2,twoSpaces:true,balcony:true},
};

const ROOM_GALLERIES: Record<number, string[]> = {
  1:["/images/rooms/DSC07776-2-e1675109942622.webp","/images/rooms/DSC07769-1.webp","/images/rooms/----1-1.webp","/images/rooms/voulamandis-house-bathrooms-1.webp"],
  2:["/images/rooms/DSC07803-1.webp","/images/rooms/DSC07839.webp","/images/rooms/DSC07832.webp","/images/rooms/received_1385287484893642_1500478431120_1200x800_3240x2160-1.webp"],
  3:["/images/rooms/DSC07867-1.webp","/images/rooms/DSC07860-1.webp","/images/rooms/DSC07849-1.webp","/images/rooms/DSC07891-1.webp"],
  4:["/images/rooms/received_1748354861920234.webp","/images/rooms/received_1748358935253160.webp","/images/rooms/received_1748356725253381.webp","/images/rooms/received_1748356718586715.webp"],
  5:["/images/rooms/voulamandis-house-rooms.webp","/images/rooms/chios-hotels-triple-rooms_1646x1080.webp","/images/rooms/voulamandis-house-double-room-bathroom_1620x1080.webp","/images/rooms/hotels-chios-voulamandis_1620x1080.webp"],
  6:["/images/rooms/received_1753964631359257.webp","/images/rooms/received_1753964581359262.webp","/images/rooms/received_1753968691358851.webp","/images/rooms/received_1753969201358800.webp"],
  7:["/images/rooms/double-triple-room.jpg","/images/rooms/view-double-room-chios-hotels.webp","/images/rooms/double-room-bathroom.webp","/images/rooms/voulamandis-stone-bathroom.webp"],
  8:["/images/rooms/chios-apartments-voulamandis.webp","/images/rooms/chios-hotels-family-apartments.webp","/images/rooms/family-room.webp","/images/rooms/voulamandis-apartment-bathroom..webp"],
  9:["/images/rooms/chios-apartments-voulamandis.webp","/images/rooms/chios-hotels-family-apartments.webp","/images/rooms/family-room.webp","/images/rooms/voulamandis-apartment-bathroom..webp"],
  10:["/images/rooms/DSC07899.webp","/images/rooms/DSC07909.webp","/images/rooms/DSC07940.webp","/images/rooms/DSC07943.webp"],
};

const ICON: Record<FeatureKey,string> = { maxGuests:"👥",size:"📐",firstFloor:"↗️",groundFloor:"🌿",standAlone:"🏡",stairs:"🪜",noStairs:"🚫",upperView:"🌤️",gardenView:"🌱",kitchenette:"🥣",kitchen:"🍳",doubleBed:"🛏️",singleBed:"🛏️",sofaBed:"🛋️",oneSpace:"📏",twoSpacesNoDoor:"🚪",twoSpaces:"🧩",balcony:"🌞",airCondition:"❄️",wifi:"📶",coffeeMaker:"☕",kettle:"🫖",fridge:"🧊",flatScreen:"📺",nonSmoking:"🚭",privateBathroom:"🚿" };

function label(lang:Language,key:FeatureKey,n?:number){ return LABELS[lang][key].replace("{n}",String(n ?? "")); }
function roomNumber(value:string){ return Number(value.match(/(?:Room|Δωμάτιο|Zimmer|Chambre|Camera|Habitación|Oda|Apartment|Διαμέρισμα)\s*(10|[1-9])/i)?.[1]||0); }
function featureList(number:number,lang:Language){
  const f=ROOM_FACTS[number]; if(!f) return [] as {key:FeatureKey;text:string}[];
  const items:{key:FeatureKey;text:string}[]=[];
  const add=(key:FeatureKey,n?:number)=>items.push({key,text:label(lang,key,n)});
  add("maxGuests",f.maxGuests); add("size",f.size); add(f.floor); add(f.stairs?"stairs":"noStairs");
  if(f.upperView)add("upperView"); if(f.gardenView)add("gardenView"); if(f.kitchenette)add("kitchenette"); if(f.kitchen)add("kitchen");
  if(f.doubleBeds)add("doubleBed",f.doubleBeds); if(f.singleBeds)add("singleBed",f.singleBeds); if(f.sofaBeds)add("sofaBed",f.sofaBeds);
  if(f.oneSpace)add("oneSpace"); if(f.twoSpacesNoDoor)add("twoSpacesNoDoor"); if(f.twoSpaces)add("twoSpaces"); if(f.balcony)add("balcony");
  ["airCondition","wifi","coffeeMaker","kettle","fridge","flatScreen","nonSmoking","privateBathroom"].forEach((k)=>add(k as FeatureKey));
  return items;
}

function readRoomCard(button:HTMLButtonElement,language:Language):RoomDetails|null{
  const article=button.closest("article"); if(!article)return null;
  const name=article.querySelector("h2")?.textContent?.trim()||"Room";
  const paragraphs=Array.from(article.querySelectorAll("p"));
  const category=paragraphs.find((n)=>!n.classList.contains("line-through"))?.textContent?.trim()||"";
  const originalPrice=paragraphs.find((n)=>n.classList.contains("line-through"))?.textContent?.trim()||"";
  const directPrice=Array.from(article.querySelectorAll<HTMLElement>("p,strong")).map((n)=>n.textContent?.trim()||"").find((t)=>/€/.test(t)&&t!==originalPrice)||"";
  const number=roomNumber(name); const images=ROOM_GALLERIES[number]||[];
  const buttons=Array.from(article.querySelectorAll<HTMLButtonElement>("button"));
  const selectButton=buttons.find((item)=>!Object.prototype.hasOwnProperty.call(DETAILS_LANGUAGE,(item.textContent||"").trim()))||null;
  const original=Number(originalPrice.replace(/[^0-9,.]/g,"").replace(",",".")); const direct=Number(directPrice.replace(/[^0-9,.]/g,"").replace(",","."));
  const saving=Number.isFinite(original)&&Number.isFinite(direct)&&original>direct?`${Math.round(original-direct)} €`:"";
  return {name,category,badges:[],originalPrice,directPrice,saving,images,roomNumber:number,language,selectButton};
}

export function AiRoomDetailsEnhancer(){
  const [room,setRoom]=useState<RoomDetails|null>(null); const [photo,setPhoto]=useState(0); const [mounted,setMounted]=useState(false);
  useEffect(()=>setMounted(true),[]);
  useEffect(()=>{ const handle=(event:MouseEvent)=>{ const button=(event.target as HTMLElement|null)?.closest<HTMLButtonElement>("button"); const language=DETAILS_LANGUAGE[(button?.textContent||"").trim()]; if(!button||!language)return; const details=readRoomCard(button,language); if(!details)return; event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();setPhoto(0);setRoom(details);}; document.addEventListener("click",handle,true); return()=>document.removeEventListener("click",handle,true);},[]);
  useEffect(()=>{ if(!room)return; const y=window.scrollY; const prev={position:document.body.style.position,top:document.body.style.top,left:document.body.style.left,right:document.body.style.right,width:document.body.style.width,overflow:document.documentElement.style.overflow}; Object.assign(document.body.style,{position:"fixed",top:`-${y}px`,left:"0",right:"0",width:"100%"});document.documentElement.style.overflow="hidden"; return()=>{Object.assign(document.body.style,{position:prev.position,top:prev.top,left:prev.left,right:prev.right,width:prev.width});document.documentElement.style.overflow=prev.overflow;window.scrollTo(0,y);};},[room]);
  const image=useMemo(()=>room?.images[photo]||room?.images[0]||"",[room,photo]); if(!mounted||!room)return null; const t=COPY[room.language]; const features=featureList(room.roomNumber,room.language);
  return createPortal(<div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 sm:items-center sm:p-5" onMouseDown={(e)=>{if(e.currentTarget===e.target)setRoom(null);}} role="dialog" aria-modal="true" aria-label={room.name}>
    <section className="flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]" style={{overscrollBehavior:"contain"}} onWheel={(e)=>e.stopPropagation()} onTouchMove={(e)=>e.stopPropagation()}>
      <div className="relative shrink-0 bg-stone-950"><div className="relative w-full overflow-hidden bg-stone-950" style={{height:"min(38dvh,330px)"}}><img src={image} alt={`${room.name} ${t.photo.toLowerCase()} ${photo+1}`} className="absolute inset-0 h-full w-full object-contain" draggable={false}/></div>
      <button type="button" onClick={()=>setRoom(null)} className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl shadow-lg" aria-label={t.close}>×</button>
      {room.images.length>1?<><button type="button" onClick={()=>setPhoto(v=>(v-1+room.images.length)%room.images.length)} className="absolute left-3 top-[32%] flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-2xl shadow-lg" aria-label={t.previous}>‹</button><button type="button" onClick={()=>setPhoto(v=>(v+1)%room.images.length)} className="absolute right-3 top-[32%] flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-2xl shadow-lg" aria-label={t.next}>›</button></>:null}
      <div className="absolute right-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold shadow" style={{bottom:"76px"}}>{photo+1}/{room.images.length}</div>
      <div className="flex gap-2 overflow-x-auto border-t border-white/10 bg-stone-900 p-2.5 [scrollbar-width:none]">{room.images.map((src,i)=><button key={src} type="button" onClick={()=>setPhoto(i)} className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white shadow-sm ${i===photo?"border-white ring-2 ring-[#ff385c]":"border-white/70"}`} aria-label={`${t.photo} ${i+1}`}><img src={src} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false}/></button>)}</div></div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><h2 className="text-2xl font-black text-stone-950">{room.name}</h2><p className="mt-1 text-sm text-stone-500">{room.category}</p></div><div className="shrink-0 text-right">{room.originalPrice?<p className="text-xs text-stone-400 line-through">{room.originalPrice}</p>:null}<p className="text-2xl font-black text-[#43551b]">{room.directPrice}</p></div></div>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-stone-500">{t.amenities}</p><div className="mt-2 flex flex-wrap gap-2">{features.map(({key,text})=><span key={`${key}-${text}`} className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-[#f7f1e8] px-3 py-2 text-[12px] font-semibold text-stone-700"><span aria-hidden>{ICON[key]}</span>{text}</span>)}</div>
      {room.saving?<div className="mt-4 flex items-center justify-between rounded-2xl bg-[#f3f6e8] px-4 py-3 text-sm text-[#63752d]"><span>{t.saving}</span><strong>{room.saving}</strong></div>:null}
      <button type="button" onClick={()=>{room.selectButton?.click();setRoom(null);}} className="mt-4 w-full rounded-2xl bg-[#ff385c] px-5 py-3.5 text-base font-bold text-white shadow-sm">{t.select}</button></div>
    </section></div>,document.body);
}
