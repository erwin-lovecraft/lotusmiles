import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export function LoginPage() {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex justify-end p-4">
        <ThemeToggle />
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-3xl font-bold">Loyalty App</CardTitle>
            <CardDescription className="text-lg">Sign in to access your rewards and benefits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button onClick={handleLogin} className="w-full h-12 text-lg" size="lg">
              Sign In
            </Button>

            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                By signing in, you agree to our{" "}
                <a href="#" className="underline hover:text-foreground">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-foreground">
                  Privacy Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
