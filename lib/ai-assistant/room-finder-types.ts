export type RoomFinderAssistantLanguage = "el" | "en" | "fr" | "de" | "it" | "es" | "tr";

export type RoomFinderPreference =
  | "ground_floor"
  | "no_stairs"
  | "kitchen"
  | "balcony"
  | "garden"
  | "budget"
  | "family";

export type RoomFinderDestinationKind = "property" | "island" | "other";

export type RoomFinderConversationStep =
  | "destination"
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
  | "set_stay_destination"
  | "set_stay_dates"
  | "set_room_count"
  | "set_guest_count"
  | "set_preferences"
  | "restart_search"
  | "ask_clarification"
  | "acknowledge_contact"
  | "answer_property_question"
  | "request_live_availability"
  | "no_change";

export type RoomFinderAction = {
  type: RoomFinderActionType;
  destination?: string;
  destinationKind?: RoomFinderDestinationKind;
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
  knowledgeIds?: string[];
  answer?: string;
  grounded?: boolean;
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
  stayDestination?: string;
  destinationKind?: RoomFinderDestinationKind;
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
