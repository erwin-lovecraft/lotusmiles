import type React from "react";
import { useAppSelector } from "@/app/hook.ts";
import { selectFetchProfileStatus, selectProfile } from "@/features/profile/profileSlice.ts";
import { Navigate } from "react-router";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const profile = useAppSelector(selectProfile);
  const fetchStatus = useAppSelector(selectFetchProfileStatus);

  if (fetchStatus !== "succeeded" && fetchStatus !== "failed") return;

  // if (!profile || !profile.onboarded) {
  //   return <Navigate to="/onboarding" replace />;
  // }

  return <>{children}</>;
}
