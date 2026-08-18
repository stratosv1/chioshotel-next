export type RoomFinderAssistantLanguage = "el" | "en" | "fr" | "de" | "it" | "es" | "tr";

export type RoomFinderPreference =
  | "ground_floor"
  | "no_stairs"
  | "kitchen"
  | "balcony"
  | "garden"
  | "budget"
  | "family";

export type RoomFinderConversationStep =
  | "checkin"
  | "checkout"
  | "rooms"
  | "guests"
  | "searching"
  | "selecting"
  | "breakfast"
  | "complete"
  | "unavailable";

export type RoomFinderActionType =
  | "set_stay_dates"
  | "set_room_count"
  | "set_guest_count"
  | "set_preferences"
  | "restart_search"
  | "ask_clarification"
  | "no_change";

export type RoomFinderAction = {
  type: RoomFinderActionType;
  checkin?: string;
  checkout?: string;
  nights?: number;
  roomCount?: number;
  totalGuests?: number;
  guests?: number;
  guestRoom?: number;
  preferences?: RoomFinderPreference[];
  query?: string;
  missingFields?: string[];
};

export type RoomFinderCommand = {
  language: RoomFinderAssistantLanguage;
  replyMode: "execute" | "clarify";
  actions: RoomFinderAction[];
};

export type RoomFinderConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

export type RoomFinderConversationContext = {
  checkin?: string;
  checkout?: string;
  roomCount?: number;
  totalGuests?: number;
  guestGroups?: number[];
  currentRoom?: number;
  currentStep?: RoomFinderConversationStep;
  language?: RoomFinderAssistantLanguage;
  preferences?: RoomFinderPreference[];
  recentMessages?: RoomFinderConversationMessage[];
};
