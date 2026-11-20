import { EXTRA_STORIES } from "./extra-stories";
import { makeCase } from "./story";
import { BASE_STORIES } from "./stories";

export const ALL_STORIES = [...BASE_STORIES, ...EXTRA_STORIES];
export const SINTHETA_CASES = ALL_STORIES.map(makeCase);
