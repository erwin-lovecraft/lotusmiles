import { useAuth0 } from "@auth0/auth0-react";
import { LogOut, User, Gift, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

export function HomePage() {
  const { user, logout } = useAuth0();

  const handleLogout = async () => {
    await logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-semibold">Loyalty Dashboard</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.picture || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback className="text-lg">{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-xl">Welcome back!</CardTitle>
                <CardDescription className="text-base">{user?.name || user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Balance</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,250</div>
              <p className="text-xs text-muted-foreground">+20 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rewards Earned</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">2 available to redeem</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your loyalty account and rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <User className="mr-2 h-4 w-4" />
              View Profile
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Gift className="mr-2 h-4 w-4" />
              Browse Rewards
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Star className="mr-2 h-4 w-4" />
              Earn More Points
            </Button>
          </CardContent>
        </Card>

        {/* Debug Info (only in development) */}
        {import.meta.env.DEV && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                {JSON.stringify(
                  {
                    email: user?.email,
                    name: user?.name,
                    sub: user?.sub,
                    claims: Object.keys(user || {}).filter((key) => key.includes("://")),
                  },
                  null,
                  2
                )}
              </pre>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
