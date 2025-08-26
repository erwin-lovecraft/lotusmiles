import { LandingPage } from "@/pages/landing.tsx";
import { Outlet, Route, Routes, useLocation, useNavigate } from "react-router";
import HomePage from "@/pages/home.tsx";
import AppBar from "@/components/appbar.tsx";
import Footer from "@/components/footer.tsx";
import Navbar, { NavbarItem } from "@/components/navbar.tsx";
import { BarChart2, FileText, Settings } from "lucide-react";
import AnalyticsPage from "@/pages/analytics.tsx";
import TransactionsPage from "@/pages/transactions.tsx";
import CallbackPage from "@/pages/auth0-callback.tsx";
import AuthErrorPage from "@/pages/auth-error.tsx";
import ProtectedRoute from "@/components/protected-route.tsx";
import { useTranslation } from "react-i18next";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const onChangePage = (page: string) => {
    navigate("/" + page);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppBar />
      <Navbar activePage={location.pathname} onPageChange={onChangePage}>
        <NavbarItem id="home" index title={t('navigation.milesAccrualRequests')} icon={<Settings className="w-4 h-4" />} />
        <NavbarItem id="transactions" title={t('navigation.milesTransactions')} icon={<FileText className="w-4 h-4" />} />
        <NavbarItem id="analytics" title={t('navigation.reports')} icon={<BarChart2 className="w-4 h-4" />} />
      </Navbar>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/auth-error" element={<AuthErrorPage />} />

      <Route element={<ProtectedRoute children={<Layout />} />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
