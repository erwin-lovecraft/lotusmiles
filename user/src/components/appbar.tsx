import { Button } from "@/components/ui/button.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { LogOut, User } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import Logo from "@/components/logo.tsx";

export default function AppBar() {
  const {user, isAuthenticated, loginWithRedirect, logout} = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect();
  }

  const handleLogout = async () => {
    await logout({logoutParams: {returnTo: window.location.origin}});
  }

  return (
    <header className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="relative">
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Logo className="w-4 h-4 sm:w-6 sm:h-6 text-white"/>
            </div>
          </div>
          <span className="text-lg sm:text-xl font-semibold text-gray-900">Lotusmile</span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {!isAuthenticated ? (
            <Button
              onClick={handleLogin}
              size="default"
              variant="ghost"
              className="rounded-lg"
            >
              <User/>
              <span className="hidden sm:inline">Login</span>
              <span className="sm:hidden">Login</span>
            </Button>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* User info - hide name on mobile */}
              <div className="flex items-center space-x-2 sm:space-x-3 text-gray-700">
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8">
                  <AvatarImage
                    src={user?.picture}
                    alt={user?.name}
                  />
                  <AvatarFallback
                    className="bg-gradient-to-br from-purple-600 to-pink-500 text-white text-xs sm:text-sm">
                    USER
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm sm:text-base">{user?.name}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center space-x-1 sm:space-x-2 p-2 sm:px-3"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4"/>
                <span className="hidden sm:inline text-sm">Đăng xuất</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
