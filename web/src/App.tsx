import LandingPage from "@/page/landing.tsx";
import AppBar from "@/components/appbar.tsx";
import BottomNavigationBar, { BottomNavigationBarItem } from "@/components/bottom-navigation-bar.tsx";
import { ClipboardList, History, Home, Plus, User } from "lucide-react";
import { Outlet, Route, Routes, useNavigate } from "react-router";
import HomePage from "@/page/home.tsx";
import MileageAccrualRequestPage from "@/page/mileage_accrual_request.tsx";
import MilesLedgers from "@/page/miles_ledgers.tsx";
import NotFoundPage from "@/page/notfound.tsx";
import Profile from "@/page/profile.tsx";
import Contributor from "@/page/contributor.tsx";
import CallbackPage from "@/page/auth0-callback.tsx";
import AuthErrorPage from "@/page/auth-error.tsx";
import ProtectedRoute from "@/components/protected-route.tsx";
import MileageAccrualTrackingPage from "@/page/accrual-request-tracking.tsx";
import { Toaster } from "sonner";
import { useTranslation } from 'react-i18next';

function Layout() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSelectTab = (value: string) => {
    navigate("/" + value);
  }

  return (
    <div className="min-h-screen bg-white">
      <AppBar />

      <main className="max-w-7xl lg:mx-auto p-4 sm:p-6 lg:p-8 pb-20 sm:pg-24">
        <Outlet />
      </main>

      <BottomNavigationBar onTabChange={handleSelectTab}>
        <BottomNavigationBarItem id="history" label={t('navigation.history')} icon={<History />} />
        <BottomNavigationBarItem id="tracking" label={t('navigation.tracking')} icon={<ClipboardList />} />
        <BottomNavigationBarItem id="home" label={t('navigation.home')} icon={<Home />} />
        <BottomNavigationBarItem id="request" label={t('navigation.request')} icon={<Plus />} />
        <BottomNavigationBarItem id="profile" label={t('navigation.profile')} icon={<User />} />
      </BottomNavigationBar>
    </div>
  )
}

function App() {
  return (
    <>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/auth-error" element={<AuthErrorPage />} />

        <Route element={<ProtectedRoute children={<Layout />} />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<MilesLedgers />} />
          <Route path="/request" element={<MileageAccrualRequestPage />} />
          <Route path="/tracking" element={<MileageAccrualTrackingPage />} />
        </Route>

        <Route path="/contributor" element={<Contributor />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
