/**
 * Ref 19: the conversation survives a page reload. On phones the browser
 * often reloads the page when the guest comes back from WhatsApp, a room page
 * or another tab; like any chat, the Room Finder then shows the same
 * conversation instead of starting over. Kept in sessionStorage (this tab
 * only) for at most 24 hours; "New search" clears it.
 */

export const ROOM_FINDER_SNAPSHOT_KEY = "voulamandis-room-finder-v1";
export const ROOM_FINDER_SNAPSHOT_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export type RoomFinderSnapshot<State> = {
  v: 1;
  savedAt: number;
  language: string;
  sessionId: string;
  state: State;
};

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function storage(): StorageLike | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    return null;
  }
}

export function saveRoomFinderSnapshot<State>(
  snapshot: Omit<RoomFinderSnapshot<State>, "v" | "savedAt">,
  store: StorageLike | null = storage(),
  now = Date.now(),
) {
  if (!store) return;
  try {
    store.setItem(ROOM_FINDER_SNAPSHOT_KEY, JSON.stringify({ v: 1, savedAt: now, ...snapshot }));
  } catch {
    // Full or blocked storage: the chat simply is not kept.
  }
}

/** The saved conversation, or null when there is none, it is too old or broken. */
export function loadRoomFinderSnapshot<State>(
  store: StorageLike | null = storage(),
  now = Date.now(),
): RoomFinderSnapshot<State> | null {
  if (!store) return null;
  try {
    const raw = store.getItem(ROOM_FINDER_SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RoomFinderSnapshot<State>;
    const fresh = parsed?.v === 1
      && typeof parsed.savedAt === "number"
      && now - parsed.savedAt >= 0
      && now - parsed.savedAt < ROOM_FINDER_SNAPSHOT_MAX_AGE_MS;
    if (!fresh || typeof parsed.language !== "string" || !parsed.state || typeof parsed.state !== "object") {
      store.removeItem(ROOM_FINDER_SNAPSHOT_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearRoomFinderSnapshot(store: StorageLike | null = storage()) {
  try {
    store?.removeItem(ROOM_FINDER_SNAPSHOT_KEY);
  } catch {
    // Nothing to clear.
  }
}
