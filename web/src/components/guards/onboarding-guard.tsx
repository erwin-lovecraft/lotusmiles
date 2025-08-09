import type React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router";
import { isOnboarded } from "@/lib/auth";
import type { User } from "@/types/auth";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { user } = useAuth0();

  if (!isOnboarded(user as User)) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
