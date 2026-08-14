export type TurnPace = "normal" | "quick";

export const TURN_TIMING: Record<TurnPace, { reaction: number; after: number }> = {
  normal: { reaction: 2200, after: 320 },
  quick: { reaction: 1300, after: 180 },
};
