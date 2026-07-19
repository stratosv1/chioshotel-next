import { chiosHotelsGuide } from "@/content/chios-hotels-guide";

type DeepWiden<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? DeepWiden<U>[]
        : T extends object
          ? { -readonly [K in keyof T]: DeepWiden<T[K]> }
          : T;

export type ChiosHotelsGuideContent = DeepWiden<typeof chiosHotelsGuide>;
