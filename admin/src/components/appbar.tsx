import { LogOut, Plane } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useAuth0 } from "@auth0/auth0-react";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslation } from "react-i18next";

export default function AppBar() {
  const { user, logout } = useAuth0();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await logout({ logoutParams: { returnTo: window.location.origin } });
  }

  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">Lotusmile</span>
              <p className="text-white/80 text-sm">Admin Portal</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <span className="text-white">{user?.name}</span>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('auth.logout')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
