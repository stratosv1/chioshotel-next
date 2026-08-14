export type OfferIdentity = {
  roomId: string;
  unitId: string;
};

export function roomOfferKey(offer: OfferIdentity) {
  return `${offer.roomId}:${offer.unitId}`;
}

function distinctKeys(group: readonly OfferIdentity[], reserved: ReadonlySet<string>) {
  const keys: string[] = [];
  const seen = new Set<string>();

  for (const offer of group) {
    const key = roomOfferKey(offer);
    if (reserved.has(key) || seen.has(key)) continue;
    seen.add(key);
    keys.push(key);
  }

  return keys;
}

export function hasDistinctOfferPlan(
  groups: readonly (readonly OfferIdentity[])[],
  reserved: ReadonlySet<string> = new Set<string>(),
) {
  if (groups.length === 0) return true;

  const options = groups
    .map(group => distinctKeys(group, reserved))
    .sort((left, right) => left.length - right.length);

  if (options.some(group => group.length === 0)) return false;

  const used = new Set(reserved);

  function assign(groupIndex: number): boolean {
    if (groupIndex >= options.length) return true;

    for (const key of options[groupIndex]) {
      if (used.has(key)) continue;
      used.add(key);
      if (assign(groupIndex + 1)) return true;
      used.delete(key);
    }

    return false;
  }

  return assign(0);
}

export function feasibleOffersForGroup<T extends OfferIdentity>(
  groups: readonly (readonly T[])[],
  groupIndex: number,
  reserved: ReadonlySet<string>,
) {
  const current = groups[groupIndex] || [];
  const remaining = groups.slice(groupIndex + 1);
  const seen = new Set<string>();

  return current.filter(offer => {
    const key = roomOfferKey(offer);
    if (reserved.has(key) || seen.has(key)) return false;
    seen.add(key);

    const nextReserved = new Set(reserved);
    nextReserved.add(key);
    return hasDistinctOfferPlan(remaining, nextReserved);
  });
}
