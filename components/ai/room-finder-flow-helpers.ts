export type TurnPace = "normal" | "quick";

export const TURN_TIMING: Record<TurnPace, { reaction: number; after: number }> = {
  normal: { reaction: 650, after: 170 },
  quick: { reaction: 420, after: 130 },
};
