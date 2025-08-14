import LandingPage from "@/page/landing.tsx";
import AppBar from "@/components/appbar.tsx";
import BottomNavigationBar, { BottomNavigationBarItem } from "@/components/bottom-navigation-bar.tsx";
import { ClipboardList, History, Home, Plus, User } from "lucide-react";
import { Outlet, Route, Routes, useNavigate } from "react-router";
import HomePage from "@/page/home.tsx";
import MileageAccrualRequestPage from "@/page/mileage_accrual_request.tsx";
import MilesLedgers from "@/page/miles_ledgers.tsx";
import MileageAccrualHistoryPage from "@/page/mileage_accrual_history.tsx";
import NotFoundPage from "@/page/notfound.tsx";
import Profile from "@/page/profile.tsx";
import Contributor from "@/page/contributor.tsx";

function Layout() {
  const navigate = useNavigate();

  const handleSelectTab = (value: string) => {
    navigate("/" + value);
  }

  return (
    <div className="min-h-screen bg-white">
      <AppBar/>

      <main className="max-w-7xl lg:mx-auto p-4 sm:p-6 lg:p-8 pb-20 sm:pg-24">
        <Outlet/>
      </main>

      <BottomNavigationBar onTabChange={handleSelectTab}>
        <BottomNavigationBarItem id="history" label="History" icon={<History/>}/>
        <BottomNavigationBarItem id="tracking" label="Tracking" icon={<ClipboardList/>}/>
        <BottomNavigationBarItem id="home" index label="Home" icon={<Home/>}/>
        <BottomNavigationBarItem id="request" label="Request" icon={<Plus/>}/>
        <BottomNavigationBarItem id="profile" label="Profile" icon={<User/>}/>
      </BottomNavigationBar>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route index element={<LandingPage/>}/>

      <Route element={<Layout/>}>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/history" element={<MilesLedgers/>}/>
        <Route path="/request" element={<MileageAccrualRequestPage/>}/>
        <Route path="/tracking" element={<MileageAccrualHistoryPage/>}/>
        <Route path="/callback" element={<HomePage/>}/>
      </Route>

      <Route path="/contributor" element={<Contributor />} />
      <Route path="*" element={<NotFoundPage/>}/>
    </Routes>
  )
}

export default App
