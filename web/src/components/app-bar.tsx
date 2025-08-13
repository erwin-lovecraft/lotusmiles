import { useAuth0 } from "@auth0/auth0-react";

type AppBarProps = {
  onSettingClick: () => void;
}

export default function AppBar(props: AppBarProps) {
  const {user} = useAuth0();

  return (
    <div className="bg-white shadow-sm px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={
              user?.picture ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"
            }
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h1 className="text-lg font-semibold text-slate-800">
              Welcome back, {user?.given_name || user?.name || "User"}!
            </h1>
            <p className="text-sm text-slate-600">Gold Member</p>
          </div>
        </div>
        <button
          onClick={props.onSettingClick}
          className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  )
}
