import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { Loader2 } from "lucide-react";

import { AuthGuard } from "@/components/guards/auth-guard";
import { OnboardingGuard } from "@/components/guards/onboarding-guard";
import { LoginPage } from "@/pages/login";
import { OnboardingPage } from "@/pages/onboarding";
import { HomePage } from "@/pages/home";

import { setTokenGetter } from "@/lib/http";
import { Toaster } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/hook.ts";
import { fetchMyProfile, selectProfile } from "@/features/profile/profileSlice.ts";

import "./App.css";

function AppRoutes() {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const profile = useAppSelector(selectProfile);

  // Set up token getter for HTTP client
  useEffect(() => {
    setTokenGetter(getAccessTokenSilently);
  }, [getAccessTokenSilently]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Fallback route logic
  const getFallbackRoute = () => {
    if (!isAuthenticated) return "/login";
    if (!profile || !profile.onboarded) return "/onboarding";
    return "/home";
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/onboarding"
        element={
          <AuthGuard>
            <OnboardingPage />
          </AuthGuard>
        }
      />

      <Route
        path="/home"
        element={
          <AuthGuard>
            <OnboardingGuard>
              <HomePage />
            </OnboardingGuard>
          </AuthGuard>
        }
      />

      <Route path="/*" element={<Navigate to={getFallbackRoute()} replace />} />
    </Routes>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth0();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isAuthenticated) return;

    dispatch(fetchMyProfile());
  }, [dispatch, isAuthenticated]);

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  );
}
