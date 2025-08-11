import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const { loginWithRedirect, isLoading } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
            ></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome to LoyaltyApp</h1>
        <p className="text-slate-600 mb-8">Earn rewards with every purchase and unlock exclusive benefits</p>

        <Button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors duration-200 mb-4"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </div>
          ) : (
            "Sign In / Sign Up"
          )}
        </Button>

        <p className="text-xs text-slate-500">Powered by Auth0 Universal Login</p>
      </div>
    </div>
  );
}
