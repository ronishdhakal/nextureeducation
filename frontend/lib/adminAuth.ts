import "server-only";

export const ACCESS_COOKIE = "nx_access";
export const REFRESH_COOKIE = "nx_refresh";

export const ACCESS_MAX_AGE = 60 * 60 * 8; // 8 hours, matches SIMPLE_JWT access lifetime
export const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, matches SIMPLE_JWT refresh lifetime

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};
