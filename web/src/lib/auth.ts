import { config } from "@/config/env";
import type { User } from "@/types/auth";

export function isOnboarded(user: User | undefined, claimKey?: string): boolean {
  if (!user) return false;

  const claim = claimKey || config.auth0.onboardedClaim;
  const onboardedValue = user[claim];

  return onboardedValue === true;
}

export function getAccessToken(): Promise<string> {
  // This will be injected by the Auth0Provider context
  throw new Error("getAccessToken must be called within Auth0Provider context");
}
