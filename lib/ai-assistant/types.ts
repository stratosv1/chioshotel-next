export type AssistantLanguage = "el" | "en" | "fr" | "de" | "it" | "es" | "tr";

export type AssistantActionType =
  | "search_availability"
  | "recommend_rooms"
  | "show_room"
  | "show_gallery"
  | "compare_rooms"
  | "answer_room_question"
  | "search_content"
  | "recommend_beaches"
  | "recommend_villages"
  | "recommend_museums"
  | "recommend_activities"
  | "build_itinerary"
  | "answer_property_question"
  | "show_directions"
  | "start_booking_request"
  | "ask_clarification";

export type AssistantPreferences = {
  floor?: "ground" | "first" | "any";
  noStairs?: boolean;
  kitchenette?: boolean;
  fullKitchen?: boolean;
  budget?: "lowest" | "standard" | "family" | "any";
  quiet?: boolean;
  familyFriendly?: boolean;
  suitableForChildren?: boolean;
  organized?: boolean;
  sandy?: boolean;
  sheltered?: boolean;
  nearby?: boolean;
};

export type AssistantAction = {
  type: AssistantActionType;
  roomNumber?: number;
  roomNumbers?: number[];
  checkin?: string;
  checkout?: string;
  nights?: number;
  guests?: number;
  days?: number;
  topic?: "rooms" | "beaches" | "villages" | "museums" | "activities" | "family" | "property" | "transport" | "general";
  query?: string;
  preferences?: AssistantPreferences;
  missingFields?: string[];
};

export type AssistantCommand = {
  language: AssistantLanguage;
  replyMode: "answer" | "execute" | "clarify";
  selectedRoom?: number;
  actions: AssistantAction[];
};

export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ConversationContext = {
  selectedRoom?: number;
  checkin?: string;
  checkout?: string;
  guests?: number;
  language?: AssistantLanguage;
  recentMessages?: ConversationMessage[];
};