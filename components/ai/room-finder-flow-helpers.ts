export type TurnPace = "normal" | "quick";

export const TURN_TIMING: Record<TurnPace, { reaction: number; after: number }> = {
  normal: { reaction: 1350, after: 320 },
  quick: { reaction: 780, after: 240 },
};
