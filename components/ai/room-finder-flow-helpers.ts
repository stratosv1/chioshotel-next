export type TurnPace = "normal" | "quick";

export const TURN_TIMING: Record<TurnPace, { reaction: number; after: number }> = {
  normal: { reaction: 900, after: 380 },
  quick: { reaction: 600, after: 280 },
};
