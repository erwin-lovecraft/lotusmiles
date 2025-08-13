import { createContext, useContext, useEffect, useState } from "react";

interface ActivePageContextType {
  activePage: string;
  setActivePage: (activePage: string) => void;
  onPageChange?: (activePage: string) => void;
}

const ActivePageContext = createContext<undefined | ActivePageContextType>(undefined)

export interface NavbarItemProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  index?: boolean;
}

export function NavbarItem(props: NavbarItemProps) {
  const activePage = useContext(ActivePageContext);

  useEffect(() => {
    if (props.index) {
      activePage?.setActivePage(props.id)
    }
  }, [])

  const handleClick = async (pageID: string) => {
    props?.onClick?.();
    activePage?.setActivePage(pageID);
    activePage?.onPageChange?.(pageID);
  }

  return (
    <button
      key={props.id}
      onClick={() => handleClick(props.id)}
      className={`flex items-center space-x-2 px-3 py-4 border-b-2 transition-colors ${
        activePage?.activePage === props.id
          ? "border-purple-500 text-purple-600"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {props.icon}
      <span>{props.title}</span>
    </button>
  )
}

export interface NavbarProps {
  children: React.ReactNode;
  activePage?: string;
  onPageChange?: (page: string) => void;
}

export default function Navbar(props: NavbarProps) {
  const [activePage, setActivePage] = useState(props.activePage ?? "")

  return (
    <ActivePageContext.Provider value={{activePage, setActivePage, onPageChange: props.onPageChange}}>
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {props.children}
          </div>
        </div>
      </nav>
    </ActivePageContext.Provider>
  )
}
