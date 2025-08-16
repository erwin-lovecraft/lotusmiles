import { Button } from "@/components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";

interface ProfileModalProps {
  onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const { logout, user } = useAuth0();

  const handleLogout = async () => {
    console.log("Logging out...");

    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-4 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Profile Settings</h2>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Profile Info */}
          <div className="text-center">
            <img
              src={
                user?.picture ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150"
              }
              alt="Profile"
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-slate-800">{user?.name || "User"}</h3>
            <p className="text-slate-600">{user?.email || "No email available"}</p>
          </div>

          {/* Settings Options */}
          <div className="space-y-1">
            <button className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
                <span className="font-medium text-slate-800">Edit Profile</span>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>

            <button className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-5 5v-5zM10.07 14C9.47 14 9 13.53 9 12.93s.47-1.07 1.07-1.07c.6 0 1.07.47 1.07 1.07S10.67 14 10.07 14z"
                  ></path>
                </svg>
                <span className="font-medium text-slate-800">Notifications</span>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>

            <button className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
                <span className="font-medium text-slate-800">Privacy & Security</span>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-red-600 transition-colors duration-200"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
