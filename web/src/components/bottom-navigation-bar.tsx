import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useState
} from "react";

type ActiveTabContextType = {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>
}

const ActiveTabContext = createContext<ActiveTabContextType|undefined>(undefined);

type BottomNavigationBarItemProps = {
  icon: ReactNode;
  title: string;
  index?: boolean;
  onClick?: () => void;
}

export function BottomNavigationBarItem(props: BottomNavigationBarItemProps) {
  const ctx = useContext(ActiveTabContext);
  if (!ctx) {
    throw new Error("No activeTab context.");
  }

  useEffect(() => {
    if (props.index) {
      ctx.setActiveTab(props.title)
    }
  }, [])

  const handleClick = async () => {
    ctx.setActiveTab(props.title);

    if (props.onClick) {
      props.onClick();
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`flex flex-col items-center py-2 ${ctx.activeTab === props.title ? "text-primary" : "text-slate-500"}`}
    >
      {props.icon}
      <span className="text-xs">{props.title}</span>
    </button>
  )
}

type BottomNavigationProps = {
  children: ReactNode;
}

export default function BottomNavigationBar(props: BottomNavigationProps) {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <ActiveTabContext.Provider value={{activeTab, setActiveTab}}>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2">
        <div className="flex justify-around">
          {props.children}
        </div>
      </div>
    </ActiveTabContext.Provider>
  )
}
