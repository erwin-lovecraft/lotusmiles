import { Button } from "@/components/ui/button.tsx";
import { Bell, LogOut, Plane, User } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";

export default function AppBar() {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect();
  }

  const handleLogout = async () => {
    await logout({ logoutParams: { returnTo: window.location.origin } });
  }

  return (
    <header className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="relative">
            <div
              className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Plane className="w-4 h-4 sm:w-6 sm:h-6 fill-current text-white" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {!isAuthenticated ? (
            <Button
              onClick={handleLogin}
              size="default"
              variant="ghost"
              className="rounded-lg"
            >
              <User />
              <span className="hidden sm:inline">Login</span>
              <span className="sm:hidden">Login</span>
            </Button>
          ) : (
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* User info - hide name on mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex items-center space-x-2 sm:space-x-3 text-gray-700">
                    <Avatar className="w-8 h-8 sm:w-8 sm:h-8 rounded-lg">
                      <AvatarImage
                        src={user?.picture}
                        alt={user?.name}
                      />
                      <AvatarFallback
                        className="bg-gradient-to-br from-purple-600 to-pink-500 text-white text-xs sm:text-sm grayscale">
                        {user?.name?.split(" ").filter(Boolean).map(w => w[0].toUpperCase()).join("") || "ME"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm sm:text-base">{user?.name}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
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
                      <span className="text-sm sm:text-base">{user?.name}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Bell />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
