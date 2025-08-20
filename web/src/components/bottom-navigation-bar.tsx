import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router";

interface ActiveTabContextType  {
  activeTab: string;
  setActiveTab: (activeTab: string) => void;
  onTabChange?: (tab: string) => void;
}

const ActiveTabContext = createContext<undefined|ActiveTabContextType>(undefined)

export interface BottomNavigationBarItemProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: (tabID: string) => void;
}

export const BottomNavigationBarItem = (props: BottomNavigationBarItemProps) => {
  const activeTabCtx = useContext(ActiveTabContext);

  const handleClick = (tabID: string) => {
    props?.onClick?.(tabID);
    activeTabCtx?.onTabChange?.(tabID);
    activeTabCtx?.setActiveTab(props.id ?? "")
  }

  return (
    <button
      key={props.id}
      onClick={() => handleClick(props.id)}
      className={`flex flex-col items-center justify-center py-2 sm:py-3 px-1 sm:px-2 min-w-0 flex-1 transition-all duration-200 group ${
        activeTabCtx?.activeTab == props.id
          ? "text-purple-600"
          : "text-gray-500 hover:text-gray-700 active:scale-95"
      }`}
    >
      <div className={`p-1.5 sm:p-2 rounded-xl transition-all duration-200 ${
        activeTabCtx?.activeTab == props.id ? "bg-purple-100 scale-110" : "group-hover:bg-gray-100"
      }`}>
        {props.icon}
      </div>
      <span className={`text-xs sm:text-sm mt-1 leading-tight text-center transition-colors duration-200 ${
        activeTabCtx?.activeTab == props.id ? "text-purple-600 font-medium" : "text-gray-500"
      }`}>
        {props.label}
      </span>
    </button>
  )
}

export interface BottomNavigationBarProps {
  children?: React.ReactNode;
  className?: string;
  onTabChange?: (tabID: string) => void;
}

export default function BottomNavigationBar(props: BottomNavigationBarProps) {
  const [activeTab, setActiveTab] = useState<string>("")
  const location = useLocation();

  // Update active tab when location changes
  useEffect(() => {
    const currentPath = location.pathname;
    // Extract tab ID from pathname (remove leading slash)
    const tabId = currentPath === '/' ? 'home' : currentPath.substring(1);
    setActiveTab(tabId);
  }, [location.pathname]);

  return (
    <ActiveTabContext.Provider value={{activeTab, setActiveTab, onTabChange: props.onTabChange}}>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-pb">
        <div className="max-w-screen-xl mx-auto px-1 sm:px-2">
          <div className="flex items-center justify-around">
            {props.children}
          </div>
        </div>

        {/* Safe area for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-white"></div>
      </nav>
    </ActiveTabContext.Provider>
  )
}
