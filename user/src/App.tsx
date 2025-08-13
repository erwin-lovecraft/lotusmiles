import LandingPage from "@/page/landing.tsx";
import AppBar from "@/components/appbar.tsx";
import BottomNavigationBar, { BottomNavigationBarItem } from "@/components/bottom-navigation-bar.tsx";
import { ClipboardList, History, Plus, User } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <AppBar/>

      <main className="p-4 sm:p-6 lg:p-8 pb-20 sm:pg-24">
        <LandingPage/>
      </main>

      <BottomNavigationBar>
        <BottomNavigationBarItem id="home" index label="Home" icon={<User/>} />
        <BottomNavigationBarItem id="history" label="History" icon={<History/>} />
        <BottomNavigationBarItem id="request" label="Request" icon={<Plus/>} />
        <BottomNavigationBarItem id="tracking" label="Tracking" icon={<ClipboardList/>} />
      </BottomNavigationBar>
    </div>
  )
}

export default App
