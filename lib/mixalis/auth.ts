import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const MIXALIS_SESSION_COOKIE = "mixalis_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;

type MixalisSessionPayload = {
  sub: string;
  exp: number;
};

function safeEqualText(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function getSessionSecret(): string | null {
  const secret = process.env.MIXALIS_SESSION_SECRET?.trim();
  return secret && secret.length >= 32 ? secret : null;
}

export function isMixalisAuthConfigured(): boolean {
  return Boolean(
    getSessionSecret() &&
      process.env.MIXALIS_PASSWORD_HASH?.trim() &&
      (process.env.MIXALIS_USERNAME?.trim() || "mixalis"),
  );
}

export function verifyMixalisCredentials(username: string, password: string): boolean {
  const expectedUsername = process.env.MIXALIS_USERNAME?.trim() || "mixalis";
  const passwordHashConfig = process.env.MIXALIS_PASSWORD_HASH?.trim();

  if (!passwordHashConfig || !safeEqualText(username.trim(), expectedUsername)) {
    return false;
  }

  const separatorIndex = passwordHashConfig.indexOf(":");
  if (separatorIndex <= 0 || separatorIndex === passwordHashConfig.length - 1) {
    return false;
  }

  const salt = passwordHashConfig.slice(0, separatorIndex);
  const expectedHashHex = passwordHashConfig.slice(separatorIndex + 1);

  try {
    const expectedHash = Buffer.from(expectedHashHex, "hex");
    const actualHash = scryptSync(password, salt, expectedHash.length);

    if (expectedHash.length === 0 || actualHash.length !== expectedHash.length) {
      return false;
    }

    return timingSafeEqual(actualHash, expectedHash);
  } catch {
    return false;
  }
}

export function createMixalisSessionToken(username: string): string | null {
  const secret = getSessionSecret();
  if (!secret) {
    return null;
  }

  const payload: MixalisSessionPayload = {
    sub: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

export function verifyMixalisSessionToken(token: string | undefined): MixalisSessionPayload | null {
  const secret = getSessionSecret();
  if (!secret || !token) {
    return null;
  }

  const [encodedPayload, providedSignature, ...rest] = token.split(".");
  if (!encodedPayload || !providedSignature || rest.length > 0) {
    return null;
  }

  const expectedSignature = createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  if (!safeEqualText(providedSignature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as MixalisSessionPayload;

    const expectedUsername = process.env.MIXALIS_USERNAME?.trim() || "mixalis";
    if (
      payload.sub !== expectedUsername ||
      !Number.isFinite(payload.exp) ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getMixalisSession(): Promise<MixalisSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(MIXALIS_SESSION_COOKIE)?.value;
  return verifyMixalisSessionToken(token);
}

export const mixalisSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/mixalis",
  maxAge: SESSION_TTL_SECONDS,
};
